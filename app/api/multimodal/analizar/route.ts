import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const entrada = await request.formData();
  const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const headers: Record<string, string> = {};
  const serviceKey = process.env.MULTIMODAL_SERVICE_KEY;
  if (serviceKey) headers["X-Service-Key"] = serviceKey;
  const requestId = request.headers.get("X-Request-ID");
  if (requestId) headers["X-Request-ID"] = requestId;

  const respuesta = await fetch(`${backendUrl}/api/pipeline-multimodal/analizar-video/`, {
    method: "POST",
    body: entrada,
    headers,
    signal: AbortSignal.timeout(Number(process.env.MULTIMODAL_PROXY_TIMEOUT_MS || 1_900_000)),
  });
  const cuerpo = await respuesta.text();
  return new NextResponse(cuerpo, {
    status: respuesta.status,
    headers: {
      "Content-Type": respuesta.headers.get("Content-Type") || "application/json",
      "X-Request-ID": respuesta.headers.get("X-Request-ID") || requestId || "",
    },
  });
}
