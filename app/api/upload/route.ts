import { NextRequest, NextResponse } from "next/server";
import {
  ONEDRIVE_CHUNK_SIZE,
  OneDriveNotConfiguredError,
  UploadMetadata,
  finalizeOnedrive,
  getAccessTokenAndSession,
  isOnedriveConfigured,
  sendChunk,
  uploadFallback,
  uploadToOnedriveBuffer,
} from "./lib";
import type { UploadResult } from "./lib";

export const runtime = "nodejs";

const getString = (data: FormData, key: string) => {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const readHeaderMetadata = (request: NextRequest): UploadMetadata => ({
  pacienteId: request.headers.get("x-paciente-id")?.trim() ?? "",
  pacienteNombre: request.headers.get("x-paciente-nombre")?.trim() ?? "",
  numeroCiclo:
    request.headers.get("x-numero-ciclo")?.trim() || "sin-ciclo",
  grabadoEn: request.headers.get("x-grabado-en")?.trim() ?? "",
  contentType:
    request.headers.get("content-type")?.trim() || "application/octet-stream",
});

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
