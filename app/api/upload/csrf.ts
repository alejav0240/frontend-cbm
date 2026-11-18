type TokenCsrf = { token: string; cookie: string };

let cache: TokenCsrf | null = null;
let cacheExpiraAt = 0;
let promesaEnCurso: Promise<TokenCsrf> | null = null;

const VIGENCIA_CACHE_MS = 60 * 60 * 1000;

const extraerValorCookie = (
  setCookie: string | null,
  nombre: string,
): string | null => {
  if (!setCookie) return null;
  const match = setCookie.match(new RegExp(`(?:^|;)\\s*${nombre}=([^;]+)`));
  return match ? match[1] : null;
};

export const invalidarTokenCsrf = () => {
  cache = null;
  cacheExpiraAt = 0;
};

const solicitarToken = async (backendUrl: string): Promise<TokenCsrf> => {
  const response = await fetch(`${backendUrl}/csrf/`, {
    method: "GET",
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });

  const contentType = response.headers.get("content-type") || "";
  const texto = await response.text();
  if (!contentType.toLowerCase().includes("application/json")) {
    const esHtml = /<\s*!doctype\s+html|<\s*html[\s>]/i.test(texto);
    throw new Error(
      `El endpoint CSRF devolvió ${esHtml ? "HTML" : "una respuesta no JSON"} ` +
        `(HTTP ${response.status}). Revisá BACKEND_API_URL y /csrf/.`,
    );
  }

  let body: { csrfToken?: string };
  try {
    body = JSON.parse(texto) as { csrfToken?: string };
  } catch {
    throw new Error(`El endpoint CSRF devolvió JSON inválido (HTTP ${response.status}).`);
  }
  if (!response.ok) {
    throw new Error(
      `No se pudo obtener token CSRF del backend (HTTP ${response.status})`,
    );
  }

  const valorCookie = extraerValorCookie(
    response.headers.get("set-cookie"),
    "csrftoken",
  );
  const token = valorCookie ?? body.csrfToken;
  if (!token) {
    throw new Error("El backend no devolvió un token CSRF válido");
  }

  return {
    token,
    cookie: `csrftoken=${token}`,
  };
};

export const obtenerTokenCsrf = async (
  backendUrl: string,
): Promise<TokenCsrf> => {
  const ahora = Date.now();
  if (cache && cacheExpiraAt > ahora) return cache;

  if (!promesaEnCurso) {
    promesaEnCurso = solicitarToken(backendUrl)
      .then((token) => {
        cache = token;
        cacheExpiraAt = ahora + VIGENCIA_CACHE_MS;
        return token;
      })
      .finally(() => {
        promesaEnCurso = null;
      });
  }

  return promesaEnCurso;
};
