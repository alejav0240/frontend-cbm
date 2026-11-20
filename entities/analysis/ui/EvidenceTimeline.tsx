"use client";

import { useMemo, useRef, useState } from "react";
import { Check, Play, Video, X } from "lucide-react";
import { useAnnotationCases } from "../api/anotaciones";

type EvidenceWindow = {
  windowId: string;
  startSeconds: number;
  endSeconds: number;
  predictions: Array<{ label: string; probability?: number }>;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readWindows(result: Record<string, unknown>): EvidenceWindow[] {
  const sources = ["model_predictions", "provisional_evidence", "prediction_review"];
  for (const source of sources) {
    const payload = result[source];
    if (!isObject(payload) || !Array.isArray(payload.windows)) continue;
    return payload.windows.flatMap((item, index) => {
      if (!isObject(item)) return [];
      const start = Number(item.start_seconds);
      const end = Number(item.end_seconds);
      if (!Number.isFinite(start) || !Number.isFinite(end)) return [];
      const predictions = isObject(item.predictions)
        ? Object.entries(item.predictions)
            .filter(([, value]) => Boolean(value))
            .map(([label]) => ({
              label,
              probability:
                isObject(item.probabilities) && typeof item.probabilities[label] === "number"
                  ? Number(item.probabilities[label])
                  : undefined,
            }))
        : [];
      return [
        {
          windowId: String(item.window_id ?? `window-${index + 1}`),
          startSeconds: start,
          endSeconds: end,
          predictions,
        },
      ];
    });
  }
  return [];
}

function formatSeconds(value: number) {
  return `${value.toFixed(2)} s`;
}

export function EvidenceTimeline({
  result,
  sourceUri,
  runId,
}: {
  result: Record<string, unknown>;
  sourceUri?: string | null;
  runId: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [filter, setFilter] = useState<"all" | "with-evidence">("all");
  const { cases, reviewing, reviewCase } = useAnnotationCases(runId);
  const windows = useMemo(() => readWindows(result), [result]);
  const visibleWindows =
    filter === "with-evidence"
      ? windows.filter((window) => window.predictions.length > 0)
      : windows;

  if (windows.length === 0) return null;

  const jumpToWindow = (window: EvidenceWindow) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = window.startSeconds;
    void videoRef.current.play();
  };

  const canPlayVideo = Boolean(sourceUri && /^https?:\/\//i.test(sourceUri));
  const caseByEvidence = new Map(
    cases.map((item) => [`${item.windowId}:${item.label}`, item]),
  );

  return (
    <section className="space-y-4 rounded-2xl border border-indigo-200/70 bg-indigo-50/40 p-4 dark:border-indigo-400/20 dark:bg-indigo-500/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
            Evidencia temporal
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
            Cada tarjeta representa una ventana que pudo influir en el análisis.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg bg-white/70 p-1 dark:bg-white/10">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-md px-2.5 py-1 text-[10px] font-bold ${
              filter === "all"
                ? "bg-indigo-600 text-white"
                : "text-gray-500 dark:text-gray-300"
            }`}
          >
            Todas ({windows.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("with-evidence")}
            className={`rounded-md px-2.5 py-1 text-[10px] font-bold ${
              filter === "with-evidence"
                ? "bg-indigo-600 text-white"
                : "text-gray-500 dark:text-gray-300"
            }`}
          >
            Con señales
          </button>
        </div>
      </div>

      {canPlayVideo && (
        <video
          ref={videoRef}
          controls
          preload="metadata"
          className="aspect-video w-full rounded-xl bg-black"
        >
          <source src={sourceUri ?? undefined} type="video/mp4" />
          Tu navegador no puede reproducir este video.
        </video>
      )}

      {!canPlayVideo && (
        <p className="rounded-xl bg-white/70 p-3 text-[11px] text-gray-600 dark:bg-white/5 dark:text-gray-300">
          Las ventanas están disponibles, pero la fuente de video no es una URL
          reproducible desde el navegador.
        </p>
      )}

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {visibleWindows.map((window) => (
          <div
            key={window.windowId}
            onClick={() => jumpToWindow(window)}
            onKeyDown={(event) => {
              if (canPlayVideo && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                jumpToWindow(window);
              }
            }}
            role={canPlayVideo ? "button" : undefined}
            tabIndex={canPlayVideo ? 0 : undefined}
            className={`rounded-xl border border-indigo-200/70 bg-white/80 p-3 text-left transition dark:border-indigo-400/20 dark:bg-white/5 ${
              canPlayVideo
                ? "cursor-pointer hover:border-indigo-400 hover:shadow-sm"
                : "cursor-default"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-indigo-800 dark:text-indigo-100">
                {window.windowId}
              </span>
              {canPlayVideo ? (
                <Play size={14} className="text-indigo-600 dark:text-indigo-300" />
              ) : (
                <Video size={14} className="text-gray-400" />
              )}
            </div>
            <p className="mt-1 text-[11px] text-gray-500">
              {formatSeconds(window.startSeconds)} — {formatSeconds(window.endSeconds)}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {window.predictions.length > 0 ? (
                window.predictions.map((prediction) => (
                  <div
                    key={prediction.label}
                    className="rounded-lg bg-indigo-100 px-2 py-1 text-[10px] text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>
                        {prediction.label}
                        {typeof prediction.probability === "number"
                          ? ` · ${Math.round(prediction.probability * 100)}%`
                          : ""}
                      </span>
                      {(() => {
                        const annotationCase = caseByEvidence.get(
                          `${window.windowId}:${prediction.label}`,
                        );
                        if (!annotationCase) {
                          return (
                            <span className="text-[9px] text-gray-500">
                              Sin revisión
                            </span>
                          );
                        }
                        if (annotationCase.status !== "pending") {
                          return (
                            <span className="font-bold">
                              {annotationCase.status === "accepted"
                                ? "Aceptada"
                                : annotationCase.status === "rejected"
                                  ? "Rechazada"
                                  : "Adjudicación"}
                            </span>
                          );
                        }
                        return (
                          <span className="flex gap-1">
                            <button
                              type="button"
                              aria-label={`Aceptar ${prediction.label}`}
                              disabled={reviewing}
                              onClick={(event) => {
                                event.stopPropagation();
                                void reviewCase({
                                  caseId: annotationCase.id,
                                  decision: "accept",
                                });
                              }}
                              className="rounded bg-emerald-600 p-1 text-white disabled:opacity-50"
                            >
                              <Check size={11} />
                            </button>
                            <button
                              type="button"
                              aria-label={`Rechazar ${prediction.label}`}
                              disabled={reviewing}
                              onClick={(event) => {
                                event.stopPropagation();
                                void reviewCase({
                                  caseId: annotationCase.id,
                                  decision: "reject",
                                });
                              }}
                              className="rounded bg-red-600 p-1 text-white disabled:opacity-50"
                            >
                              <X size={11} />
                            </button>
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-[10px] text-gray-400">Sin señales positivas</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
