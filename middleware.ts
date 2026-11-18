import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  // La sesión real se valida mediante CONSULTA_YO en el layout del dashboard.
  // No confiar en cookies de presencia: cualquier cliente puede falsificar
  // `cbm_auth=1` era falsificable y el middleware no debe decidir autorización
  // sin validar la sesión HttpOnly. La autorización de datos pertenece al backend.
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
