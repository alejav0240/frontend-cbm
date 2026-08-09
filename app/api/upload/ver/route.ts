import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { join } from "path";
import { Readable } from "stream";
import { NextRequest } from "next/server";
import { verificarRutaLocal } from "../firma";

export const runtime = "nodejs";

const TIPOS: Record<string, string> = {
  ".webm": "video/webm",
  ".mp4": "video/mp4",
  ".m4a": "audio/mp4",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
};

export async function GET(request: NextRequest) {
  const firma = verificarRutaLocal(request.nextUrl.searchParams);
  if (!firma) {
    return new Response("Enlace inválido o expirado.", { status: 403 });
  }

  const rutaAbsoluta = join(
    process.cwd(),
    "uploads",
    "guardadas",
    firma.ruta,
  );

  let info;
  try {
    info = await stat(rutaAbsoluta);
  } catch {
    return new Response("Archivo no encontrado.", { status: 404 });
  }
  if (!info.isFile()) {
    return new Response("Archivo no encontrado.", { status: 404 });
  }

  const ext = firma.ruta.slice(firma.ruta.lastIndexOf(".")).toLowerCase();
  const contentType = TIPOS[ext] || "application/octet-stream";

  const range = request.headers.get("range");
  const total = info.size;
  const rangoUnico = /^bytes=(\d*)-(\d*)$/;

  if (range) {
    const match = range.match(rangoUnico);
    if (!match) {
      return new Response("Rango inválido", { status: 416 });
    }
    const inicio = match[1] ? Number(match[1]) : 0;
    let fin = match[2] ? Number(match[2]) : total - 1;
    if (Number.isNaN(inicio) || Number.isNaN(fin) || inicio > fin || inicio >= total) {
      return new Response("Rango inválido", { status: 416 });
    }
    if (fin >= total) fin = total - 1;

    const stream = Readable.toWeb(
      createReadStream(rutaAbsoluta, { start: inicio, end: fin }),
    );
    return new Response(stream as ReadableStream, {
      status: 206,
      headers: {
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
        "Content-Range": `bytes ${inicio}-${fin}/${total}`,
        "Content-Length": String(fin - inicio + 1),
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  }

  const stream = Readable.toWeb(createReadStream(rutaAbsoluta));
  return new Response(stream as ReadableStream, {
    headers: {
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
      "Content-Length": String(total),
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
