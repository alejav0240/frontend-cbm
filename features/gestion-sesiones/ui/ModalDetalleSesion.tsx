"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/shared/ui/components/Modal";
import { useSesionDetalles } from "@/entities/sesion";
import {
  FileText,
  PenTool,
  Download,
  ClipboardList,
  BarChart3,
  CheckCircle,
  Circle,
} from "lucide-react";

type TabId = "info" | "plan" | "evaluaciones" | "notas";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "info", label: "Información", icon: <FileText size={14} /> },
  { id: "plan", label: "Plan", icon: <ClipboardList size={14} /> },
  { id: "evaluaciones", label: "Evaluaciones", icon: <BarChart3 size={14} /> },
  { id: "notas", label: "Notas", icon: <PenTool size={14} /> },
];

interface ModalDetalleSesionProps {
  isOpen: boolean;
  onClose: () => void;
  sesionId: string | null;
  numeroSesion: number;
  pacienteNombre: string;
  onExportar?: () => void;
  onGuardarNotas?: (notas: string) => void;
}

export function ModalDetalleSesion({
  isOpen,
  onClose,
  sesionId,
  numeroSesion,
  pacienteNombre,
  onExportar,
  onGuardarNotas,
}: ModalDetalleSesionProps) {
  const [activeTab, setActiveTab] = useState<TabId>("info");
  const [editandoNotas, setEditandoNotas] = useState(false);
  const [notasEditadas, setNotasEditadas] = useState("");

  const { obtenerSesion, cargando, sesion } = useSesionDetalles();

  useEffect(() => {
    if (isOpen && sesionId) {
      setActiveTab("info");
      setEditandoNotas(false);
      obtenerSesion({ variables: { id: sesionId } });
    }
  }, [isOpen, sesionId, obtenerSesion]);

  useEffect(() => {
    if (sesion?.notes) {
      setNotasEditadas(
        Array.isArray(sesion.notes) ? sesion.notes.join("\n") : sesion.notes,
      );
    }
  }, [sesion?.notes]);

  const fechaFormateada = sesion?.sessionDate
    ? new Intl.DateTimeFormat("es-ES", {
        dateStyle: "full",
      }).format(new Date(String(sesion.sessionDate)))
    : "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Sesión #${numeroSesion}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {pacienteNombre}
        </p>

        <div className="flex gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? "bg-white dark:bg-[#111] text-[#008080] shadow-sm"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {cargando && (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#008080] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!cargando && sesion && (
          <>
            {activeTab === "info" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard label="Fecha" value={fechaFormateada} />
                  <InfoCard
                    label="Duración"
                    value={`${sesion.durationMinutes} min`}
                  />
                  <InfoCard label="Ciclo" value={`#${sesion.cycleNumber}`} />
                  <InfoCard
                    label="Registro"
                    value={
                      sesion.createdAt
                        ? new Intl.DateTimeFormat("es-ES").format(
                            new Date(String(sesion.createdAt)),
                          )
                        : "—"
                    }
                  />
                </div>

                {sesion.sessionResources &&
                  sesion.sessionResources.length > 0 && (
                    <div className="bg-gray-50 dark:bg-white/2 p-5 rounded-2xl border border-gray-100 dark:border-white/5">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                        Recursos
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {sesion.sessionResources.map(
                          (r, i) =>
                            r && (
                              <span
                                key={i}
                                className="px-3 py-1.5 bg-[#008080]/10 text-[#008080] rounded-lg text-xs font-bold"
                              >
                                {r.resource?.title}
                              </span>
                            ),
                        )}
                      </div>
                    </div>
                  )}

                {sesion.sessionInventory &&
                  sesion.sessionInventory.length > 0 && (
                    <div className="bg-gray-50 dark:bg-white/2 p-5 rounded-2xl border border-gray-100 dark:border-white/5">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                        Inventario
                      </h4>
                      <div className="space-y-1">
                        {sesion.sessionInventory.map(
                          (inv, i) =>
                            inv && (
                              <p key={i} className="text-sm dark:text-gray-300">
                                {inv.item.name}
                                {inv.item.room && (
                                  <span className="text-gray-400 ml-1">
                                    ({inv.item.room})
                                  </span>
                                )}
                              </p>
                            ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {activeTab === "plan" && (
              <div className="space-y-4">
                {sesion.sessionPlanSteps &&
                sesion.sessionPlanSteps.length > 0 ? (
                  sesion.sessionPlanSteps.map(
                    (step, i) =>
                      step && (
                        <div
                          key={step.id}
                          className="bg-gray-50 dark:bg-white/2 p-5 rounded-2xl border border-gray-100 dark:border-white/5"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {step.isCompleted ? (
                                <CheckCircle
                                  size={18}
                                  className="text-green-500"
                                />
                              ) : (
                                <Circle size={18} className="text-gray-300" />
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-[#008080] uppercase tracking-widest">
                                  Paso {i + 1}
                                </span>
                                {step.planStep?.moment && (
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {step.planStep.moment}
                                  </span>
                                )}
                                {step.actualDuration && (
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {step.actualDuration} min
                                  </span>
                                )}
                              </div>
                              {step.planStep?.objective && (
                                <p className="text-sm dark:text-gray-300">
                                  {step.planStep.objective}
                                </p>
                              )}
                              {step.planStep?.focus && (
                                <p className="text-xs text-gray-400">
                                  Enfoque: {step.planStep.focus}
                                </p>
                              )}
                              {step.planStep?.mltMethod && (
                                <p className="text-xs text-gray-400">
                                  Método MLT: {step.planStep.mltMethod}
                                </p>
                              )}
                              {step.planStep?.musicalResources && (
                                <p className="text-xs text-gray-400">
                                  Recursos musicales:{" "}
                                  {step.planStep.musicalResources}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ),
                  )
                ) : (
                  <EmptyState message="No hay pasos de plan registrados" />
                )}
              </div>
            )}

            {activeTab === "evaluaciones" && (
              <div className="space-y-6">
                {sesion.scaleEvaluations &&
                sesion.scaleEvaluations.length > 0 ? (
                  sesion.scaleEvaluations.map(
                    (evaluacion) =>
                      evaluacion && (
                        <div
                          key={evaluacion.id}
                          className="bg-gray-50 dark:bg-white/2 p-5 rounded-2xl border border-gray-100 dark:border-white/5"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold dark:text-white">
                              Escala
                            </h4>
                            <span className="text-lg font-bold text-[#008080]">
                              {evaluacion.totalScore}
                            </span>
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                            {evaluacion.evaluatedAt
                              ? new Intl.DateTimeFormat("es-ES").format(
                                  new Date(String(evaluacion.evaluatedAt)),
                                )
                              : ""}
                          </p>
                          {evaluacion.subscaleResponses &&
                            evaluacion.subscaleResponses.length > 0 && (
                              <div className="space-y-2">
                                {evaluacion.subscaleResponses.map(
                                  (sub, j) =>
                                    sub && (
                                      <div
                                        key={j}
                                        className="flex justify-between items-center text-sm"
                                      >
                                        <span className="dark:text-gray-300">
                                          Subescala
                                        </span>
                                        <span className="font-bold dark:text-white">
                                          {sub.score}
                                        </span>
                                      </div>
                                    ),
                                )}
                              </div>
                            )}
                          {evaluacion.valueResponses &&
                            evaluacion.valueResponses.length > 0 && (
                              <div className="space-y-2 mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                                {evaluacion.valueResponses.map(
                                  (val, j) =>
                                    val && (
                                      <div
                                        key={j}
                                        className="flex justify-between items-center text-sm"
                                      >
                                        <span className="dark:text-gray-300">
                                          {val.scaleValue?.label}
                                        </span>
                                        <span className="font-bold dark:text-white">
                                          {val.scaleValue?.value}
                                        </span>
                                      </div>
                                    ),
                                )}
                              </div>
                            )}
                        </div>
                      ),
                  )
                ) : (
                  <EmptyState message="No hay evaluaciones registradas" />
                )}

                {sesion.formAssignments &&
                  sesion.formAssignments.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Cuestionarios
                      </h4>
                      {sesion.formAssignments.map(
                        (form, i) =>
                          form && (
                            <div
                              key={i}
                              className="bg-gray-50 dark:bg-white/2 p-5 rounded-2xl border border-gray-100 dark:border-white/5"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold dark:text-white">
                                  Formulario
                                </span>
                                <span className="text-xs font-bold text-[#008080]">
                                  {Math.round(
                                    (Number(form.completionRatio) || 0) * 100,
                                  )}
                                  % completado
                                </span>
                              </div>
                              {form.responses && form.responses.length > 0 && (
                                <div className="space-y-2">
                                  {form.responses.map(
                                    (resp, j) =>
                                      resp && (
                                        <div key={j} className="text-sm">
                                          <p className="font-bold dark:text-gray-300">
                                            {typeof resp.question === "string"
                                              ? resp.question
                                              : ((
                                                  resp.question as {
                                                    question: string;
                                                  }
                                                )?.question ?? "")}
                                          </p>
                                          <p className="text-gray-500 dark:text-gray-400 ml-2">
                                            {String(resp.response ?? "")}
                                          </p>
                                        </div>
                                      ),
                                  )}
                                </div>
                              )}
                            </div>
                          ),
                      )}
                    </div>
                  )}
              </div>
            )}

            {activeTab === "notas" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Notas Clínicas
                  </h4>
                  {!editandoNotas ? (
                    <button
                      onClick={() => setEditandoNotas(true)}
                      className="flex items-center gap-1 text-[10px] font-bold text-[#008080] hover:text-[#006666] uppercase tracking-widest transition-colors"
                    >
                      <PenTool size={12} />
                      Editar
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setEditandoNotas(false);
                          setNotasEditadas(
                            Array.isArray(sesion.notes)
                              ? sesion.notes.join("\n")
                              : sesion.notes || "",
                          );
                        }}
                        className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => {
                          onGuardarNotas?.(notasEditadas);
                          setEditandoNotas(false);
                        }}
                        className="text-[10px] font-bold text-[#008080] hover:text-[#006666] uppercase tracking-widest transition-colors"
                      >
                        Guardar
                      </button>
                    </div>
                  )}
                </div>

                {editandoNotas ? (
                  <textarea
                    value={notasEditadas}
                    onChange={(e) => setNotasEditadas(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
                    placeholder="Escribe las observaciones clínicas aquí..."
                  />
                ) : (
                  <div className="bg-gray-50 dark:bg-white/2 p-6 rounded-2xl border border-gray-100 dark:border-white/5 min-h-[120px]">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {sesion.notes ||
                        "No hay notas registradas para esta sesión."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
          {onExportar && (
            <button
              onClick={onExportar}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-xl text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
            >
              <Download size={14} />
              Exportar
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#008080] text-white rounded-xl text-xs font-bold hover:bg-[#006666] transition-all shadow-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 dark:bg-white/2 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-sm font-bold dark:text-white">{value}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <FileText size={32} className="mb-3 opacity-30" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
