import { createHash, createHmac } from "crypto";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { mkdir, writeFile } from "fs/promises";
import { dirname, join, posix } from "path";
import {
  ONEDRIVE_GRAPH_BASE,
  fetchRefreshTokenFromBackend,
  getAccessToken,
  isOnedriveConfigured,
} from "@/app/api/onedrive/lib";
import { firmarRutaLocal } from "./firma";

export type StorageTarget = "onedrive" | "r2" | "local";

export type UploadResult = {
  storage: StorageTarget;
  url: string;
  key?: string;
  fallbackReason?: string;
};

export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBaseUrl?: string;
};

export type UploadMetadata = {
  pacienteId: string;
  pacienteNombre: string;
  numeroCiclo: string;
  grabadoEn: string;
  contentType: string;
};

export type UploadSession = {
  uploadUrl: string;
  expirationDateTime?: string;
};

export const ROOT_FOLDER = "sesionesGrabadas";
const RESERVED_PATH_CHARS = /[<>:"/\\|?*\u0000-\u001f]/g;
const R2_REGION = "auto";
const R2_SERVICE = "s3";
export const ONEDRIVE_CHUNK_SIZE = 10 * 1024 * 1024;
export const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);
export const MAX_CHUNK_ATTEMPTS = 3;

export class OneDriveNotConfiguredError extends Error {}

export { isOnedriveConfigured };

export const causaDe = (error: unknown): string => {
  const causa = (error as { cause?: unknown })?.cause;
  if (causa instanceof Error && causa.message) return ` (causa: ${causa.message})`;
  return "";
};

export const fetchConTimeout = (url: string, init: RequestInit, ms: number) =>
  fetch(url, { ...init, signal: AbortSignal.timeout(ms) });

export const sanitizePathSegment = (value: string, fallback: string) => {
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

export const buildRecordingPath = (metadata: UploadMetadata) => {
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

export const encodeGraphPath = (path: string) =>
  path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

// ─────────────────────────────────────────
// OneDrive (Graph API)
// ─────────────────────────────────────────

export const createUploadSession = async (
  accessToken: string,
  itemPath: string,
  name: string,
): Promise<UploadSession> => {
  const url = `${ONEDRIVE_GRAPH_BASE}/me/drive/root:/${encodeGraphPath(itemPath)}:/createUploadSession`;
  const response = await fetchConTimeout(
    url,
    {
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
    },
    30_000,
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `createUploadSession failed: ${response.status} ${errorBody.slice(0, 300)}`,
    );
  }

  return (await response.json()) as UploadSession;
};

export const createShareLink = async (accessToken: string, itemId: string) => {
  let response: Response;
  try {
    response = await fetchConTimeout(
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
      30_000,
    );
  } catch (error) {
    console.error(
      `OneDrive: fallo al crear link compartido (item ${itemId})${causaDe(error)}`,
    );
    return null;
  }
  if (!response.ok) {
    console.error(`OneDrive: createLink respondió ${response.status}`);
    return null;
  }
  const data = (await response.json()) as { link?: { webUrl?: string } };
  return data.link?.webUrl ?? null;
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendChunk = async (
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
      const response = await fetchConTimeout(
        uploadUrl,
        {
          method: "PUT",
          headers: {
            "Content-Range": contentRange,
            "Content-Length": String(chunk.length),
          },
          body: new Uint8Array(chunk),
        },
        120_000,
      );

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
    ? new Error(
        `OneDrive: fallo al subir chunk (bytes ${start}-${end})${causaDe(lastError)}`,
        { cause: lastError },
      )
    : new Error("OneDrive chunk upload failed");
};

export const getAccessTokenAndSession = async (
  metadata: UploadMetadata,
): Promise<{ accessToken: string; itemPath: string; session: UploadSession }> => {
  const refreshToken = await fetchRefreshTokenFromBackend();
  if (!refreshToken) {
    throw new OneDriveNotConfiguredError("No hay refresh token de OneDrive");
  }
  let accessToken: string;
  try {
    accessToken = await getAccessToken(refreshToken);
  } catch (error) {
    throw new Error(
      `OneDrive: fallo al obtener access token${causaDe(error)}`,
      { cause: error },
    );
  }

  const itemPath = buildRecordingPath(metadata);
  const itemName = itemPath.split("/").pop() || "sesion.webm";
  let session: UploadSession;
  try {
    session = await createUploadSession(accessToken, itemPath, itemName);
  } catch (error) {
    throw new Error(
      `OneDrive: fallo al crear la sesión de subida${causaDe(error)}`,
      { cause: error },
    );
  }

  return { accessToken, itemPath, session };
};

export const finalizeOnedrive = async (
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

export const uploadToOnedriveBuffer = async (
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

export const uploadToOnedriveFile = async (
  filePath: string,
  metadata: UploadMetadata,
): Promise<UploadResult> => {
  const { accessToken, itemPath, session } =
    await getAccessTokenAndSession(metadata);

  const { size } = await stat(filePath);
  if (size === 0) {
    throw new Error("Archivo vacío");
  }

  let offset = 0;
  let result: { id?: string; webUrl?: string } | null = null;

  const stream = createReadStream(filePath, {
    highWaterMark: ONEDRIVE_CHUNK_SIZE,
  });
  for await (const chunk of stream) {
    const response = await sendChunk(
      session.uploadUrl,
      chunk as Buffer,
      offset,
      size,
    );
    offset += chunk.length;
    if (offset >= size) {
      result = (await response.json()) as typeof result;
    }
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

export const uploadToR2 = async (
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

  let response: Response;
  try {
    response = await fetchConTimeout(
      `https://${host}${canonicalUri}`,
      {
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
      },
      60_000,
    );
  } catch (error) {
    throw new Error(`Cloudflare R2 upload failed${causaDe(error)}`, {
      cause: error,
    });
  }

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
export const saveLocal = async (
  body: Buffer,
  relativePath: string,
  fallbackReason?: string,
): Promise<UploadResult> => {
  const localPath = join(
    process.cwd(),
    "uploads",
    "guardadas",
    relativePath,
  );
  await mkdir(dirname(localPath), { recursive: true });
  await writeFile(localPath, body);

  return {
    storage: "local",
    url: `/api/upload/ver?${firmarRutaLocal(relativePath)}`,
    fallbackReason,
  };
};

export const uploadFallback = async (
  body: Buffer,
  metadata: UploadMetadata,
  reason: string,
): Promise<UploadResult> => {
  const relativePath = buildRecordingPath(metadata);
  console.error(
    `[upload] OneDrive falló (${reason}). Intentando Cloudflare R2…`,
  );
  try {
    return await uploadToR2(body, relativePath, metadata.contentType);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Cloudflare R2 error";
    console.error(
      `[upload] Cloudflare R2 falló (${message}). Guardando localmente…`,
    );
    return saveLocal(body, relativePath, message);
  }
};
