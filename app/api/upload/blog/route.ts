import { randomUUID } from "crypto";
import { extname, join } from "path";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No se recibió ninguna imagen" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Solo se aceptan JPG, PNG, WEBP o GIF" },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: "La imagen no puede superar los 5 MB" },
        { status: 400 },
      );
    }

    const extension = extname(file.name).toLowerCase() || ".jpg";
    const fileName = `${randomUUID()}${extension}`;
    const uploadDir = join(process.cwd(), "public", "uploads", "blog");

    await mkdir(uploadDir, { recursive: true });
    await writeFile(
      join(uploadDir, fileName),
      Buffer.from(await file.arrayBuffer()),
    );

    return NextResponse.json({
      success: true,
      url: `/uploads/blog/${fileName}`,
    });
  } catch (error) {
    console.error("[upload/blog] Error:", error);
    return NextResponse.json(
      { success: false, message: "No se pudo subir la imagen" },
      { status: 500 },
    );
  }
}
