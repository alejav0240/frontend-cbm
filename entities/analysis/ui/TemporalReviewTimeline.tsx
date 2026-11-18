"use client";

import { Check, Clock3, X } from "lucide-react";

import { useAnnotationCases } from "../api/anotaciones";

function seconds(value: number) {
  return value.toFixed(2) + " s";
}

export function TemporalReviewTimeline({ runId }: { runId: string }) {
  const { cases, loading, error, reviewing, reviewCase } = useAnnotationCases(runId);

  if (loading && cases.length === 0) {
    return <p className="text-xs text-gray-500">Cargando ventanas para revisión...</p>;
  }

  if (error) {
    return <p className="text-xs text-red-600">No se pudieron cargar las anotaciones.</p>;
  }

  if (cases.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4 text-xs text-gray-500">
        No hay candidatos temporales pendientes para esta ejecución.
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
          Revisión temporal
        </p>
        <p className="text-xs text-gray-500">
          Acepta o rechaza eventos antes de incorporarlos al dataset.
        </p>
      </div>

      <div className="space-y-2">
        {cases.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200 dark:border-white/10 p-3 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold dark:text-white">{item.label}</p>
                <p className="text-[11px] text-gray-500">
                  {item.modality} · {item.actorRole} · ventana {item.windowId}
                </p>
                <p className="text-[11px] text-gray-400">
                  {seconds(item.startSeconds)} — {seconds(item.endSeconds)}
                </p>
              </div>
              <span className="text-[10px] rounded-full bg-gray-100 dark:bg-white/10 px-2 py-1">
                {item.status}
              </span>
            </div>

            {item.status === "pending" && (
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={reviewing}
                  onClick={() => void reviewCase({ caseId: item.id, decision: "accept" })}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-50"
                >
                  <Check size={13} /> Aceptar
                </button>
                <button
                  type="button"
                  disabled={reviewing}
                  onClick={() => void reviewCase({ caseId: item.id, decision: "reject" })}
                  className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-50"
                >
                  <X size={13} /> Rechazar
                </button>
              </div>
            )}

            {item.status !== "pending" && (
              <p className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                <Clock3 size={13} /> Caso revisado; conserva trazabilidad del revisor.
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
