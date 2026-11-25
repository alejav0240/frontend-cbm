"use client";

import React, { useEffect, useRef, useState } from "react";
import Modal from "@/shared/ui/components/Modal";
import { useSesionDetalles } from "@/entities/sesion";
import { ProcessingStatusCard } from "@/entities/analysis/ui/ProcessingStatusCard";
import { ACTUALIZAR_EVALUACION_ESCALA } from "@/entities/escalas/api/mutaciones";
import type {
  UpdateScaleEvaluationMutation,
  UpdateScaleEvaluationMutationVariables,
} from "@/shared/api/generated/graphql";
import {
  subirEnSegundoPlano,
  type GrabacionPendiente,
} from "@/features/sesion-en-progreso/model/colaSubida";
import {
  actualizarDemucaAnalisisMultimodal,
  consultarResultadoAnalisisMultimodal,
} from "@/shared/api/multimodal";
import {
  FileText,
  PenTool,
  Download,
  ClipboardList,
  BarChart3,
  CheckCircle,
  Circle,
  Video,
  Plus,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";
import {
  crearVentanaAnotacion,
  listarVentanasAnotacion,
  consultarArtefactosAnotacion,
  type AnnotationWindow,
} from "@/shared/lib/datasets/api";

type TabId = "info" | "plan" | "evaluaciones" | "anotaciones" | "notas";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "info", label: "Información", icon: <FileText size={14} /> },
  { id: "ia", label: "IA / DEMUCA", icon: <Sparkles size={14} /> },
  { id: "plan", label: "Plan", icon: <ClipboardList size={14} /> },
  { id: "evaluaciones", label: "Evaluaciones", icon: <BarChart3 size={14} /> },
  { id: "anotaciones", label: "Anotaciones", icon: <Video size={14} /> },
  { id: "notas", label: "Notas", icon: <PenTool size={14} /> },
];

const DEMUCA_FIELDS: Record<string, string[]> = {
  comportamientos_restrictivos: [
    "estereotipias", "agresividad", "desinteres", "pasividad", "aislamiento",
    "resistencia", "berrinche_crisis",
  ],
  exploracion_vocal: [
    "vocalizaciones", "balbuceos", "silabas_canonicas", "imitacion_de_canciones",
    "creacion_vocal", "comunicacion_verbal",
  ],
  interaccion_social_cognitiva: [
    "contacto_visual", "interaccion_con_otros_objetos", "interaccion_con_instrumentos_musicales",
    "interaccion_con_el_educador_musicoterapeuta", "interaccion_con_sus_padres",
    "interaccion_con_sus_pares", "atencion", "imitacion",
  ],
  movimiento_corporal: [
    "andar", "correr", "parar", "gesticular", "danzar", "movimiento_en_su_lugar", "saltar",
  ],
  exploracion_sonora: [
    "sonido_silencio", "timbre", "planos_de_altura", "movimiento_sonoro", "contrastes_de_intensidad",
  ],
  exploracion_ritmica: [
    "repeticion_de_ideas_ritmicas_melodicas", "sensacion_de_conclusion", "pulso_interno",
    "regulacion_temporal", "ritmo_real", "apoyo", "contrastes_de_tempo",
  ],
};

const DEMUCA_LABELS: Record<string, string> = {
  comportamientos_restrictivos: "Comportamientos restrictivos",
  exploracion_vocal: "Exploración vocal",
  interaccion_social_cognitiva: "Interacción social cognitiva",
  movimiento_corporal: "Movimiento corporal",
  exploracion_sonora: "Exploración sonora",
  exploracion_ritmica: "Exploración rítmica",
};

