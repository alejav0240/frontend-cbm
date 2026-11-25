import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await context.params;
  const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const headers: Record<string, string> = {};
  const serviceKey = process.env.MULTIMODAL_SERVICE_KEY;
  if (serviceKey) headers["X-Service-Key"] = serviceKey;
  const response = await fetch(
    `${backendUrl}/api/pipeline-multimodal/resultados/${encodeURIComponent(sessionId)}/`,
    { headers, cache: "no-store", signal: AbortSignal.timeout(15_000) },
  );
  return new NextResponse(await response.text(), {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" },
  });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await context.params;
  const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const serviceKey = process.env.MULTIMODAL_SERVICE_KEY;
  if (serviceKey) headers["X-Service-Key"] = serviceKey;
  const response = await fetch(
    `${backendUrl}/api/pipeline-multimodal/resultados/${encodeURIComponent(sessionId)}/demuca/`,
    {
      method: "PATCH",
      headers,
      body: await request.text(),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    },
  );
  return new NextResponse(await response.text(), {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" },
  });
}
