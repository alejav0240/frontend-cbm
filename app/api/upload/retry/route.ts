import { NextRequest, NextResponse } from "next/server";
import {
  reintentarSubida,
  reintentarSubidaSesion,
} from "../worker";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { jobId?: string; sessionId?: string };
    const jobId = body?.jobId?.trim();
    const sessionId = body?.sessionId?.trim();

    let reintentado = false;
    if (jobId) {
      reintentado = await reintentarSubida(jobId);
    } else if (sessionId) {
      reintentado = await reintentarSubidaSesion(sessionId);
    }

    if (!jobId && !sessionId) {
      return NextResponse.json(
        { success: false, message: "Falta jobId o sessionId" },
        { status: 400 },
      );
    }
    if (!reintentado) {
      return NextResponse.json(
        { success: false, message: "Subida no encontrada para reintentar" },
        { status: 404 },
      );
    }

    const { procesarSubidasPendientes } = await import("../worker");
    void procesarSubidasPendientes();

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al reintentar";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
