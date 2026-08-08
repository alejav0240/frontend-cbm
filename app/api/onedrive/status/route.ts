import { NextResponse } from "next/server";
import { getOnedriveConfig } from "@/app/api/onedrive/lib";

export const runtime = "nodejs";

type OnedriveStatusResponse = {
  connected: boolean;
  user_email?: string;
  error?: string;
};

export async function GET(): Promise<NextResponse<OnedriveStatusResponse>> {
  const { backendUrl } = getOnedriveConfig();

  try {
    const response = await fetch(
      `${backendUrl}/api/onedrive/status?_=${Date.now()}`,
      { cache: "no-store" },
    );
    if (!response.ok) {
      return NextResponse.json(
        { connected: false, error: `backend_${response.status}` },
        { status: 200 },
      );
    }
    const data = (await response.json()) as OnedriveStatusResponse;
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { connected: false, error: "backend_inaccesible" },
      { status: 200 },
    );
  }
}
