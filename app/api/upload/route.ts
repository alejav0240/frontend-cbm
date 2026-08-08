import { createHash, createHmac } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { dirname, join, posix } from "path";
import { NextRequest, NextResponse } from "next/server";
import {
  ONEDRIVE_GRAPH_BASE,
  fetchRefreshTokenFromBackend,
  getAccessToken,
  isOnedriveConfigured,
} from "@/app/api/onedrive/lib";

export const runtime = "nodejs";

type StorageTarget = "onedrive" | "r2" | "local";

type UploadResult = {
  storage: StorageTarget;
  url: string;
  key?: string;
  fallbackReason?: string;
};

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBaseUrl?: string;
};

type UploadMetadata = {
  pacienteId: string;
  pacienteNombre: string;
  numeroCiclo: string;
  grabadoEn: string;
  contentType: string;
};

type UploadSession = {
  uploadUrl: string;
  expirationDateTime?: string;
};

const LOCAL_UPLOAD_ROOT = "uploads";
const ROOT_FOLDER = "sesionesGrabadas";
const RESERVED_PATH_CHARS = /[<>:"/\\|?*\u0000-\u001f]/g;
const R2_REGION = "auto";
const R2_SERVICE = "s3";
const ONEDRIVE_CHUNK_SIZE = 10 * 1024 * 1024;
const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);
const MAX_CHUNK_ATTEMPTS = 3;

class OneDriveNotConfiguredError extends Error {}

const getString = (data: FormData, key: string) => {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const sanitizePathSegment = (value: string, fallback: string) => {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(RESERVED_PATH_CHARS, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[ .-]+|[ .-]+$/g, "");

  return normalized || fallback;
};

const formatDateForFile = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return (
    [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join(
      "-",
    ) +
    `_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`
  );
};

const buildRecordingPath = (metadata: UploadMetadata) => {
  const patientFolder = `${sanitizePathSegment(metadata.pacienteId, "sin-id")}-${sanitizePathSegment(
    metadata.pacienteNombre,
    "sin-nombre",
  )}`;
  const cycleFolder = sanitizePathSegment(
    metadata.numeroCiclo || "sin-ciclo",
    "sin-ciclo",
  );
  const recordedAt = metadata.grabadoEn
    ? new Date(metadata.grabadoEn)
    : new Date();
  const safeDate = Number.isNaN(recordedAt.getTime()) ? new Date() : recordedAt;
  const fileName = `${formatDateForFile(safeDate)}.webm`;

  return posix.join(ROOT_FOLDER, patientFolder, cycleFolder, fileName);
};

const encodeGraphPath = (path: string) =>
  path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

const readHeaderMetadata = (request: NextRequest): UploadMetadata => ({
  pacienteId: request.headers.get("x-paciente-id")?.trim() ?? "",
  pacienteNombre: request.headers.get("x-paciente-nombre")?.trim() ?? "",
  numeroCiclo:
    request.headers.get("x-numero-ciclo")?.trim() || "sin-ciclo",
  grabadoEn: request.headers.get("x-grabado-en")?.trim() ?? "",
  contentType:
    request.headers.get("content-type")?.trim() || "application/octet-stream",
});

// ─────────────────────────────────────────
// OneDrive (Graph API)
// ─────────────────────────────────────────

const createUploadSession = async (
  accessToken: string,
  itemPath: string,
  name: string,
): Promise<UploadSession> => {
  const url = `${ONEDRIVE_GRAPH_BASE}/me/drive/root:/${encodeGraphPath(itemPath)}:/createUploadSession`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "@microsoft.graph.conflictBehavior": "rename",
      item: {
        "@microsoft.graph.conflictBehavior": "rename",
        name,
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `createUploadSession failed: ${response.status} ${errorBody.slice(0, 300)}`,
    );
  }

  return (await response.json()) as UploadSession;
};

