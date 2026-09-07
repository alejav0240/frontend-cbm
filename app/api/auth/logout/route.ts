import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const graphqlUri =
    process.env.NEXT_PUBLIC_GRAPHQL_URI || "http://localhost:8000/graphql/";

  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const csrfMatch = cookieHeader.match(/csrftoken=([^;]+)/);
    const csrfToken = csrfMatch ? csrfMatch[1] : "";

    await fetch(graphqlUri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      },
      body: JSON.stringify({
        query: `
          mutation {
            deleteTokenCookie { deleted }
            deleteRefreshTokenCookie { deleted }
          }
        `,
      }),
    });
  } catch (error) {
    console.warn("Backend logout notification failed:", error);
  }

  const response = NextResponse.json({ success: true });

  const cookiesToClear = [
    "cbm_auth",
    "access_token",
    "refresh_token",
    "sessionid",
    "csrftoken",
  ];

  for (const name of cookiesToClear) {
    response.cookies.set({
      name,
      value: "",
      path: "/",
      expires: new Date(0),
      maxAge: 0,
    });
  }

  return response;
}
