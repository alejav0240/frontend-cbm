import { NextRequest, NextResponse } from "next/server";
import {
  UploadMetadata,
  isOnedriveConfigured,
  uploadFallback,
  uploadToOnedriveBuffer,
} from "./lib";

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

    // Buffer the raw body so the same bytes remain available for R2/local
    // fallback when OneDrive fails.
    const metadata = readHeaderMetadata(request);
    const body = Buffer.from(await request.arrayBuffer());

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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error uploading file";
    console.error("Error uploading file:", error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
