import { NextRequest, NextResponse } from "next/server";
import { buildAuthorizeUrl, getOnedriveConfig } from "@/app/api/onedrive/lib";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { clientId } = getOnedriveConfig();
  if (!clientId) {
    return NextResponse.json(
      { error: "OneDrive no está configurado" },
      { status: 500 },
    );
  }

  const origin = request.nextUrl.origin;
  return NextResponse.redirect(buildAuthorizeUrl(origin));
}
