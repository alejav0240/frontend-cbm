import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;
  const backendUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";
  const headers: Record<string, string> = {};
  const serviceKey = process.env.MULTIMODAL_SERVICE_KEY;
  if (serviceKey) headers["X-Service-Key"] = serviceKey;
  const requestId = request.headers.get("X-Request-ID");
  if (requestId) headers["X-Request-ID"] = requestId;

  const response = await fetch(
    `${backendUrl}/api/pipeline-multimodal/trabajos/${encodeURIComponent(jobId)}/`,
    { headers, cache: "no-store", signal: AbortSignal.timeout(30_000) },
  );
  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/json",
      "X-Request-ID": response.headers.get("X-Request-ID") || requestId || "",
    },
  });
}
