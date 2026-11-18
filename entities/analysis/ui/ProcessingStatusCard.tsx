"use client";

import { AlertCircle, CheckCircle2, Clock3, Loader2, ShieldCheck } from "lucide-react";

import { useProcessingRuns, type ProcessingRun } from "../api/useProcessingRuns";

const STATUS_LABELS: Record<string, string> = {
  queued: "En cola",
  running: "Procesando",
  blocked_review: "Esperando revisión humana",
  completed: "Procesamiento completado",
  failed: "Procesamiento fallido",
  cancelled: "Cancelado",
};

function statusIcon(status: string) {
  if (status === "running") return <Loader2 size={18} className="animate-spin" />;
  if (status === "completed") return <CheckCircle2 size={18} />;
  if (status === "failed") return <AlertCircle size={18} />;
  return <Clock3 size={18} />;
}

function latestRun(runs: ProcessingRun[]) {
  return [...runs].sort((a, b) => {
    const left = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const right = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return right - left;
  })[0];
}

export function ProcessingStatusCard({ sessionId }: { sessionId: string }) {
  const { runs, loading, error, startRun, starting } = useProcessingRuns(sessionId);
  const run = latestRun(runs);

  if (loading && !run) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-5 text-sm text-gray-500">
        Cargando estado del procesamiento...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5 text-sm text-red-700">
        No se pudo consultar el estado del análisis.
      </div>
    );
  }

  if (!run) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-5 space-y-3">
        <p className="text-sm text-gray-500">
          Esta sesión todavía no tiene un procesamiento multimodal registrado.
        </p>
        <button
          type="button"
          onClick={() => void startRun()}
          disabled={starting}
          className="rounded-xl bg-[#008080] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
        >
          {starting ? "Solicitando..." : "Iniciar análisis multimodal"}
        </button>
      </div>
    );
  }

  const provisional = run.status === "completed" || run.status === "blocked_review";

  return (
    <section className="rounded-2xl border border-purple-200/60 bg-purple-50/40 dark:border-purple-400/20 dark:bg-purple-500/5 p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-600 dark:text-purple-300">
            Procesamiento DEMUCA
          </p>
          <h3 className="mt-1 text-lg font-bold dark:text-white">
            {STATUS_LABELS[run.status] ?? run.status}
          </h3>
        </div>
        <div className="text-purple-600 dark:text-purple-300">{statusIcon(run.status)}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300">
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-gray-400">Pipeline</span>
          <span className="font-mono">{run.pipelineVersion}</span>
        </div>
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-gray-400">Artefactos</span>
          <span>{run.artifacts.length}</span>
        </div>
      </div>

      {run.errorMessage && (
        <p className="rounded-xl bg-red-50 p-3 text-xs text-red-700">
          {run.errorMessage}
        </p>
      )}

      {provisional && (
        <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
          <ShieldCheck size={16} className="mt-0.5 shrink-0" />
          <span>
            La salida es evidencia provisional. Requiere revisión humana y no sustituye la evaluación clínica DEMUCA.
          </span>
        </div>
      )}
    </section>
  );
}
