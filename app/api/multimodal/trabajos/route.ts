import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const backendUrl = () =>
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

const headersFor = (request: NextRequest) => {
  const headers: Record<string, string> = {};
  const serviceKey = process.env.MULTIMODAL_SERVICE_KEY;
  if (serviceKey) headers["X-Service-Key"] = serviceKey;
  const requestId = request.headers.get("X-Request-ID");
  if (requestId) headers["X-Request-ID"] = requestId;
  return headers;
};

const relay = async (response: Response, request: NextRequest) => {
  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/json",
      "X-Request-ID": response.headers.get("X-Request-ID") || request.headers.get("X-Request-ID") || "",
    },
  });
};

export async function POST(request: NextRequest) {
  const response = await fetch(`${backendUrl()}/api/pipeline-multimodal/trabajos/`, {
    method: "POST",
    body: await request.formData(),
    headers: headersFor(request),
    signal: AbortSignal.timeout(Number(process.env.MULTIMODAL_QUEUE_TIMEOUT_MS || 120_000)),
  });
  return relay(response, request);
}
