"use client";

import { useState } from "react";
import {
  Activity,
  AlertCircle,
  Check,
  ChevronRight,
  Clock3,
  Database,
  Eye,
  FileCheck2,
  Film,
  GitBranch,
  Loader2,
  Minus,
  Music2,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";

export type PipelineStage = {
  id: string;
  label: string;
  status: "pending" | "running" | "completed" | "skipped" | "blocked" | "failed" | string;
  progress: number;
  message?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
  durationMs?: number | null;
  artifactKinds: string[];
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  running: "En proceso",
  completed: "Completado",
  skipped: "Omitido",
  blocked: "Bloqueado",
  failed: "Fallido",
};

const STAGE_DESCRIPTIONS: Record<string, string> = {
  extraction: "Normaliza el audio y el video para que puedan analizarse de forma consistente.",
  segmentation: "Alinea los medios y crea ventanas temporales estables de análisis.",
  pose: "Extrae información de postura y movimiento cuando existe un modelo de pose.",
  audio: "Calcula características acústicas y candidatos de vocalización por ventana.",
  movement: "Deriva señales anónimas de movimiento e interacción.",
  validation: "Comprueba estructura, sincronización, procedencia y hashes de los artefactos.",
  inference: "Aplica el modelo autorizado o genera evidencia provisional observable.",
  demuca: "Proyecta las señales observables en la escala DEMUCA revisable.",
  human_review: "Requiere la revisión profesional antes de interpretar o reutilizar el resultado.",
};

const STAGE_ICONS: Record<string, typeof Activity> = {
  extraction: Film,
  segmentation: GitBranch,
  pose: Eye,
  audio: Music2,
  movement: Activity,
  validation: FileCheck2,
  inference: Sparkles,
  demuca: ShieldCheck,
  human_review: UserCheck,
};

const CARD_TONE: Record<string, string> = {
  pending:
    "border-slate-200 bg-white text-slate-500 dark:border-white/10 dark:bg-white/[0.03]",
  running:
    "border-blue-300 bg-blue-50 text-blue-700 shadow-blue-100 dark:border-blue-400/40 dark:bg-blue-500/10 dark:text-blue-200",
  completed:
    "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-200",
  skipped:
    "border-slate-200 bg-slate-50 text-slate-400 dark:border-white/10 dark:bg-white/[0.03]",
  blocked:
    "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/40 dark:bg-amber-500/10 dark:text-amber-200",
  failed:
    "border-red-300 bg-red-50 text-red-700 dark:border-red-400/40 dark:bg-red-500/10 dark:text-red-200",
};

function StageStatusIcon({ status }: { status: string }) {
  if (status === "running") return <Loader2 size={17} className="animate-spin" />;
  if (status === "completed") return <Check size={17} />;
  if (status === "failed" || status === "blocked") return <AlertCircle size={17} />;
  if (status === "skipped") return <Minus size={17} />;
  return <Clock3 size={17} />;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("es-ES");
}

function formatDuration(durationMs?: number | null) {
  if (typeof durationMs !== "number") return "No disponible";
  if (durationMs < 1000) return `${durationMs} ms`;
  return `${(durationMs / 1000).toFixed(1)} s`;
}

function StageIcon({ id }: { id: string }) {
  const Icon = STAGE_ICONS[id] ?? Database;
  return <Icon size={19} aria-hidden="true" />;
}

function StageCard({
  stage,
  selected,
  onSelect,
}: {
  stage: PipelineStage;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group w-[220px] shrink-0 rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        CARD_TONE[stage.status] ?? CARD_TONE.pending
      } ${selected ? "ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-[#111]" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 dark:bg-white/10">
          <StageIcon id={stage.id} />
        </span>
        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide">
          <StageStatusIcon status={stage.status} />
          {STATUS_LABELS[stage.status] ?? stage.status}
        </span>
      </div>
      <p className="mt-4 min-h-9 text-sm font-bold">{stage.label}</p>
      <div className="mt-3 flex items-center justify-between text-[10px] opacity-75">
        <span>{stage.status === "running" ? `${stage.progress}%` : "Ver detalle"}</span>
        <span>Etapa {stage.id}</span>
      </div>
      {stage.status === "running" && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-current transition-all"
            style={{ width: `${Math.max(0, Math.min(100, stage.progress))}%` }}
          />
        </div>
      )}
    </button>
  );
}

function StageDetails({ stage }: { stage: PipelineStage }) {
  const description =
    STAGE_DESCRIPTIONS[stage.id] ??
    "Esta etapa forma parte del procesamiento multimodal de la sesión.";
  const artifacts = stage.artifactKinds ?? [];

  return (
    <div className="rounded-2xl border border-purple-200/70 bg-white/80 p-5 shadow-sm dark:border-purple-400/20 dark:bg-white/[0.04]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-200">
            <StageIcon id={stage.id} />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-600 dark:text-purple-300">
              Información de la etapa
            </p>
            <h4 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {stage.label}
            </h4>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-gray-500 dark:text-gray-300">
              {description}
            </p>
          </div>
        </div>
        <span
          className={`self-start rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
            CARD_TONE[stage.status] ?? CARD_TONE.pending
          }`}
        >
          {STATUS_LABELS[stage.status] ?? stage.status}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Info label="Progreso" value={`${stage.progress ?? 0}%`} />
        <Info label="Inicio" value={formatDate(stage.startedAt)} />
        <Info label="Fin" value={formatDate(stage.finishedAt)} />
        <Info label="Duración" value={formatDuration(stage.durationMs)} />
      </div>

      {stage.message && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-white/5 dark:text-slate-300">
          <strong>Qué sucedió:</strong> {stage.message}
        </div>
      )}

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Artefactos generados
        </p>
        {artifacts.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {artifacts.map((artifact) => (
              <span
                key={artifact}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600 dark:bg-white/10 dark:text-slate-300"
              >
                {artifact}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-gray-500">
            Esta etapa no reportó artefactos individuales.
          </p>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-1 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

export function ProcessingPipeline({ stages }: { stages: PipelineStage[] }) {
  const [selectedId, setSelectedId] = useState(stages[0]?.id ?? "");

  if (stages.length === 0) return null;

  const selectedStage = stages.find((stage) => stage.id === selectedId) ?? stages[0];

  return (
    <section className="space-y-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
          Pipeline completo
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Hacé click en cualquier tarjeta para ver qué ocurrió en ese paso.
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max items-center gap-2">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center gap-2">
              <StageCard
                stage={stage}
                selected={selectedStage.id === stage.id}
                onSelect={() => setSelectedId(stage.id)}
              />
              {index < stages.length - 1 && (
                <ChevronRight
                  size={20}
                  className="shrink-0 text-purple-300 dark:text-purple-400/50"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <StageDetails stage={selectedStage} />
    </section>
  );
}
