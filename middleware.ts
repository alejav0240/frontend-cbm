import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar presencia de cookie de sesión o token
  const hasAuthCookie = request.cookies.has("cbm_auth");
  const hasAccessToken = request.cookies.has("access_token");
  const isAuthenticated = hasAuthCookie || hasAccessToken;

  // 1. Si el usuario ya está autenticado e intenta ir a /login, redirigir al /dashboard
  if (pathname === "/login") {
    if (isAuthenticated) {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  // 2. Proteger rutas de /dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
  ],
};
