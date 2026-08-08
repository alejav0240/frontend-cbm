const AUTHORITY = "https://login.microsoftonline.com/consumers/oauth2/v2.0";
const GRAPH_BASE = "https://graph.microsoft.com/v1.0";
const SCOPES = "Files.ReadWrite offline_access User.Read";

export const ONEDRIVE_AUTHORITY = AUTHORITY;
export const ONEDRIVE_GRAPH_BASE = GRAPH_BASE;
export const ONEDRIVE_SCOPES = SCOPES;

export type OnedriveConfig = {
  clientId: string;
  clientSecret: string;
  serviceKey: string;
  backendUrl: string;
};

export const getOnedriveConfig = (): OnedriveConfig => ({
  clientId: process.env.ONEDRIVE_CLIENT_ID ?? "",
  clientSecret: process.env.ONEDRIVE_CLIENT_SECRET ?? "",
  serviceKey: process.env.ONEDRIVE_SERVICE_KEY ?? "",
  backendUrl:
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://localhost:8000",
});

export const isOnedriveConfigured = () => {
  const config = getOnedriveConfig();
  return Boolean(config.clientId && config.clientSecret && config.serviceKey);
};

export const getPublicOrigin = (origin: string) => {
  const publicUrl = process.env.APP_URL?.replace(/\/+$/, "");
  return publicUrl || origin;
};

export const getRedirectUri = (origin: string) =>
  `${getPublicOrigin(origin)}/api/onedrive/callback`;

export const buildAuthorizeUrl = (origin: string) => {
  const { clientId } = getOnedriveConfig();
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: getRedirectUri(origin),
    response_mode: "query",
    scope: SCOPES,
  });
  return `${AUTHORITY}/authorize?${params.toString()}`;
};

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
};

const exchangeToken = async (
  body: URLSearchParams,
): Promise<TokenResponse> => {
  const { clientId, clientSecret } = getOnedriveConfig();
  body.set("client_id", clientId);
  body.set("client_secret", clientSecret);

  const response = await fetch(`${AUTHORITY}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Microsoft token exchange failed: ${response.status} ${errorBody.slice(0, 300)}`,
    );
  }

  return (await response.json()) as TokenResponse;
};

export const exchangeCodeForToken = async (
  code: string,
  origin: string,
): Promise<TokenResponse> => {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: getRedirectUri(origin),
    scope: SCOPES,
  });
  return exchangeToken(body);
};

export const refreshAccessToken = async (
  refreshToken: string,
): Promise<TokenResponse> => {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    scope: SCOPES,
  });
  return exchangeToken(body);
};

export const getMe = async (accessToken: string) => {
  const response = await fetch(`${GRAPH_BASE}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) return null;
  return response.json() as Promise<{ userPrincipalName?: string; mail?: string }>;
};

let accessTokenCache: { token: string; expiresAt: number } | null = null;

export const getAccessToken = async (refreshToken: string): Promise<string> => {
  const now = Date.now();
  if (accessTokenCache && accessTokenCache.expiresAt > now) {
    return accessTokenCache.token;
  }
  const result = await refreshAccessToken(refreshToken);
  const expiresIn = Number(result.expires_in) || 3600;
  accessTokenCache = {
    token: result.access_token,
    expiresAt: now + (expiresIn - 300) * 1000,
  };
  return result.access_token;
};

export const fetchRefreshTokenFromBackend = async (): Promise<string | null> => {
  const { backendUrl, serviceKey } = getOnedriveConfig();
  const response = await fetch(
    `${backendUrl}/api/onedrive/token?_=${Date.now()}`,
    {
      headers: { "X-Service-Key": serviceKey },
      cache: "no-store",
    },
  );
  if (!response.ok) return null;
  const data = (await response.json()) as { refresh_token?: string | null };
  return data.refresh_token || null;
};

export type StoreTokenResult = {
  ok: boolean;
  status?: number;
  errorBody?: string;
};

export const storeRefreshTokenInBackend = async (
  refreshToken: string,
  userEmail: string,
): Promise<StoreTokenResult> => {
  const { backendUrl, serviceKey } = getOnedriveConfig();

  let response: Response;
  try {
    response = await fetch(`${backendUrl}/api/onedrive/token`, {
      method: "POST",
      headers: {
        "X-Service-Key": serviceKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken, user_email: userEmail }),
      cache: "no-store",
    });
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "Failed to fetch backend";
    return { ok: false, errorBody: reason };
  }

  if (response.ok) {
    return { ok: true, status: response.status };
  }

  const errorBody = (await response.text()).slice(0, 200);
  return { ok: false, status: response.status, errorBody };
};
