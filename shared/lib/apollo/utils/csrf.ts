import { isBrowser } from "./isBrowser";

let csrfToken: string | undefined;

export function getCookie(name: string): string | undefined {
  if (!isBrowser()) return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

export async function ensureCsrfToken(): Promise<string | undefined> {
  if (!isBrowser()) return undefined;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/csrf/`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`No se pudo obtener el token CSRF (HTTP ${response.status})`);
  }

  const body = (await response.json()) as { csrfToken?: string };
  csrfToken = body.csrfToken || getCookie("csrftoken");
  return csrfToken;
}

export const getGraphQLHeaders = (
  token = csrfToken || getCookie("csrftoken"),
): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (isBrowser()) {
    if (token) headers["X-CSRFToken"] = token;
  }
  return headers;
};

export const csrfFetch: typeof fetch = async (input, init = {}) => {
  const token = await ensureCsrfToken();

  const request = input instanceof Request ? input : undefined;
  const headers = new Headers(init.headers || request?.headers);
  const csrfHeaders = getGraphQLHeaders(token);

  for (const [name, value] of Object.entries(csrfHeaders)) {
    headers.set(name, value);
  }

  return fetch(input, {
    ...init,
    credentials: init.credentials || "include",
    headers,
  });
};
