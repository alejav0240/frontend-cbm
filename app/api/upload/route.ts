import { createHash, createHmac } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { dirname, join, posix } from "path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type StorageTarget = "r2" | "local";

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

const LOCAL_UPLOAD_ROOT = "uploads";
const ROOT_FOLDER = "sesionesGrabadas";
const RESERVED_PATH_CHARS = /[<>:"/\\|?*\u0000-\u001f]/g;
const R2_REGION = "auto";
const R2_SERVICE = "s3";

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

const buildRecordingPath = ({
  pacienteId,
  pacienteNombre,
  numeroCiclo,
  grabadoEn,
}: {
  pacienteId: string;
  pacienteNombre: string;
  numeroCiclo: string;
  grabadoEn: string;
}) => {
  const patientFolder = `${sanitizePathSegment(pacienteId, "sin-id")}-${sanitizePathSegment(
    pacienteNombre,
    "sin-nombre",
  )}`;
  const cycleFolder = sanitizePathSegment(
    numeroCiclo || "sin-ciclo",
    "sin-ciclo",
  );
  const recordedAt = grabadoEn ? new Date(grabadoEn) : new Date();
  const safeDate = Number.isNaN(recordedAt.getTime()) ? new Date() : recordedAt;
  const fileName = `${formatDateForFile(safeDate)}.webm`;

  return posix.join(ROOT_FOLDER, patientFolder, cycleFolder, fileName);
};

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
  file: File,
  key: string,
  body: Buffer,
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
  const contentType = file.type || "video/webm";
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

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 },
      );
    }

    const relativePath = buildRecordingPath({
      pacienteId: getString(data, "pacienteId"),
      pacienteNombre: getString(data, "pacienteNombre"),
      numeroCiclo: getString(data, "numeroCiclo"),
      grabadoEn: getString(data, "grabadoEn"),
    });
    const body = Buffer.from(await file.arrayBuffer());

    let result: UploadResult;

    try {
      result = await uploadToR2(file, relativePath, body);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown Cloudflare R2 error";
      console.error("Cloudflare R2 upload failed. Saving locally:", message);
      result = await saveLocal(body, relativePath, message);
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error uploading file";
    console.error("Error uploading file:", error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
