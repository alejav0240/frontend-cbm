import { stat } from "fs/promises";
import { readFile } from "fs/promises";
import { getOnedriveConfig } from "@/app/api/onedrive/lib";
import {
  UploadResult,
  causaDe,
  uploadFallback,
  uploadToOnedriveFile,
} from "./lib";
import {
  PendingJob,
  deleteJob,
  deleteJobFile,
  enqueueJob,
  listJobs,
} from "./queue";
import { invalidarTokenCsrf, obtenerTokenCsrf } from "./csrf";

const MAX_JOB_ATTEMPTS = 5;
const JOB_STALE_MS = 30 * 60 * 1000;
const RETENCION_DIAS = 7;
const DIA_MS = 24 * 60 * 60 * 1000;

const backoffMs = (attempts: number) =>
  Math.min(60_000 * 2 ** (attempts - 1), 3_600_000);

const MARCAR_EN_PROGRESO_MUTATION = `
  mutation MarcarSubidaEnProgreso($sessionId: ID!) {
    marcarSubidaEnProgreso(sessionId: $sessionId) {
      success
    }
  }
`;

const COMPLETAR_MUTATION = `
  mutation CompletarSubidaSesion($sessionId: ID!, $videoUrl: String, $storage: String, $ok: Boolean!, $message: String, $jobId: String) {
    completarSubidaSesion(sessionId: $sessionId, videoUrl: $videoUrl, storage: $storage, ok: $ok, message: $message, jobId: $jobId) {
      success
    }
  }
`;

