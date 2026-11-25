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

  const baseUrl = "";
  const headers: Record<string, string> = {};
  const csrfToken = getCookie("csrftoken");
  if (csrfToken) headers["X-CSRFToken"] = csrfToken;

  const respuesta = await fetch(`${baseUrl}/api/multimodal/analizar/`, {
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

export type TrabajoAnalisisMultimodal = {
  status: "queued" | "processing" | "completed" | "failed";
  job_id: string;
  session_id: string;
  result?: RespuestaAnalisisMultimodal;
  error?: string;
};

export async function crearTrabajoAnalisisMultimodal(
  video: File,
  sessionId?: string,
): Promise<TrabajoAnalisisMultimodal> {
  await ensureCsrfToken();
  const formulario = new FormData();
  formulario.append("video", video, video.name);
  if (sessionId) formulario.append("session_id", sessionId);
  const csrfToken = getCookie("csrftoken");
  const respuesta = await fetch("/api/multimodal/trabajos/", {
    method: "POST",
    body: formulario,
    credentials: "include",
    headers: csrfToken ? { "X-CSRFToken": csrfToken } : undefined,
  });
  const cuerpo = (await respuesta.json()) as TrabajoAnalisisMultimodal;
  if (!respuesta.ok) throw new ErrorAnalisisMultimodal(cuerpo.error || "No se pudo encolar el análisis.", respuesta.status);
  return cuerpo;
}

export async function consultarTrabajoAnalisisMultimodal(jobId: string): Promise<TrabajoAnalisisMultimodal> {
  const respuesta = await fetch(`/api/multimodal/trabajos/${jobId}/`, { credentials: "include" });
  const cuerpo = (await respuesta.json()) as TrabajoAnalisisMultimodal;
  if (!respuesta.ok) throw new ErrorAnalisisMultimodal(cuerpo.error || "No se pudo consultar el análisis.", respuesta.status);
  return cuerpo;
}

export async function consultarResultadoAnalisisMultimodal(
  sessionId: string,
): Promise<RespuestaAnalisisMultimodal> {
  const respuesta = await fetch(
    `/api/multimodal/resultados/${encodeURIComponent(sessionId)}`,
    { credentials: "include", cache: "no-store" },
  );
  const cuerpo = (await respuesta.json()) as RespuestaAnalisisMultimodal;
  if (!respuesta.ok && respuesta.status !== 202) {
    throw new ErrorAnalisisMultimodal(
      typeof cuerpo.error === "string" ? cuerpo.error : "No se pudo consultar el resultado.",
      respuesta.status,
    );
  }
  return cuerpo;
}

export async function actualizarDemucaAnalisisMultimodal(
  sessionId: string,
  demuca: Record<string, unknown>,
): Promise<RespuestaAnalisisMultimodal> {
  await ensureCsrfToken();
  const csrfToken = getCookie("csrftoken");
  const respuesta = await fetch(
    `/api/multimodal/resultados/${encodeURIComponent(sessionId)}/demuca`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      },
      body: JSON.stringify({ demuca }),
    },
  );
  const cuerpo = (await respuesta.json()) as RespuestaAnalisisMultimodal;
  if (!respuesta.ok) {
    throw new ErrorAnalisisMultimodal(
      typeof cuerpo.error === "string" ? cuerpo.error : "No se pudo guardar el DEMUCA.",
      respuesta.status,
    );
  }
  return cuerpo;
}

export async function esperarTrabajoAnalisisMultimodal(
  jobId: string,
  opciones: { intervaloMs?: number; timeoutMs?: number } = {},
): Promise<TrabajoAnalisisMultimodal> {
  const intervaloMs = opciones.intervaloMs ?? 3000;
  const timeoutMs = opciones.timeoutMs ?? 15 * 60 * 1000;
  const inicio = Date.now();

  while (true) {
    const trabajo = await consultarTrabajoAnalisisMultimodal(jobId);
    if (trabajo.status === "completed" || trabajo.status === "failed") return trabajo;
    if (Date.now() - inicio >= timeoutMs) {
      throw new ErrorAnalisisMultimodal(
        "El análisis multimodal excedió el tiempo de espera.",
        408,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, intervaloMs));
  }
}
