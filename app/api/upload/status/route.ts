import { stat } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { listJobs } from "../queue";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const statusKey = process.env.UPLOAD_STATUS_KEY;
  if (process.env.NODE_ENV === "production") {
    if (!statusKey || request.headers.get("x-status-key") !== statusKey) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  const jobs = await listJobs();

  const detalle = await Promise.all(
    jobs
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .slice(-50)
      .map(async (j) => {
        let bytes = 0;
        try {
          const info = await stat(j.file);
          bytes = info.size;
        } catch {}
        return {
          id: j.id,
          sessionId: j.sessionId,
          status: j.status,
          attempts: j.attempts,
          createdAt: j.createdAt,
          nextAttemptAt: j.nextAttemptAt,
          bytes,
          lastError: j.lastError ?? null,
        };
      }),
  );

  const conteo = { pending: 0, processing: 0, failed: 0 };
  for (const j of jobs) conteo[j.status] += 1;

  return NextResponse.json({
    conteo,
    total: jobs.length,
    jobs: detalle,
  });
}
