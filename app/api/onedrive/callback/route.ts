import { NextRequest, NextResponse } from "next/server";
import {
  exchangeCodeForToken,
  getMe,
  getOnedriveConfig,
  storeRefreshTokenInBackend,
} from "@/app/api/onedrive/lib";

export const runtime = "nodejs";

const buildRedirect = (origin: string, query: string) => {
  const url = new URL("/dashboard", origin);
  url.search = query;
  return NextResponse.redirect(url.toString());
};

export async function GET(request: NextRequest) {
  const { clientId, clientSecret } = getOnedriveConfig();
  if (!clientId || !clientSecret) {
    return buildRedirect(
      request.nextUrl.origin,
      "onedrive=error&message=no_configurado",
    );
  }

  const origin = request.nextUrl.origin;
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return buildRedirect(
      origin,
      `onedrive=error&message=${encodeURIComponent(error)}`,
    );
  }

  if (!code) {
    return buildRedirect(origin, "onedrive=error&message=sin_codigo");
  }

  try {
    const tokens = await exchangeCodeForToken(code, origin);
    if (!tokens.refresh_token) {
      return buildRedirect(origin, "onedrive=error&message=sin_refresh_token");
    }

    const me = await getMe(tokens.access_token);
    const userEmail = me?.userPrincipalName || me?.mail || "";

    const saved = await storeRefreshTokenInBackend(tokens.refresh_token, userEmail);
    if (!saved) {
      return buildRedirect(origin, "onedrive=error&message=no_se_pudo_guardar");
    }

    return buildRedirect(origin, "onedrive=connected");
  } catch (err) {
    const message =
      err instanceof Error ? err.message.replace(/[^a-zA-Z0-9_-]/g, "_") : "error";
    return buildRedirect(origin, `onedrive=error&message=${message.slice(0, 80)}`);
  }
}
