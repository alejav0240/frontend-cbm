const ENCRYPTED_CONTENT_TYPE = "application/vnd.cbm.encrypted+json";
const VERSION = 1;
const APPLICATION_ENCRYPTION_ENABLED = !["false", "0", "no", "off"].includes(
  (process.env.NEXT_PUBLIC_APP_ENCRYPTION_ENABLED || "true").trim().toLowerCase(),
);

type PublicJwk = JsonWebKey & { kid: string };
type Envelope = {
  v: number;
  alg: string;
  kid: string;
  iv: string;
  ek?: string;
  ct: string;
};

let publicKeyPromise: Promise<PublicJwk> | null = null;

const toBase64Url = (bytes: ArrayBuffer): string => {
  const view = new Uint8Array(bytes);
  let binary = "";
  for (let index = 0; index < view.length; index += 0x8000) {
    binary += String.fromCharCode(...view.subarray(index, index + 0x8000));
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const fromBase64Url = (value: string): ArrayBuffer => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0)).buffer as ArrayBuffer;
};

const apiBaseUrl = (): string => {
  const graphqlUrl =
    process.env.NEXT_PUBLIC_GRAPHQL_URI || "http://localhost:8000/graphql/";
  return (
    process.env.NEXT_PUBLIC_API_URL || graphqlUrl.replace(/\/graphql\/?$/, "")
  );
};

const aadFor = (url: string): ArrayBuffer => {
  const pathname = new URL(url, globalThis.location?.origin || undefined).pathname;
  return new TextEncoder().encode(`POST ${pathname} v${VERSION}`).buffer as ArrayBuffer;
};

const getPublicKey = async (): Promise<PublicJwk> => {
  if (!publicKeyPromise) {
    publicKeyPromise = fetch(`${apiBaseUrl()}/crypto/public-key/`, {
      credentials: "include",
      cache: "no-store",
    }).then(async (response) => {
      if (!response.ok) throw new Error("Unable to load application encryption key");
      return (await response.json()) as PublicJwk;
    });
  }
  return publicKeyPromise;
};

const encryptBody = async (
  url: string,
  body: string,
): Promise<{ envelope: Envelope; key: CryptoKey }> => {
  const jwk = await getPublicKey();
  const rsaKey = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["wrapKey"],
  );
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv.buffer as ArrayBuffer, additionalData: aadFor(url) },
    key,
    new TextEncoder().encode(body),
  );
  const wrappedKey = await crypto.subtle.wrapKey("raw", key, rsaKey, {
    name: "RSA-OAEP",
  });
  return {
    key,
    envelope: {
      v: VERSION,
      alg: "RSA-OAEP-256+A256GCM",
      kid: jwk.kid,
      iv: toBase64Url(iv.buffer as ArrayBuffer),
      ek: toBase64Url(wrappedKey),
      ct: toBase64Url(ciphertext),
    },
  };
};

const prepareResponseKey = async (): Promise<{ key: CryptoKey; headers: Record<string, string> }> => {
  const jwk = await getPublicKey();
  const rsaKey = await crypto.subtle.importKey("jwk", jwk, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["wrapKey"]);
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  const wrappedKey = await crypto.subtle.wrapKey("raw", key, rsaKey, { name: "RSA-OAEP" });
  return {
    key,
    headers: {
      "X-CBM-Encrypted-Response": "1",
      "X-CBM-Response-Key": toBase64Url(wrappedKey),
      "X-CBM-Response-Key-Id": jwk.kid,
    },
  };
};

export const secureFetch: typeof fetch = async (input, init = {}) => {
  if (!APPLICATION_ENCRYPTION_ENABLED) return fetch(input, init);

  const request = input instanceof Request ? input : undefined;
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
  const method = (init.method || request?.method || "GET").toUpperCase();
  const body = init.body ?? request?.body;
  const headers = new Headers(init.headers || request?.headers);
  if (!body || method === "GET") {
    const responseKey = await prepareResponseKey();
    Object.entries(responseKey.headers).forEach(([name, value]) => headers.set(name, value));
    const response = await fetch(input, { ...init, headers });
    if (!response.headers.get("content-type")?.startsWith(ENCRYPTED_CONTENT_TYPE)) return response;
    const envelope = (await response.json()) as Envelope;
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64Url(envelope.iv), additionalData: aadFor(url) },
      responseKey.key,
      fromBase64Url(envelope.ct),
    );
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set("content-type", "application/json");
    return new Response(plaintext, { status: response.status, statusText: response.statusText, headers: responseHeaders });
  }

  const contentType = headers.get("content-type") || "application/json";
  if (!contentType.includes("application/json")) return fetch(input, init);

  const encrypted = await encryptBody(url, typeof body === "string" ? body : JSON.stringify(body));
  headers.set("content-type", ENCRYPTED_CONTENT_TYPE);
  const response = await fetch(input, { ...init, headers, body: JSON.stringify(encrypted.envelope) });
  if (!response.headers.get("content-type")?.startsWith(ENCRYPTED_CONTENT_TYPE)) return response;

  const envelope = (await response.json()) as Envelope;
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64Url(envelope.iv), additionalData: aadFor(url) },
    encrypted.key,
    fromBase64Url(envelope.ct),
  );
  const responseHeaders = new Headers(response.headers);
  responseHeaders.set("content-type", "application/json");
  return new Response(plaintext, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
};