const createShareLink = async (accessToken: string, itemId: string) => {
  const response = await fetch(
    `${ONEDRIVE_GRAPH_BASE}/me/drive/items/${itemId}/createLink`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "view", scope: "anonymous" }),
      cache: "no-store",
    },
  );
  if (!response.ok) return null;
  const data = (await response.json()) as { link?: { webUrl?: string } };
  return data.link?.webUrl ?? null;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const sendChunk = async (
  uploadUrl: string,
  chunk: Buffer,
  start: number,
  total: number | null,
): Promise<Response> => {
  const end = start + chunk.length - 1;
  const contentRange = total
    ? `bytes ${start}-${end}/${total}`
    : `bytes ${start}-${end}/*`;

  let lastError: unknown = null;
  for (let attempt = 0; attempt < MAX_CHUNK_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Range": contentRange,
          "Content-Length": String(chunk.length),
        },
        body: new Uint8Array(chunk),
      });

      if (response.ok) return response;
      if (!RETRYABLE_STATUS.has(response.status)) {
        const errorBody = await response.text();
        throw new Error(
          `OneDrive chunk upload failed: ${response.status} ${errorBody.slice(0, 200)}`,
        );
      }
      lastError = new Error(`OneDrive chunk status ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < MAX_CHUNK_ATTEMPTS - 1) {
      await delay(500 * (attempt + 1));
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("OneDrive chunk upload failed");
};

const getAccessTokenAndSession = async (
  metadata: UploadMetadata,
): Promise<{ accessToken: string; itemPath: string; session: UploadSession }> => {
  const refreshToken = await fetchRefreshTokenFromBackend();
  if (!refreshToken) {
    throw new OneDriveNotConfiguredError("No hay refresh token de OneDrive");
  }
  const accessToken = await getAccessToken(refreshToken);

  const itemPath = buildRecordingPath(metadata);
  const itemName = itemPath.split("/").pop() || "sesion.webm";
  const session = await createUploadSession(accessToken, itemPath, itemName);

  return { accessToken, itemPath, session };
};

const finalizeOnedrive = async (
  accessToken: string,
  itemPath: string,
  result: { id?: string; webUrl?: string } | null,
): Promise<UploadResult> => {
  const itemId = result?.id;
  let shareUrl: string | null = null;
  if (itemId) {
    shareUrl = await createShareLink(accessToken, itemId);
  }
  const url = shareUrl || result?.webUrl;

  if (!url) {
    throw new Error("No se pudo obtener URL del archivo en OneDrive");
  }

  return {
    storage: "onedrive",
    url,
    key: itemPath,
  };
};

const uploadToOnedriveBuffer = async (
  body: Buffer,
  metadata: UploadMetadata,
): Promise<UploadResult> => {
  const { accessToken, itemPath, session } =
    await getAccessTokenAndSession(metadata);

  const totalBytes = body.length;
  if (totalBytes === 0) {
    throw new Error("Archivo vacío");
  }

  let offset = 0;
  let result: { id?: string; webUrl?: string } | null = null;

  while (offset < totalBytes) {
    const chunk = body.subarray(offset, offset + ONEDRIVE_CHUNK_SIZE);
    const response = await sendChunk(
      session.uploadUrl,
      Buffer.from(chunk),
      offset,
      totalBytes,
    );
    offset += chunk.length;
    if (offset >= totalBytes) {
      result = (await response.json()) as typeof result;
    }
  }

  return finalizeOnedrive(accessToken, itemPath, result);
};

const uploadToOnedriveStream = async (
  request: NextRequest,
  metadata: UploadMetadata,
): Promise<UploadResult> => {
  const { accessToken, itemPath, session } =
    await getAccessTokenAndSession(metadata);

  const contentLengthHeader = request.headers.get("content-length");
  const total = contentLengthHeader
    ? parseInt(contentLengthHeader, 10)
    : null;

  if (!request.body || total === null || Number.isNaN(total)) {
    const body = Buffer.from(await request.arrayBuffer());
    return uploadToOnedriveBuffer(body, metadata);
  }

  const reader = request.body.getReader();
  let sent = 0;
  let bufferedChunks: Buffer[] = [];
  let buffered = 0;
  let done = false;
  let result: { id?: string; webUrl?: string } | null = null;

  const flush = async (isLast: boolean) => {
    if (buffered === 0) return;
    const chunk = Buffer.concat(bufferedChunks, buffered);
    bufferedChunks = [];
    buffered = 0;
    const response = await sendChunk(session.uploadUrl, chunk, sent, total);
    sent += chunk.length;
    if (isLast) {
      result = (await response.json()) as typeof result;
    }
  };

  while (!done) {
    const { done: streamDone, value } = await reader.read();
    done = streamDone;
    if (value && value.length > 0) {
      bufferedChunks.push(Buffer.from(value));
      buffered += value.length;
    }
    if (!done && buffered >= ONEDRIVE_CHUNK_SIZE) {
      await flush(false);
    }
  }

  if (buffered > 0) {
    await flush(true);
  } else if (sent === 0) {
    throw new Error("Archivo vacío");
  } else if (sent < total) {
    throw new Error("Subida incompleta");
  }

  return finalizeOnedrive(accessToken, itemPath, result);
};

// ─────────────────────────────────────────
// Cloudflare R2 (fallback)
// ─────────────────────────────────────────

const getR2Config = (): R2Config | null => {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    return null;
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicBaseUrl,
  };
};

const sha256Hex = (value: Buffer | string) =>
  createHash("sha256").update(value).digest("hex");

const hmac = (key: Buffer | string, value: string) =>
  createHmac("sha256", key).update(value).digest();

const hmacHex = (key: Buffer | string, value: string) =>
  createHmac("sha256", key).update(value).digest("hex");

const getSignatureKey = (secretAccessKey: string, dateStamp: string) => {
  const kDate = hmac(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = hmac(kDate, R2_REGION);
  const kService = hmac(kRegion, R2_SERVICE);
  return hmac(kService, "aws4_request");
};

const encodeR2Key = (key: string) =>
  key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

const buildPublicUrl = (config: R2Config, key: string) => {
  if (!config.publicBaseUrl) return `r2://${config.bucket}/${key}`;

  return `${config.publicBaseUrl.replace(/\/$/, "")}/${encodeR2Key(key)}`;
};

