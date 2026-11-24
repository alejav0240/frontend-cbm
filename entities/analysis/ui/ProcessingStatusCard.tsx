"use client";

import { AlertCircle, CheckCircle2, Clock3, Loader2, ShieldCheck } from "lucide-react";

import {
  getProcessingErrorMessage,
  useProcessingRuns,
  type ProcessingRun,
} from "../api/useProcessingRuns";
import { TemporalReviewTimeline } from "./TemporalReviewTimeline";
import { ProcessingPipeline } from "./ProcessingPipeline";
import { EvidenceTimeline } from "./EvidenceTimeline";

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

function labelForKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (value) => value.toUpperCase());
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function formatSeconds(value: unknown) {
  return typeof value === "number" ? `${value.toFixed(2)} s` : "—";
}

function DemucaBreakdown({ value }: { value: Record<string, unknown> }) {
  const evidence = isObject(value.evidence) ? value.evidence : {};
  const domains = Object.entries(value).filter(
    ([key, entry]) =>
      key !== "evidence" &&
      isObject(entry) &&
      Object.values(entry).some((item) => typeof item === "number"),
  );

  return (
    <div className="mt-3 space-y-3">
      <div className="rounded-lg bg-purple-50 p-3 text-[11px] text-purple-900 dark:bg-purple-500/10 dark:text-purple-100">
        Seleccioná un indicador para consultar las ventanas y señales que
        sustentaron su puntuación.
      </div>
      {domains.map(([domain, entries]) => (
        <details
          key={domain}
          className="rounded-xl border border-purple-200/60 bg-white/70 p-3 dark:border-purple-400/20 dark:bg-white/5"
        >
          <summary className="cursor-pointer text-xs font-bold text-purple-800 dark:text-purple-100">
            {labelForKey(domain)}
          </summary>
          <div className="mt-2 space-y-2">
            {Object.entries(entries as Record<string, unknown>).map(
              ([item, score]) => {
                const itemEvidence = isObject(evidence[`${domain}.${item}`])
                  ? (evidence[`${domain}.${item}`] as Record<string, unknown>)
                  : {};
                const windows = Array.isArray(itemEvidence.evidence_windows)
                  ? itemEvidence.evidence_windows
                  : [];
                return (
                  <details
                    key={item}
                    className="rounded-lg border border-purple-100 p-3 dark:border-purple-400/10"
                  >
                    <summary className="cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-200">
                      <span>{labelForKey(item)}</span>
                      <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] text-purple-700 dark:bg-purple-500/20 dark:text-purple-200">
                        {String(score)}/2
                      </span>
                    </summary>
                    <div className="mt-3 space-y-2 text-[11px] text-gray-600 dark:text-gray-300">
                      <p>
                        Estado:{" "}
                        <strong>{String(itemEvidence.evidence_status ?? "—")}</strong>
                        {" · "}Confianza:{" "}
                        <strong>
                          {String(itemEvidence.confidence_percent ?? 0)}%
                        </strong>
                      </p>
                      <p>
                        Señales usadas:{" "}
                        {Array.isArray(itemEvidence.source_labels) &&
                        itemEvidence.source_labels.length > 0
                          ? itemEvidence.source_labels.join(", ")
                          : "ninguna"}
                      </p>
                      {windows.length > 0 ? (
                        <div className="space-y-2">
                          <p className="font-semibold text-gray-700 dark:text-gray-200">
                            Ventanas consideradas
                          </p>
                          {windows.map((window, index) => {
                            if (!isObject(window)) return null;
                            const signals = Array.isArray(window.signals)
                              ? window.signals
                              : [];
                            return (
                              <div
                                key={`${String(window.window_id)}-${index}`}
                                className="rounded-lg bg-gray-50 p-2 dark:bg-white/5"
                              >
                                <p className="font-semibold">
                                  {String(window.window_id ?? `Ventana ${index + 1}`)}
                                  {" · "}
                                  {formatSeconds(window.start_seconds)} —{" "}
                                  {formatSeconds(window.end_seconds)}
                                </p>
                                <ul className="mt-1 space-y-1">
                                  {signals.map((signal, signalIndex) => {
                                    if (!isObject(signal)) return null;
                                    return (
                                      <li key={`${String(signal.label)}-${signalIndex}`}>
                                        {String(signal.label)}: probabilidad{" "}
                                        {String(signal.probability)} · aporte{" "}
                                        {String(signal.contribution)}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p>No hay ventanas individuales disponibles para este indicador.</p>
                      )}
                    </div>
                  </details>
                );
              },
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

function ResultadoProcesamiento({ result }: { result: Record<string, unknown> }) {
  const sections = Object.entries(result).filter(
    ([key]) =>
      ![
        "schema_version",
        "status",
        "session_id",
        "semantic_status",
        "pipeline_stages",
      ].includes(key),
  );

  if (sections.length === 0) {
    return (
      <p className="rounded-xl bg-white/60 p-3 text-xs text-gray-600 dark:bg-white/5 dark:text-gray-300">
        El procesamiento terminó, pero el worker no devolvió una respuesta
        detallada.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
          Respuesta del análisis
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Resultado provisional generado por el worker. Requiere revisión humana.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {sections.map(([key, value]) => (
          <details
            key={key}
            open={key === "demuca" || key === "observations"}
            className="rounded-xl border border-purple-200/60 bg-white/60 p-3 dark:border-purple-400/20 dark:bg-white/5"
          >
            <summary className="cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-200">
              {labelForKey(key)}
            </summary>
            {key === "demuca" && isObject(value) ? (
              <DemucaBreakdown value={value} />
            ) : (
              <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
                {isObject(value)
                  ? JSON.stringify(value, null, 2)
                  : String(value ?? "—")}
              </pre>
            )}
          </details>
        ))}
      </div>

      <details className="rounded-xl border border-gray-200 p-3 dark:border-white/10">
        <summary className="cursor-pointer text-[11px] font-bold text-gray-500">
          Ver respuesta JSON completa
        </summary>
        <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words text-[11px] text-gray-600 dark:text-gray-300">
          {JSON.stringify(result, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export function ProcessingStatusCard({
  sessionId,
  sourceUri,
}: {
  sessionId: string;
  sourceUri?: string | null;
}) {
  const { runs, loading, error, startRun, starting, startError } =
    useProcessingRuns(sessionId);
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
          onClick={() => void startRun(sourceUri ?? undefined)}
          disabled={starting}
          className="rounded-xl bg-[#008080] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
        >
          {starting ? "Solicitando..." : "Iniciar análisis multimodal"}
        </button>
        {startError && (
          <p className="rounded-xl bg-red-50 p-3 text-xs text-red-700">
            {startError}
          </p>
        )}
      </div>
    );
  }

  const canRetry =
    run.status === "failed" ||
    run.status === "cancelled" ||
    run.status === "queued" ||
    Boolean(run.errorMessage);
  const provisional =
    run.semanticStatus === "provisional_evidence" ||
    run.semanticStatus === "provisional" ||
    run.semanticStatus === "draft";
  const processingErrorMessage = getProcessingErrorMessage(run);
  const isBlockedByDuration = run.errorCode === "insufficient_duration_for_window";

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
        <div className="flex items-center gap-3">
          {canRetry && (
            <button
              type="button"
              onClick={() => void startRun(sourceUri ?? run.sourceUri ?? undefined)}
              disabled={starting}
              className="rounded-xl bg-[#008080] px-4 py-2 text-xs font-bold text-white hover:bg-[#006666] transition disabled:opacity-50 shadow-sm"
            >
              {starting ? "Solicitando..." : "Reintentar análisis multimodal"}
            </button>
          )}
          <div className="text-purple-600 dark:text-purple-300">{statusIcon(run.status)}</div>
        </div>
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

      <ProcessingPipeline stages={run.pipelineStages} />

      {run.errorMessage && (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl p-4 border text-xs ${
          isBlockedByDuration
            ? "bg-amber-50 border-amber-200 text-amber-800"
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          <div>
            <p className="font-semibold">
              {isBlockedByDuration
                ? "La sesión no puede analizarse con esta configuración:"
                : "Ocurrió un error en el procesamiento:"}
            </p>
            <p className="mt-0.5 text-[11px]">
              {processingErrorMessage}
            </p>
          </div>
          {canRetry && (
            <button
              type="button"
              onClick={() => void startRun(sourceUri ?? run.sourceUri ?? undefined)}
              disabled={starting}
              className="shrink-0 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-bold text-white transition disabled:opacity-50 shadow-sm"
            >
              {starting ? "Solicitando..." : "Reintentar ahora"}
            </button>
          )}
        </div>
      )}

      {run.status === "completed" && run.result && (
        <>
          <EvidenceTimeline
            result={run.result}
            sourceUri={run.sourceUri}
            runId={run.id}
          />
          <ResultadoProcesamiento result={run.result} />
        </>
      )}

      {provisional && (
        <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
          <ShieldCheck size={16} className="mt-0.5 shrink-0" />
          <span>
            La salida es evidencia provisional. Requiere revisión humana y no sustituye la evaluación clínica DEMUCA.
          </span>
        </div>
      )}

      {(run.status === "completed" || run.status === "blocked_review" || run.reviewRequired) && (
        <TemporalReviewTimeline runId={run.id} />
      )}

      {canRetry && (
        <button
          type="button"
          onClick={() => void startRun(sourceUri ?? run.sourceUri ?? undefined)}
          disabled={starting}
          className="rounded-xl bg-[#008080] px-4 py-2 text-xs font-bold text-white hover:bg-[#006666] transition disabled:opacity-50"
        >
          {starting ? "Solicitando..." : "Reintentar análisis multimodal"}
        </button>
      )}
    </section>
  );
}
