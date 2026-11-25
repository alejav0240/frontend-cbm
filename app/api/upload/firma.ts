import { createHmac, timingSafeEqual } from "crypto";

const getSecret = () => {
  const secret = process.env.UPLOAD_FIRMA_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("UPLOAD_FIRMA_SECRET no está configurado");
  }
  return secret;
};

export const VIGENCIA_LOCAL_MS =
  (Number(process.env.UPLOAD_URL_VIGENCIA_DIAS) || 365) * 24 * 60 * 60 * 1000;

export type RutaFirmada = {
  ruta: string;
  exp: number;
  sig: string;
};

export const firmarRutaLocal = (ruta: string): string => {
  const exp = Date.now() + VIGENCIA_LOCAL_MS;
  const sig = createHmac("sha256", getSecret())
    .update(`${ruta}|${exp}`)
    .digest("base64url");
  return `ruta=${encodeURIComponent(ruta)}&exp=${exp}&sig=${encodeURIComponent(sig)}`;
};

export const verificarRutaLocal = (
  params: URLSearchParams,
): { ruta: string; exp: number } | null => {
  const ruta = params.get("ruta");
  const expRaw = params.get("exp");
  const sig = params.get("sig");
  if (!ruta || !expRaw || !sig) return null;

  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || Date.now() > exp) return null;

  let esperado: Buffer;
  try {
    esperado = createHmac("sha256", getSecret())
      .update(`${ruta}|${exp}`)
      .digest();
  } catch {
    return null;
  }
  const recibido = Buffer.from(sig, "base64url");
  if (
    recibido.length !== esperado.length ||
    !timingSafeEqual(esperado, recibido)
  ) {
    return null;
  }

  if (ruta.includes("..") || ruta.startsWith("/") || ruta.includes("\\")) {
    return null;
  }

  return { ruta, exp };
};