const postMutacion = async (
  backendUrl: string,
  serviceKey: string,
  csrf: { token: string; cookie: string },
  query: string,
  variables: Record<string, unknown>,
) => {
  const response = await fetch(`${backendUrl}/graphql/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Service-Key": serviceKey,
      "X-CSRFToken": csrf.token,
      Cookie: csrf.cookie,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });
  return response;
};

const leerDataMutacion = async (response: Response) => {
  const data = (await response.json()) as {
    errors?: { message?: string }[];
  };
  if (data.errors?.length) {
    throw new Error(data.errors[0]?.message || "Error en mutación de subida");
  }
  return data;
};

const llamarMutacion = async (
  query: string,
  variables: Record<string, unknown>,
) => {
  const { backendUrl, serviceKey } = getOnedriveConfig();
  const csrf = await obtenerTokenCsrf(backendUrl);
  const response = await postMutacion(
    backendUrl,
    serviceKey,
    csrf,
    query,
    variables,
  );

  if (response.status === 403) {
    invalidarTokenCsrf();
    const csrfRenovado = await obtenerTokenCsrf(backendUrl);
    const reintento = await postMutacion(
      backendUrl,
      serviceKey,
      csrfRenovado,
      query,
      variables,
    );
    if (reintento.status === 403) {
      throw new Error(
        "El backend rechazó la solicitud por CSRF pese al token renovado",
      );
    }
    return leerDataMutacion(reintento);
  }

  return leerDataMutacion(response);
};

const marcarSubiendo = async (sessionId: string) => {
  try {
    await llamarMutacion(MARCAR_EN_PROGRESO_MUTATION, { sessionId });
  } catch (error) {
    console.warn(
      "[upload-worker] No se pudo marcar sesión como 'subiendo':",
      error,
    );
  }
};

const procesarJob = async (job: PendingJob) => {
  job.status = "processing";
  job.processingStartedAt = Date.now();
  await enqueueJob(job);

  void marcarSubiendo(job.sessionId);

  let resultado: UploadResult;
  try {
    try {
      resultado = await uploadToOnedriveFile(job.file, job.metadata);
    } catch (error) {
      const reason = error instanceof Error ? error.message : "OneDrive error";
      const body = await readFile(job.file);
      resultado = await uploadFallback(body, job.metadata, reason);
    }

    await llamarMutacion(COMPLETAR_MUTATION, {
      sessionId: job.sessionId,
      videoUrl: resultado.url,
      storage: resultado.storage,
      ok: true,
      jobId: job.id,
    });

    await deleteJobFile(job);
    await deleteJob(job.id);
    console.log(
      `[upload-worker] Subida completada ${job.id} -> ${resultado.storage}`,
    );
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error de subida desconocido";
    job.attempts += 1;
    job.lastError = `${mensaje}${causaDe(error)}`;
    console.error(
      `[upload-worker] Error subiendo ${job.id}: ${mensaje}${causaDe(error)}`,
    );

    if (job.attempts >= MAX_JOB_ATTEMPTS) {
      job.status = "failed";
      try {
        await llamarMutacion(COMPLETAR_MUTATION, {
          sessionId: job.sessionId,
          ok: false,
          message: `No se pudo subir la grabación de la sesión. ${mensaje}`,
          jobId: job.id,
        });
      } catch (notifError) {
        console.error(
          "[upload-worker] No se pudo notificar el fallo:",
          notifError,
        );
      }
      console.error(
        `[upload-worker] Subida fallida definitiva ${job.id}: ${mensaje}`,
      );
    } else {
      job.status = "pending";
      job.nextAttemptAt = Date.now() + backoffMs(job.attempts);
      console.warn(
        `[upload-worker] Reintento ${job.attempts}/${MAX_JOB_ATTEMPTS} para ${job.id} en ${job.nextAttemptAt}`,
      );
    }
    await enqueueJob(job);
  }
};

/**
 * Recupera jobs que quedaron en "processing" por un crash/restart del proceso.
 * Con `forzar=true` se resetean todos (seguro en el arranque, cuando nada
 * más está procesando). En el sweep periódico solo se resetean los que llevan
 * mucho tiempo en "processing" (job colgado por un fetch que no volvió).
 */
export const recuperarJobsColgados = async (forzar = false) => {
  const jobs = await listJobs();
  const ahora = Date.now();
  let recuperados = 0;
  for (const job of jobs) {
    if (job.status !== "processing") continue;
    const colgado =
      forzar ||
      !job.processingStartedAt ||
      ahora - job.processingStartedAt > JOB_STALE_MS;
    if (!colgado) continue;
    job.status = "pending";
    job.nextAttemptAt = ahora;
    job.processingStartedAt = undefined;
    await enqueueJob(job);
    recuperados += 1;
  }
  if (recuperados > 0) {
    console.log(
      `[upload-worker] ${forzar ? "Arranque: " : ""}${recuperados} job(s) colgado(s) recuperado(s)`,
    );
  }
};

let procesando = false;

export const procesarSubidasPendientes = async () => {
  if (procesando) return;
  procesando = true;
  try {
    await recuperarJobsColgados();
    const jobs = await listJobs();
    const pendientes = jobs
      .filter((j) => j.status !== "processing" && j.nextAttemptAt <= Date.now())
      .sort((a, b) => a.nextAttemptAt - b.nextAttemptAt);

    for (const job of pendientes) {
      await procesarJob(job);
    }
  } catch (error) {
    console.error("[upload-worker] Error procesando cola:", error);
  } finally {
    procesando = false;
  }
};

/**
 * Elimina los archivos (y sus jobs) de subidas fallidas o pendientes más
 * antiguos que RETENCION_DIAS, para que el disco no se llene con `.webm`.
 */
export const limpiarSubidasVencidas = async () => {
  const jobs = await listJobs();
  const limite = Date.now() - RETENCION_DIAS * DIA_MS;
  let limpiados = 0;
  for (const job of jobs) {
    if (job.status === "processing") continue;
    try {
      const info = await stat(job.file);
      if (info.mtimeMs < limite) {
        await deleteJobFile(job);
        await deleteJob(job.id);
        limpiados += 1;
      }
    } catch {
      // Archivo ya no existe: eliminamos el job igualmente
      await deleteJob(job.id);
      limpiados += 1;
    }
  }
  if (limpiados > 0) {
    console.log(`[upload-worker] ${limpiados} subida(s) vencida(s) limpiada(s)`);
  }
};

export const reintentarSubida = async (jobId: string) => {
  const jobs = await listJobs();
  const job = jobs.find((j) => j.id === jobId) || null;
  if (!job) return false;

  job.status = "pending";
  job.attempts = 0;
  job.nextAttemptAt = Date.now();
  job.lastError = undefined;
  job.processingStartedAt = undefined;
  await enqueueJob(job);
  return true;
};

export const reintentarSubidaSesion = async (sessionId: string) => {
  const jobs = await listJobs();
  const job = jobs.find(
    (j) => j.sessionId === sessionId && j.status !== "processing",
  );
  if (!job) return false;
  return reintentarSubida(job.id);
};
