import { ensureCsrfToken, getCookie } from "../lib/apollo/utils/csrf";

export type RespuestaAnalisisMultimodal = Record<string, unknown> & {
  status?: string;
  session_id?: string;
};

export class ErrorAnalisisMultimodal extends Error {
  constructor(
    message: string,
    readonly statusCode?: number,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = "ErrorAnalisisMultimodal";
  }
}

/** Envía un vídeo al endpoint backend y conserva intacta la respuesta del pipeline. */
export async function analizarVideoMultimodal(
  video: File,
  sessionId?: string,
): Promise<RespuestaAnalisisMultimodal> {
  await ensureCsrfToken();
  const formulario = new FormData();
  formulario.append("video", video, video.name);
  if (sessionId) formulario.append("session_id", sessionId);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const headers: Record<string, string> = {};
  const csrfToken = getCookie("csrftoken");
  if (csrfToken) headers["X-CSRFToken"] = csrfToken;

  const respuesta = await fetch(`${baseUrl}/api/multimodal/analizar-video/`, {
    method: "POST",
    body: formulario,
    credentials: "include",
    headers,
  });

  let cuerpo: RespuestaAnalisisMultimodal;
  try {
    cuerpo = (await respuesta.json()) as RespuestaAnalisisMultimodal;
  } catch {
    throw new ErrorAnalisisMultimodal(
      "El backend no devolvió una respuesta JSON válida.",
      respuesta.status,
      respuesta.headers.get("X-Request-ID") || undefined,
    );
  }

  if (!respuesta.ok) {
    const mensaje = typeof cuerpo.error === "string" ? cuerpo.error : "Falló el análisis multimodal.";
    throw new ErrorAnalisisMultimodal(
      mensaje,
      respuesta.status,
      respuesta.headers.get("X-Request-ID") || undefined,
    );
  }
  return cuerpo;
}
