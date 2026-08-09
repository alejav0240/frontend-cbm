import { randomUUID } from "crypto";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { Transform } from "stream";
import { Readable } from "stream";
import { ReadableStream as WebReadableStream } from "stream/web";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { UploadMetadata } from "../lib";
import { enqueueJob, getQueueDir, listJobs } from "../queue";
import { procesarSubidasPendientes } from "../worker";

export const runtime = "nodejs";

const MAX_INGEST_BYTES =
  (Number(process.env.MAX_INGEST_MB) || 2048) * 1024 * 1024;

const enIngesta = new Set<string>();

class ExcesoDeTamañoError extends Error {
  constructor() {
    super("La grabación supera el tamaño máximo permitido.");
  }
}

export async function POST(request: NextRequest) {
  const filePath = join(getQueueDir(), `${randomUUID()}.webm`);
  try {
    const sessionId = request.headers.get("x-session-id")?.trim();
    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Falta x-session-id" },
        { status: 400 },
      );
    }

    // Idempotencia: si ya existe un job pendiente/activo para esta sesión,
    // no creamos un duplicado (evita re-subidas al reabrir la pestaña).
    if (enIngesta.has(sessionId)) {
      return NextResponse.json(
        { success: true, message: "Ya hay una subida en curso para esta sesión." },
        { status: 200 },
      );
    }
    const existentes = await listJobs();
    const existente = existentes.find(
      (j) => j.sessionId === sessionId && j.status !== "failed",
    );
    if (existente) {
      return NextResponse.json({
        success: true,
        uploadId: existente.id,
        duplicado: true,
      });
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_INGEST_BYTES) {
      return NextResponse.json(
        { success: false, message: "La grabación supera el tamaño máximo permitido." },
        { status: 413 },
      );
    }

    if (!request.body) {
      return NextResponse.json(
        { success: false, message: "Cuerpo vacío" },
        { status: 400 },
      );
    }

    const metadata: UploadMetadata = {
      pacienteId: request.headers.get("x-paciente-id")?.trim() ?? "",
      pacienteNombre: request.headers.get("x-paciente-nombre")?.trim() ?? "",
      numeroCiclo:
        request.headers.get("x-numero-ciclo")?.trim() || "sin-ciclo",
      grabadoEn: request.headers.get("x-grabado-en")?.trim() ?? "",
      contentType:
        request.headers.get("content-type")?.trim() || "video/webm",
    };

    enIngesta.add(sessionId);

    let bytesRecibidos = 0;
    const contador = new Transform({
      transform(chunk: Buffer, _encoding, callback) {
        bytesRecibidos += chunk.length;
        if (bytesRecibidos > MAX_INGEST_BYTES) {
          callback(new ExcesoDeTamañoError());
          return;
        }
        callback(null, chunk);
      },
    });

    await pipeline(
      Readable.fromWeb(request.body as unknown as WebReadableStream),
      contador,
      createWriteStream(filePath),
    );

    const id = randomUUID();
    await enqueueJob({
      id,
      file: filePath,
      sessionId,
      metadata,
      attempts: 0,
      nextAttemptAt: Date.now(),
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    void procesarSubidasPendientes();

    return NextResponse.json({ success: true, uploadId: id });
  } catch (error) {
    try {
      const { rm } = await import("fs/promises");
      await rm(filePath, { force: true });
    } catch {}
    const esExceso = error instanceof ExcesoDeTamañoError;
    const message =
      error instanceof Error ? error.message : "Error en ingesta de archivo";
    console.error("Error en ingesta:", error);
    return NextResponse.json(
      { success: false, message },
      { status: esExceso ? 413 : 500 },
    );
  } finally {
    const sessionId = request.headers.get("x-session-id")?.trim();
    if (sessionId) enIngesta.delete(sessionId);
  }
}