const formatDemucaLabel = (value: string) =>
  value.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase());

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
  const [analisis, setAnalisis] = useState<Record<string, unknown> | null>(null);
  const [cargandoAnalisis, setCargandoAnalisis] = useState(false);
  const [adjuntandoVideo, setAdjuntandoVideo] = useState(false);
  const [errorVideo, setErrorVideo] = useState<string | null>(null);
  const inputVideoRef = useRef<HTMLInputElement>(null);

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
      const duracionSegundos = await obtenerDuracionVideo(archivo);
      const response = await fetch("/api/upload/ingest", {
        method: "POST",
        headers: {
          "Content-Type": archivo.type || "video/mp4",
          "x-session-id": sesionId,
          "x-paciente-id": sesion.patient.id,
          "x-paciente-nombre": pacienteNombre,
          "x-numero-ciclo": String(sesion.cycleNumber ?? "sin-ciclo"),
          "x-grabado-en": String(sesion.sessionDate ?? new Date().toISOString()),
          ...(duracionSegundos
            ? { "x-duracion-segundos": String(duracionSegundos) }
            : {}),
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
      setActiveTab("ia");
      setEditandoNotas(false);
    }
  }

  useEffect(() => {
    if (isOpen && sesionId) {
      obtenerSesion({ variables: { id: sesionId } });
    }
  }, [isOpen, sesionId, obtenerSesion]);

  useEffect(() => {
    let activo = true;
    if (!isOpen || !sesionId) {
      return () => {
        activo = false;
      };
    }
    consultarResultadoAnalisisMultimodal(sesionId)
      .then((resultado) => {
        if (activo) setAnalisis(resultado);
      })
      .catch(() => {
        if (activo) setAnalisis(null);
      })
      .finally(() => {
        if (activo) setCargandoAnalisis(false);
      });
    return () => {
      activo = false;
    };
  }, [isOpen, sesionId]);

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

  const adjuntarVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    event.target.value = "";
    if (!archivo || !sesionId || !sesion) return;

    if (!archivo.type.startsWith("video/")) {
      setErrorVideo("Seleccioná un archivo de video válido.");
      return;
    }

    setAdjuntandoVideo(true);
    setErrorVideo(null);
    try {
      const grabacion: GrabacionPendiente = {
        sessionId: sesionId,
        archivo,
        pacienteId: "",
        pacienteNombre,
        numeroCiclo: sesion.cycleNumber,
        grabadoEn: new Date().toISOString(),
        addedAt: Date.now(),
      };
      const resultado = await subirEnSegundoPlano(grabacion);
      if (resultado !== "ok") {
        throw new Error("La subida quedó pendiente de reintento.");
      }

      await obtenerSesion({ variables: { id: sesionId } });
      toast.success("Video adjuntado. El procesamiento multimodal está en curso.");
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "No se pudo adjuntar el video.";
      setErrorVideo(mensaje);
      toast.error(mensaje);
    } finally {
      setAdjuntandoVideo(false);
    }
  };

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
                      <ProcessingStatusCard
                        sessionId={sesion.id}
                        sourceUri={sesion.videoUrl}
                      />
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

                <div className="rounded-2xl border border-dashed border-[#008080]/30 bg-[#008080]/5 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="text-sm font-bold dark:text-white">
                        Video de la sesión
                      </h4>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Adjuntá un video desde tu galería para guardarlo y procesarlo con ML.
                      </p>
                      {(sesion as typeof sesion & { videoStatus?: string | null }).videoStatus && (
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#008080]">
                          Estado: {(sesion as typeof sesion & { videoStatus?: string | null }).videoStatus}
                        </p>
                      )}
                      {errorVideo && (
                        <p className="mt-2 text-xs text-red-600">{errorVideo}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => inputVideoRef.current?.click()}
                      disabled={adjuntandoVideo || !sesionId}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#008080] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#006666] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Paperclip size={15} />
                      {adjuntandoVideo ? "Subiendo…" : "Adjuntar video"}
                    </button>
                    <input
                      ref={inputVideoRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.webm,.mov,.mkv"
                      className="hidden"
                      onChange={adjuntarVideo}
                    />
                  </div>
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

                <DemoAnalysisCard
                  analysis={analisis}
                  loading={cargandoAnalisis}
                  sessionId={sesionId}
                  onAnalysisUpdated={setAnalisis}
                />
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
                    <ProcessingStatusCard
                      sessionId={sesion.id}
                      sourceUri={sesion.videoUrl}
                    />
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

            {activeTab === "anotaciones" && (
              <AnnotationWorkspace
                sessionId={sesionId}
                analysis={analisis}
                videoUrl={
                  (sesion as typeof sesion & { videoUrl?: string | null })?.videoUrl
                }
              />
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

type TagGroup = "sonido" | "movimiento" | "interaccion";

const TAG_GROUPS: Record<TagGroup, { label: string; fields: string[] }> = {
  sonido: {
    label: "Sonido",
    fields: [...DEMUCA_FIELDS.exploracion_sonora, ...DEMUCA_FIELDS.exploracion_ritmica, ...DEMUCA_FIELDS.exploracion_vocal],
  },
  movimiento: { label: "Movimiento", fields: DEMUCA_FIELDS.movimiento_corporal },
  interaccion: {
    label: "Interacción",
    fields: [...DEMUCA_FIELDS.interaccion_social_cognitiva, ...DEMUCA_FIELDS.comportamientos_restrictivos],
  },
};

const formatSeconds = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.round(seconds));
  return `${Math.floor(safeSeconds / 60).toString().padStart(2, "0")}:${(safeSeconds % 60).toString().padStart(2, "0")}`;
};

const POSE_CONNECTIONS: Array<[number, number]> = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
  [11, 23], [12, 24], [23, 24], [23, 25], [25, 27], [27, 29], [29, 31],
  [24, 26], [26, 28], [28, 30], [30, 32], [23, 27], [24, 28],
];

type PoseLandmark = { x: number; y: number; visibility?: number };

function getPoseForTime(source: unknown, time: number): PoseLandmark[] {
  if (!source || typeof source !== "object") return [];
  const frames = (source as { frames?: unknown }).frames;
  if (!Array.isArray(frames) || frames.length === 0) return [];
  const frame = frames.reduce<Record<string, unknown> | null>((closest, candidate) => {
    if (!candidate || typeof candidate !== "object") return closest;
    if (!closest) return candidate as Record<string, unknown>;
    const candidateDistance = Math.abs(Number((candidate as { timestamp_seconds?: number }).timestamp_seconds ?? 0) - time);
    const closestDistance = Math.abs(Number((closest as { timestamp_seconds?: number }).timestamp_seconds ?? 0) - time);
    return candidateDistance < closestDistance ? candidate as Record<string, unknown> : closest;
  }, null);
  const poses = frame?.poses;
  const landmarks = Array.isArray(poses) && poses[0] && typeof poses[0] === "object" ? (poses[0] as { landmarks?: unknown }).landmarks : null;
  return Array.isArray(landmarks) ? landmarks.filter((point): point is PoseLandmark => Boolean(point && typeof point === "object" && "x" in point && "y" in point)) : [];
}

function AnnotationWorkspace({
  sessionId,
  analysis,
  videoUrl,
}: {
  sessionId: string | null;
  analysis: Record<string, unknown> | null;
  videoUrl?: string | null;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [phase, setPhase] = useState("exploracion_vocal");
  const [tags, setTags] = useState<Record<TagGroup, string[]>>({ sonido: [], movimiento: [], interaccion: [] });
  const [windows, setWindows] = useState<AnnotationWindow[]>([]);
  const [landmarks, setLandmarks] = useState<unknown>(null);
  const [loadingWindows, setLoadingWindows] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    listarVentanasAnotacion(sessionId)
      .then((result) => setWindows(result.windows || []))
      .catch(() => setWindows([]))
      .finally(() => setLoadingWindows(false));
    consultarArtefactosAnotacion(sessionId)
      .then((result) => setLandmarks(result.pose_landmarks))
      .catch(() => setLandmarks(null));
  }, [sessionId]);

  const setVideoTime = (value: number) => {
    const nextTime = Math.min(Math.max(value, 0), duration || value);
    setCurrentTime(nextTime);
    if (videoRef.current) videoRef.current.currentTime = nextTime;
  };

  const toggleTag = (group: TagGroup, field: string) => {
    setTags((current) => ({
      ...current,
      [group]: current[group].includes(field)
        ? current[group].filter((tag) => tag !== field)
        : [...current[group], field],
    }));
  };

  const saveWindow = async () => {
    if (!sessionId || endTime <= startTime) {
      setMessage("Define un inicio y un final válidos para la ventana.");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const modelPredictions = analysis?.model_predictions as Record<string, unknown> | undefined;
      const landmarkPayload = landmarks || modelPredictions?.landmarks || modelPredictions?.pose_landmarks || {};
      const created = await crearVentanaAnotacion(sessionId, {
        start_time: startTime,
        end_time: endTime,
        demuca_phase: phase,
        tags,
        landmarks: landmarkPayload,
        features: {},
      });
      setWindows((current) => [...current, created].sort((a, b) => a.start_time - b.start_time));
      setMessage("Ventana guardada en el dataset de la sesión.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar la ventana.");
    } finally {
      setSaving(false);
    }
  };

  const modelPredictions = analysis?.model_predictions as Record<string, unknown> | undefined;
  const landmarkSource = landmarks || modelPredictions?.landmarks || modelPredictions?.pose_landmarks;
  const landmarkCount = Array.isArray(landmarkSource)
    ? landmarkSource.length
    : landmarkSource && typeof landmarkSource === "object"
      ? Array.isArray((landmarkSource as { frames?: unknown }).frames)
        ? ((landmarkSource as { frames: unknown[] }).frames).length
        : Object.keys(landmarkSource).length
      : 0;

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const draw = () => {
      const width = video.clientWidth;
      const height = video.clientHeight;
      if (!width || !height) return;
      const scale = window.devicePixelRatio || 1;
      canvas.width = width * scale;
      canvas.height = height * scale;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.clearRect(0, 0, width, height);
      const pose = getPoseForTime(landmarkSource, currentTime);
      if (pose.length === 0) return;
      context.strokeStyle = "rgba(20, 184, 166, 0.9)";
      context.lineWidth = 2;
      POSE_CONNECTIONS.forEach(([from, to]) => {
        const start = pose[from];
        const end = pose[to];
        if (!start || !end) return;
        context.beginPath();
        context.moveTo(start.x * width, start.y * height);
        context.lineTo(end.x * width, end.y * height);
        context.stroke();
      });
      context.fillStyle = "rgba(251, 146, 60, 0.95)";
      pose.forEach((point) => {
        if (point.visibility !== undefined && point.visibility < 0.35) return;
        context.beginPath();
        context.arc(point.x * width, point.y * height, 3, 0, Math.PI * 2);
        context.fill();
      });
    };
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [currentTime, landmarkSource]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/2">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold dark:text-white">Espacio de anotación</h4>
            <p className="text-xs text-gray-500">Marca ventanas para construir el dataset progresivamente.</p>
          </div>
          <span className="text-xs font-bold text-[#008080]">{formatSeconds(currentTime)} / {formatSeconds(duration)}</span>
        </div>
        {videoUrl ? (
          <div className="relative overflow-hidden rounded-xl bg-black">
            <video
              ref={videoRef}
              controls
              className="block w-full"
              onLoadedMetadata={(event) => {
                const nextDuration = Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0;
                setDuration(nextDuration);
                setEndTime(nextDuration);
              }}
              onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
            >
              <source src={videoUrl} />
              Tu navegador no puede reproducir este video.
            </video>
            <canvas ref={canvasRef} aria-label="Landmarks corporales sobre el video" className="pointer-events-none absolute left-0 top-0" />
          </div>
        ) : (
          <div className="rounded-xl bg-black/5 px-4 py-10 text-center text-sm text-gray-500 dark:bg-white/5">Esta sesión no tiene un video disponible.</div>
        )}
        <input aria-label="Línea de tiempo del video" type="range" min="0" max={duration || 1} step="0.1" value={Math.min(currentTime, duration || 1)} onChange={(event) => setVideoTime(Number(event.target.value))} className="mt-4 w-full accent-[#008080]" />
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button type="button" onClick={() => setStartTime(currentTime)} className="rounded-lg border border-[#008080]/20 px-3 py-2 text-xs font-bold text-[#008080]">Marcar inicio</button>
          <button type="button" onClick={() => setEndTime(currentTime)} className="rounded-lg border border-[#008080]/20 px-3 py-2 text-xs font-bold text-[#008080]">Marcar final</button>
          <span className="rounded-lg bg-white px-3 py-2 text-center text-xs dark:bg-[#111]">Inicio {formatSeconds(startTime)}</span>
          <span className="rounded-lg bg-white px-3 py-2 text-center text-xs dark:bg-[#111]">Final {formatSeconds(endTime)}</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4 rounded-2xl border border-gray-100 p-4 dark:border-white/5">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Fase DEMUCA
            <select value={phase} onChange={(event) => setPhase(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#111]">
              {Object.entries(DEMUCA_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          {Object.entries(TAG_GROUPS).map(([group, config]) => (
            <fieldset key={group}>
              <legend className="mb-2 text-xs font-bold text-gray-700 dark:text-gray-200">{config.label}</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {config.fields.map((field) => <label key={field} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><input type="checkbox" checked={tags[group as TagGroup].includes(field)} onChange={() => toggleTag(group as TagGroup, field)} className="accent-[#008080]" />{formatDemucaLabel(field)}</label>)}
              </div>
            </fieldset>
          ))}
          <button type="button" onClick={saveWindow} disabled={saving || !sessionId} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#008080] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white disabled:opacity-50"><Plus size={14} />{saving ? "Guardando…" : "Guardar ventana"}</button>
          {message && <p className="text-xs text-gray-600 dark:text-gray-300">{message}</p>}
        </div>

        <div className="space-y-4 rounded-2xl border border-gray-100 p-4 dark:border-white/5">
          <div className="flex items-center justify-between"><h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Landmarks del cuerpo</h4><span className="text-xs text-gray-500">{landmarkCount} frames</span></div>
          {landmarkCount > 0 ? <p className="text-sm text-gray-600 dark:text-gray-300">MediaPipe entregó landmarks temporales. El esqueleto se superpone al video y se guarda junto a cada ventana anotada.</p> : <p className="text-sm text-gray-500">El resultado multimodal todavía no incluye landmarks para esta sesión.</p>}
          <div className="border-t border-gray-100 pt-4 dark:border-white/5"><h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Ventanas guardadas</h4>{loadingWindows ? <p className="text-sm text-gray-500">Cargando ventanas…</p> : windows.length > 0 ? <div className="space-y-2">{windows.map((window) => <button type="button" key={window.id} onClick={() => setVideoTime(window.start_time)} className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-left text-xs dark:bg-white/5"><span className="font-bold text-[#008080]">{formatSeconds(window.start_time)}–{formatSeconds(window.end_time)}</span><span className="truncate pl-3 text-gray-500">{formatDemucaLabel(window.demuca_phase)}</span></button>)}</div> : <p className="text-sm text-gray-500">Aún no hay ventanas anotadas.</p>}</div>
        </div>
      </div>
    </div>
  );
}

function DemoAnalysisCard({
  analysis,
  loading,
  sessionId,
  onAnalysisUpdated,
}: {
  analysis: Record<string, unknown> | null;
  loading: boolean;
  sessionId: string | null;
  onAnalysisUpdated: (analysis: Record<string, unknown>) => void;
}) {
  const predictions = analysis?.model_predictions as Record<string, unknown> | undefined;
  const windows = Array.isArray(predictions?.windows) ? predictions.windows : [];
  const demuca = analysis?.demuca as Record<string, unknown> | undefined;
  const demucaData = (demuca?.data || {}) as Record<string, Record<string, number>>;
  const [draft, setDraft] = useState<Record<string, Record<string, number>>>(demucaData);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const status = typeof analysis?.status === "string" ? analysis.status : "pending";

  const draftValues = Object.keys(draft).length > 0 ? draft : demucaData;

  const updateValue = (category: string, field: string, value: string) => {
    const numericValue = Number(value);
    setDraft((current) => ({
      ...current,
      [category]: {
        ...(current[category] || {}),
        [field]: Number.isFinite(numericValue) && numericValue >= 0 ? numericValue : 0,
      },
    }));
  };

  const saveDemuca = async () => {
    if (!sessionId) return;
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await actualizarDemucaAnalisisMultimodal(sessionId, draftValues);
      onAnalysisUpdated(updated);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "No se pudo guardar el DEMUCA.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#008080]/5 p-5 rounded-2xl border border-[#008080]/20">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h4 className="text-[10px] font-bold text-[#008080] uppercase tracking-widest">
          Análisis multimodal demo
        </h4>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          {loading ? "Consultando" : status}
        </span>
      </div>
      {loading && <p className="text-sm text-gray-500">Procesando resultado…</p>}
      {!loading && !analysis && (
        <p className="text-sm text-gray-500">Todavía no hay un resultado disponible.</p>
      )}
      {!loading && analysis && (
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <p>Modelo: <strong>{String(predictions?.model_type || "no disponible")}</strong></p>
          <p>Ventanas con predicción: <strong>{windows.length}</strong></p>
          <p>DEMUCA: <strong>{String(demuca?.status || "provisional")}</strong></p>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            Resultado demo basado en videos reales, sin validación terapéutica. Requiere revisión humana.
          </p>
          {demucaData && Object.keys(DEMUCA_FIELDS).length > 0 && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h5 className="text-xs font-bold uppercase tracking-widest text-[#008080]">
                  Revisión del terapeuta
                </h5>
                <span className="text-[10px] text-gray-500">Valores editables</span>
              </div>
              {Object.entries(DEMUCA_FIELDS).map(([category, fields]) => (
                <fieldset key={category} className="rounded-xl border border-[#008080]/15 bg-white/60 p-3 dark:bg-black/10">
                  <legend className="px-1 text-xs font-bold text-gray-700 dark:text-gray-200">
                    {DEMUCA_LABELS[category]}
                  </legend>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {fields.map((field) => (
                      <label key={field} className="flex items-center justify-between gap-2 text-xs">
                        <span>{formatDemucaLabel(field)}</span>
                        <input
                          aria-label={field}
                          type="number"
                          min="0"
                          step="1"
                          value={draftValues[category]?.[field] ?? 0}
                          onChange={(event) => updateValue(category, field, event.target.value)}
                          className="w-20 rounded-lg border border-gray-200 bg-white px-2 py-1 text-right text-sm dark:border-white/10 dark:bg-[#111]"
                        />
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
              {saveError && <p className="text-xs text-red-600">{saveError}</p>}
              <button
                type="button"
                onClick={saveDemuca}
                disabled={saving || !sessionId}
                className="rounded-lg bg-[#008080] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Guardando…" : "Guardar revisión DEMUCA"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
