"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import Modal from "@/shared/ui/components/Modal";
import { useSesionDetalles } from "@/entities/sesion";
import { ProcessingStatusCard } from "@/entities/analysis/ui/ProcessingStatusCard";
import { ACTUALIZAR_EVALUACION_ESCALA } from "@/entities/escalas/api/mutaciones";
import type {
  UpdateScaleEvaluationMutation,
  UpdateScaleEvaluationMutationVariables,
} from "@/shared/api/generated/graphql";
import {
  FileText,
  PenTool,
  Download,
  ClipboardList,
  BarChart3,
  CheckCircle,
  Circle,
  Upload,
  Loader2,
  AlertCircle,
  Sparkles,
  Save,
} from "lucide-react";
import { toast } from "sonner";

type TabId = "info" | "ia" | "plan" | "evaluaciones" | "notas";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "info", label: "Información", icon: <FileText size={14} /> },
  { id: "ia", label: "IA / DEMUCA", icon: <Sparkles size={14} /> },
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
  const [subiendoGrabacion, setSubiendoGrabacion] = useState(false);
  const [grabacionAceptadaSesionId, setGrabacionAceptadaSesionId] = useState<
    string | null
  >(null);

  const { obtenerSesion, cargando, sesion } = useSesionDetalles();

  const grabacionEnviada =
    grabacionAceptadaSesionId === sesionId && sesion?.videoStatus !== "FALLO";
  const puedeSubirGrabacion =
    sesion?.sessionStatus === "COMPLETA" &&
    !sesion.videoUrl &&
    sesion.videoStatus !== "SUBIENDO" &&
    !grabacionEnviada;

  const videoSubido =
    Boolean(sesion?.videoUrl) || sesion?.videoStatus === "SUBIDO";
  const videoSubiendo =
    subiendoGrabacion ||
    sesion?.videoStatus === "SUBIENDO" ||
    (grabacionEnviada && !videoSubido);

  const subirGrabacion = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    event.target.value = "";
    if (!archivo || !sesionId || !sesion?.patient?.id) return;

    setSubiendoGrabacion(true);
    try {
      const response = await fetch("/api/upload/ingest", {
        method: "POST",
        headers: {
          "Content-Type": archivo.type || "video/mp4",
          "x-session-id": sesionId,
          "x-paciente-id": sesion.patient.id,
          "x-paciente-nombre": pacienteNombre,
          "x-numero-ciclo": String(sesion.cycleNumber ?? "sin-ciclo"),
          "x-grabado-en": String(sesion.sessionDate ?? new Date().toISOString()),
        },
        body: archivo,
      });
      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.message || "No se pudo subir la grabación.");
      }

      toast.success(
        "Grabación recibida. Se está guardando y quedará disponible para análisis.",
      );
      setGrabacionAceptadaSesionId(sesionId);
      await obtenerSesion({ variables: { id: sesionId } });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo subir la grabación.",
      );
    } finally {
      setSubiendoGrabacion(false);
    }
  };

  const [prevAbierto, setPrevAbierto] = useState(isOpen && !!sesionId);
  if ((isOpen && !!sesionId) !== prevAbierto) {
    setPrevAbierto(isOpen && !!sesionId);
    if (isOpen && sesionId) {
      setActiveTab("info");
      setEditandoNotas(false);
    }
  }

  useEffect(() => {
    if (isOpen && sesionId) {
      obtenerSesion({ variables: { id: sesionId } });
    }
  }, [isOpen, sesionId, obtenerSesion]);

  useEffect(() => {
    if (!isOpen || !sesionId || sesion?.videoStatus !== "SUBIENDO") {
      return;
    }

    const intervalId = window.setInterval(() => {
      void obtenerSesion({ variables: { id: sesionId } });
    }, 2000);

    return () => window.clearInterval(intervalId);
  }, [isOpen, sesionId, sesion?.videoStatus, obtenerSesion]);

  const notasSesion = sesion?.notes;
  const [prevNotas, setPrevNotas] = useState(notasSesion);
  if (notasSesion !== prevNotas) {
    setPrevNotas(notasSesion);
    if (notasSesion) {
      setNotasEditadas(
        Array.isArray(notasSesion) ? notasSesion.join("\n") : notasSesion,
      );
    }
  }

  const fechaFormateada = sesion?.sessionDate
    ? new Intl.DateTimeFormat("es-ES", {
        dateStyle: "full",
      }).format(new Date(String(sesion.sessionDate)))
    : "";
  const demucaEvaluation = sesion?.scaleEvaluations?.find(
    (evaluation) => evaluation?.scale?.name?.toLowerCase() === "escala demuca",
  );

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
                {puedeSubirGrabacion && (
                  <div className="rounded-2xl border border-[#008080]/20 bg-[#008080]/5 p-5">
                    <div className="flex items-start gap-3">
                      <Upload className="mt-0.5 text-[#008080]" size={18} />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold dark:text-white">
                          Subir grabación
                        </h4>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Esta sesión está completada y todavía no tiene video.
                        </p>
                        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#008080] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#006666]">
                          {subiendoGrabacion ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Upload size={14} />
                          )}
                          {subiendoGrabacion
                            ? "Subiendo..."
                            : "Seleccionar video"}
                          <input
                            type="file"
                            accept="video/*"
                            className="sr-only"
                            disabled={subiendoGrabacion}
                            onChange={subirGrabacion}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {sesion.sessionStatus === "COMPLETA" && !videoSubido && videoSubiendo && (
                  <EstadoVideo
                    icon={<Loader2 size={18} className="animate-spin" />}
                    label="Video en proceso de subida"
                    description="La grabación fue recibida y se está guardando. No cierres la sesión hasta que aparezca como subida."
                    tone="info"
                  />
                )}

                {sesion.sessionStatus === "COMPLETA" && videoSubido && (
                  <>
                    {sesion.videoUrl && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-1.5 rounded-full bg-[#008080]" />
                          <h4 className="text-xs font-bold uppercase tracking-[0.2em] dark:text-white">
                            Grabación
                          </h4>
                        </div>
                        <video
                          controls
                          preload="metadata"
                          className="aspect-video w-full rounded-xl bg-black shadow-lg"
                        >
                          <source src={sesion.videoUrl} type="video/mp4" />
                          Tu navegador no puede reproducir este video.
                        </video>
                      </div>
                    )}
                    <EstadoVideo
                      icon={<CheckCircle size={18} />}
                      label="Video subido"
                      description="La grabación está disponible para iniciar el análisis multimodal."
                      tone="success"
                    />
                    {sesion.videoUrl && (
                      <ProcessingStatusCard sessionId={sesion.id} />
                    )}
                  </>
                )}

                {sesion.sessionStatus === "COMPLETA" &&
                  sesion.videoStatus === "FALLO" && (
                    <EstadoVideo
                      icon={<AlertCircle size={18} />}
                      label="Falló la subida del video"
                      description="Podés seleccionar el video nuevamente para reintentar."
                      tone="danger"
                    />
                  )}

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

            {activeTab === "ia" && (
              <div className="space-y-6">
                {!sesion.videoUrl ? (
                  <EstadoVideo
                    icon={<AlertCircle size={18} />}
                    label="No hay grabación disponible"
                    description="Subí una grabación desde la pestaña Información para iniciar el análisis."
                    tone="info"
                  />
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-1.5 rounded-full bg-[#008080]" />
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] dark:text-white">
                          Grabación analizada
                        </h4>
                      </div>
                      <video
                        controls
                        preload="metadata"
                        className="aspect-video w-full rounded-xl bg-black shadow-lg"
                      >
                        <source src={sesion.videoUrl} type="video/mp4" />
                        Tu navegador no puede reproducir este video.
                      </video>
                    </div>
                    <ProcessingStatusCard sessionId={sesion.id} />
                  </>
                )}

                {demucaEvaluation ? (
                  <DemucaEditor
                    key={demucaEvaluation.id}
                    evaluation={demucaEvaluation}
                    onSaved={() => {
                      if (sesionId) {
                        void obtenerSesion({ variables: { id: sesionId } });
                      }
                    }}
                  />
                ) : (
                  <div className="rounded-2xl border border-gray-200 p-5 text-sm text-gray-500 dark:border-white/10">
                    La evaluación DEMUCA aparecerá aquí cuando el worker
                    termine y guarde sus respuestas en la sesión.
                  </div>
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

type DemucaEvaluation = {
  id: string;
  totalScore: number | null;
  subscaleResponses: Array<{
    score: number;
    subscale: {
      id: string;
      name: string;
      category: string | null;
      maxValue: number;
    };
  }>;
};

function DemucaEditor({
  evaluation,
  onSaved,
}: {
  evaluation: DemucaEvaluation;
  onSaved: () => void;
}) {
  const [editando, setEditando] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      evaluation.subscaleResponses.map((response) => [
        response.subscale.id,
        response.score,
      ]),
    ),
  );
  const [actualizarEvaluacion, { loading }] = useMutation<
    UpdateScaleEvaluationMutation,
    UpdateScaleEvaluationMutationVariables
  >(ACTUALIZAR_EVALUACION_ESCALA);

  const guardar = async () => {
    const result = await actualizarEvaluacion({
      variables: {
        evaluationId: evaluation.id,
        subscales: evaluation.subscaleResponses.map((response) => ({
          subscaleId: response.subscale.id,
          score: scores[response.subscale.id] ?? response.score,
        })),
      },
    });

    if (!result.data?.updateScaleEvaluation?.success) {
      toast.error(
        result.data?.updateScaleEvaluation?.message ||
          "No se pudo guardar la evaluación DEMUCA.",
      );
      return;
    }

    setEditando(false);
    toast.success("Evaluación DEMUCA actualizada.");
    onSaved();
  };

  const grouped = evaluation.subscaleResponses.reduce<
    Record<string, DemucaEvaluation["subscaleResponses"]>
  >((groups, response) => {
    const category = response.subscale.category || "General";
    groups[category] ??= [];
    groups[category].push(response);
    return groups;
  }, {});

  return (
    <section className="space-y-4 rounded-2xl border border-purple-200/60 bg-purple-50/40 p-5 dark:border-purple-400/20 dark:bg-purple-500/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-600 dark:text-purple-300">
            Evaluación DEMUCA guardada en la sesión
          </p>
          <p className="mt-1 text-lg font-bold dark:text-white">
            Puntaje total: {evaluation.totalScore ?? 0}
          </p>
        </div>
        {!editando ? (
          <button
            type="button"
            onClick={() => setEditando(true)}
            className="rounded-xl border border-purple-300 px-3 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100 dark:border-purple-400/30 dark:text-purple-200 dark:hover:bg-purple-500/10"
          >
            Editar evaluación
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEditando(false)}
              className="rounded-xl px-3 py-2 text-xs font-bold text-gray-500"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => void guardar()}
              disabled={loading}
              className="inline-flex items-center gap-1 rounded-xl bg-purple-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
            >
              <Save size={13} />
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-300">
        Estos valores son provisionales y requieren revisión del profesional.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(grouped).map(([category, responses]) => (
          <div
            key={category}
            className="rounded-xl border border-purple-200/60 bg-white/70 p-4 dark:border-purple-400/20 dark:bg-white/5"
          >
            <h4 className="mb-3 text-xs font-bold text-purple-700 dark:text-purple-200">
              {category}
            </h4>
            <div className="space-y-2">
              {responses.map((response) => {
                const id = response.subscale.id;
                return (
                  <label
                    key={id}
                    className="flex items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-300"
                  >
                    <span>{response.subscale.name}</span>
                    {editando ? (
                      <select
                        value={scores[id] ?? response.score}
                        onChange={(event) =>
                          setScores((current) => ({
                            ...current,
                            [id]: Number(event.target.value),
                          }))
                        }
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs dark:border-white/10 dark:bg-[#111] dark:text-white"
                      >
                        {Array.from(
                          { length: response.subscale.maxValue + 1 },
                          (_, value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ),
                        )}
                      </select>
                    ) : (
                      <span className="font-bold text-purple-700 dark:text-purple-200">
                        {response.score}/{response.subscale.maxValue}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EstadoVideo({
  icon,
  label,
  description,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  tone: "info" | "success" | "danger";
}) {
  const styles = {
    info: "border-blue-200 bg-blue-50/60 text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200",
    success:
      "border-green-200 bg-green-50/60 text-green-700 dark:border-green-400/20 dark:bg-green-500/10 dark:text-green-200",
    danger:
      "border-red-200 bg-red-50/60 text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200",
  };

  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-5 ${styles[tone]}`}>
      <div className="mt-0.5">{icon}</div>
      <div>
        <h4 className="text-sm font-bold">{label}</h4>
        <p className="mt-1 text-xs opacity-80">{description}</p>
      </div>
    </div>
  );
}
