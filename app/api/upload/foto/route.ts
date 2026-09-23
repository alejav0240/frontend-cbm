import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No se recibió ningún archivo" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: `Tipo de archivo no permitido: ${file.type}. Solo se aceptan imágenes.`,
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: "El archivo supera el límite de 5 MB" },
        { status: 400 },
      );
    }

    const ext = extname(file.name) || ".jpg";
    const fileName = `${randomUUID()}${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads", "pacientes");

    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(uploadDir, fileName), buffer);

    // URL pública accesible directamente por el navegador
    const url = `/uploads/pacientes/${fileName}`;

    return NextResponse.json({ success: true, url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al subir la imagen";
    console.error("[upload/foto] Error:", error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