const uploadToR2 = async (
  body: Buffer,
  key: string,
  contentType: string,
): Promise<UploadResult> => {
  const config = getR2Config();
  if (!config) {
    throw new Error("Cloudflare R2 is not configured");
  }

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const host = `${config.accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = `/${config.bucket}/${encodeR2Key(key)}`;
  const payloadHash = sha256Hex(body);
  const credentialScope = `${dateStamp}/${R2_REGION}/${R2_SERVICE}/aws4_request`;
  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalHeaders = [
    `content-type:${contentType}`,
    `host:${host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
    "",
  ].join("\n");
  const canonicalRequest = [
    "PUT",
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");
  const signature = hmacHex(
    getSignatureKey(config.secretAccessKey, dateStamp),
    stringToSign,
  );
  const authorization = [
    `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}`,
    `SignedHeaders=${signedHeaders}`,
    `Signature=${signature}`,
  ].join(", ");

  const response = await fetch(`https://${host}${canonicalUri}`, {
    method: "PUT",
    headers: {
      Authorization: authorization,
      "Content-Type": contentType,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
    },
    body: body.buffer.slice(
      body.byteOffset,
      body.byteOffset + body.byteLength,
    ) as ArrayBuffer,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Cloudflare R2 upload failed: ${response.status} ${errorBody.slice(0, 200)}`,
    );
  }

  return {
    storage: "r2",
    url: buildPublicUrl(config, key),
    key,
  };
};

const saveLocal = async (
  body: Buffer,
  relativePath: string,
  fallbackReason?: string,
): Promise<UploadResult> => {
  const localPath = join(
    process.cwd(),
    "public",
    LOCAL_UPLOAD_ROOT,
    relativePath,
  );
  await mkdir(dirname(localPath), { recursive: true });
  await writeFile(localPath, body);

  return {
    storage: "local",
    url: `/${LOCAL_UPLOAD_ROOT}/${relativePath}`,
    fallbackReason,
  };
};

const uploadFallback = async (
  body: Buffer,
  metadata: UploadMetadata,
  reason: string,
): Promise<UploadResult> => {
  const relativePath = buildRecordingPath(metadata);
  console.error("OneDrive upload failed. Falling back:", reason);
  try {
    return await uploadToR2(body, relativePath, metadata.contentType);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Cloudflare R2 error";
    console.error("Cloudflare R2 upload failed. Saving locally:", message);
    return saveLocal(body, relativePath, message);
  }
};

export async function POST(request: NextRequest) {
  try {
    const contentTypeHeader = request.headers.get("content-type") || "";
    const isMultipart = contentTypeHeader.includes("multipart/form-data");

    if (isMultipart) {
      const data = await request.formData();
      const file = data.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json(
          { success: false, message: "No file uploaded" },
          { status: 400 },
        );
      }

      const metadata: UploadMetadata = {
        pacienteId: getString(data, "pacienteId"),
        pacienteNombre: getString(data, "pacienteNombre"),
        numeroCiclo: getString(data, "numeroCiclo") || "sin-ciclo",
        grabadoEn: getString(data, "grabadoEn"),
        contentType: file.type || "video/webm",
      };
      const body = Buffer.from(await file.arrayBuffer());

      if (isOnedriveConfigured()) {
        try {
          const onedriveResult = await uploadToOnedriveBuffer(body, metadata);
          return NextResponse.json({ success: true, ...onedriveResult });
        } catch (error) {
          const reason =
            error instanceof Error ? error.message : "OneDrive error";
          const result = await uploadFallback(body, metadata, reason);
          return NextResponse.json({ success: true, ...result });
        }
      }

      const result = await uploadFallback(
        body,
        metadata,
        "OneDrive no configurado",
      );
      return NextResponse.json({ success: true, ...result });
    }

    // Streaming (raw body) path
    const metadata = readHeaderMetadata(request);

    if (isOnedriveConfigured()) {
      try {
        const onedriveResult = await uploadToOnedriveStream(request, metadata);
        return NextResponse.json({ success: true, ...onedriveResult });
      } catch (error) {
        if (error instanceof OneDriveNotConfiguredError) {
          const body = Buffer.from(await request.arrayBuffer());
          const result = await uploadFallback(body, metadata, error.message);
          return NextResponse.json({ success: true, ...result });
        }
        throw error;
      }
    }

    const body = Buffer.from(await request.arrayBuffer());
    const result = await uploadFallback(
      body,
      metadata,
      "OneDrive no configurado",
    );
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error uploading file";
    console.error("Error uploading file:", error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
