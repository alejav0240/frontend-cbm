export const PIPELINE_STAGE_DEFINITIONS = [
  ["extraction", "Extracción y normalización"],
  ["segmentation", "Segmentación y sincronización"],
  ["pose", "Análisis de pose"],
  ["audio", "Características acústicas"],
  ["movement", "Movimiento e interacción"],
  ["validation", "Validación de artefactos"],
  ["inference", "Inferencia"],
  ["demuca", "Proyección DEMUCA"],
  ["human_review", "Revisión profesional"],
] as const;

export type PipelineStageStatus =
  | "pending"
  | "running"
  | "completed"
  | "skipped"
  | "blocked"
  | "failed";

export type PipelineStage = {
  id: string;
  label: string;
  status: PipelineStageStatus;
  progress: number;
  message: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  durationMs: number | null;
  artifactKinds: string[];
};

const VALID_STAGE_STATUSES = new Set<PipelineStageStatus>([
  "pending",
  "running",
  "completed",
  "skipped",
  "blocked",
  "failed",
]);

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asProgress(value: unknown): number {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(100, Math.trunc(number))) : 0;
}

export function initialPipelineStages(): PipelineStage[] {
  return PIPELINE_STAGE_DEFINITIONS.map(([id, label]) => ({
    id,
    label,
    status: "pending",
    progress: 0,
    message: null,
    startedAt: null,
    finishedAt: null,
    durationMs: null,
    artifactKinds: [],
  }));
}

/**
 * Keeps the UI contract identical to the backend contract even while a
 * callback is incomplete, contains unknown stages, or uses snake_case keys.
 */
export function normalizePipelineStages(value: unknown): PipelineStage[] {
  const items = Array.isArray(value) ? value : [];
  const normalized = new Map<string, PipelineStage>();

  for (const item of items) {
    const source = asRecord(item);
    if (!source) continue;

    const id = asString(source.id) ?? asString(source.key);
    const definition = PIPELINE_STAGE_DEFINITIONS.find(([stageId]) => stageId === id);
    if (!definition) {
      continue;
    }
    const stageId = definition[0];

    const rawStatus = asString(source.status);
    const status = VALID_STAGE_STATUSES.has(rawStatus as PipelineStageStatus)
      ? (rawStatus as PipelineStageStatus)
      : "pending";
    const artifacts = source.artifactKinds ?? source.artifact_kinds;

    normalized.set(stageId, {
      id: stageId,
      label: asString(source.label) ?? definition[1],
      status,
      progress: asProgress(source.progress),
      message: asString(source.message),
      startedAt: asString(source.startedAt) ?? asString(source.started_at),
      finishedAt: asString(source.finishedAt) ?? asString(source.finished_at),
      durationMs:
        typeof source.durationMs === "number"
          ? source.durationMs
          : typeof source.duration_ms === "number"
            ? source.duration_ms
            : null,
      artifactKinds: Array.isArray(artifacts)
        ? artifacts.filter((artifact): artifact is string => typeof artifact === "string")
        : [],
    });
  }

  return initialPipelineStages().map((stage) => normalized.get(stage.id) ?? stage);
}

export const PROCESSING_STATUS_LABELS: Record<string, string> = {
  queued: "En cola",
  running: "Procesando",
  blocked_review: "Esperando revisión humana",
  completed: "Procesamiento completado",
  failed: "Procesamiento fallido",
  cancelled: "Cancelado",
};

export const STAGE_STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  running: "En proceso",
  completed: "Completado",
  skipped: "Omitido",
  blocked: "Bloqueado",
  failed: "Fallido",
};
