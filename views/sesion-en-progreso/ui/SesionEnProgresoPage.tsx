"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  useTemporizador,
  useGrabacion,
  VistaCamara,
  WorkspaceSesion,
} from "@/features/sesion-en-progreso";
import { useSesionActivaStore, ACTUALIZAR_SESION } from "@/entities/sesion";
import {
  usePlanesTratamiento,
  useAgregarPasosSesion,
} from "@/entities/plan-tratamiento";
import {
  useRecursosDigitales,
  useAgregarRecursosSesion,
} from "@/entities/recurso";
import { useEscalas, useAgregarEscalaSesion } from "@/entities/escalas";
import {
  useFormularios,
  useAssignForm,
  useSubmitFullForm,
} from "@/entities/formulario";
import {
  useInventario,
  useAgregarInventarioSesion,
} from "@/entities/inventario";
import { useAuthStore } from "@/shared/model/useAuthStore";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Video,
  Mic,
  Square,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import { toast } from "sonner";
import { motion } from "motion/react";
import { useSesionConfigStore } from "@/shared/model/useSesionConfigStore";
import { alertarFinSesion } from "@/shared/lib/utils/alarmaDuracion";
import { useMutation } from "@apollo/client/react";
import { SessionHeader } from "@/views/sesion-en-progreso/ui/components/SessionHeader";
import type {
  MappedResource,
  MappedScale,
  MappedSubscale,
  MappedScaleValue,
  MappedFormTemplate,
  MappedFormField,
} from "@/views/sesion-en-progreso/model/tipos";

const QUESTION_TYPE_MAP: Record<string, string> = {
  TEXT: "text",
  TEXT_LONG: "textarea",
  NUMBER: "number",
  BOOLEAN: "checkbox",
  MULTIPLE_CHOICE: "text",
  SCALE: "number",
  DATE: "text",
};

const normalizarTipoCampo = (tipo: string): string => {
  return QUESTION_TYPE_MAP[tipo] ?? "text";
};

const MAPA_TIPO_ESCALA: Record<string, string> = {
  SUBSCALE: "subscales",
  VALUE_LIST: "values",
};

type TabId = "plan" | "notas" | "recursos" | "escalas";

type UploadResponse = {
  success: boolean;
  url?: string;
  storage?: "r2" | "local";
  message?: string;
};

type PasoGuardadoId =
  | "detener-grabacion"
  | "preparar-video"
  | "subir-video"
  | "guardar-datos"
  | "completar";

type EstadoPasoGuardado = "pending" | "loading" | "completed" | "error";

const PASOS_GUARDADO: Array<{ id: PasoGuardadoId; label: string }> = [
  { id: "detener-grabacion", label: "Deteniendo grabación" },
  { id: "preparar-video", label: "Preparando video" },
  { id: "subir-video", label: "Subiendo video" },
  { id: "guardar-datos", label: "Guardando datos clínicos" },
  { id: "completar", label: "Sesión completada" },
];

const crearEstadoGuardadoInicial = () =>
  PASOS_GUARDADO.reduce(
    (estado, paso) => ({ ...estado, [paso.id]: "pending" }),
    {} as Record<PasoGuardadoId, EstadoPasoGuardado>,
  );

export const SesionEnProgresoPage = () => {
  const router = useRouter();
  const { sesion, limpiarSesion } = useSesionActivaStore();
  const [isActive, setIsActive] = useState(true);
  const { segundos, formatearTiempo } = useTemporizador(
    !!sesion && isActive,
    sesion?.inicio ? new Date(sesion.inicio) : undefined,
  );
  const grabacion = useGrabacion();

  const [notas, setNotas] = useState("");
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [selectedScales, setSelectedScales] = useState<string[]>([]);
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [formResponses, setFormResponses] = useState<Record<string, any>>({});
  const [tabActiva, setTabActiva] = useState<TabId>("plan");
  const [camaraAbierta, setCamaraAbierta] = useState(true);
  const [mobileCameraOpen, setMobileCameraOpen] = useState(true);
  const alertaEnviadaRef = useRef(false);
  const [estadoGuardado, setEstadoGuardado] = useState<
    Record<PasoGuardadoId, EstadoPasoGuardado>
  >(crearEstadoGuardadoInicial);
  const [subidaTimer, setSubidaTimer] = useState(0);
  const [detallesPasos, setDetallesPasos] = useState<
    Record<PasoGuardadoId, string>
  >({
    "detener-grabacion": "",
    "preparar-video": "",
    "subir-video": "",
    "guardar-datos": "",
    completar: "",
  });
  const subidaIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const actualizarDetallePaso = useCallback(
    (id: PasoGuardadoId, detalle: string) => {
      setDetallesPasos((prev) => ({ ...prev, [id]: detalle }));
    },
    [],
  );

  useEffect(() => {
    if (estadoGuardado["subir-video"] === "loading") {
      subidaIntervalRef.current = setInterval(() => {
        setSubidaTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (subidaIntervalRef.current) {
        clearInterval(subidaIntervalRef.current);
        subidaIntervalRef.current = null;
      }
    }
    return () => {
      if (subidaIntervalRef.current) {
        clearInterval(subidaIntervalRef.current);
      }
    };
  }, [estadoGuardado]);

  const duracionSesion = useSesionConfigStore((s) => s.duracionSesion);
  const { usuario } = useAuthStore();
  const [actualizarSesion] = useMutation(ACTUALIZAR_SESION);

  const { agregarPasosSesion } = useAgregarPasosSesion();
  const { agregarRecursosSesion } = useAgregarRecursosSesion();
  const { agregarInventarioSesion } = useAgregarInventarioSesion();
  const { agregarEscalaSesion } = useAgregarEscalaSesion();
  const { assignForm } = useAssignForm();
  const { submitFullForm } = useSubmitFullForm();

  const [finalizando, setFinalizando] = useState(false);

  const actualizarPasoGuardado = useCallback(
    (id: PasoGuardadoId, estado: EstadoPasoGuardado) => {
      setEstadoGuardado((prev) => ({ ...prev, [id]: estado }));
    },
    [],
  );

  const {
    planes,
    cargando: planesLoading,
    error: planesError,
    refetch: refetchPlanes,
  } = usePlanesTratamiento({
    pagina: 1,
    pageSize: 1,
    pacienteId: sesion?.pacienteId,
  });

  const {
    recursos: recursosRaw,
    cargando: recursosLoading,
    error: recursosError,
    refetch: refetchRecursos,
  } = useRecursosDigitales({
    pagina: 1,
    pageSize: 100,
  });

  const {
    articulos: articulosRaw,
    cargando: inventarioLoading,
    error: inventarioError,
    refetch: refetchInventario,
  } = useInventario();

  const {
    escalas: escalasRaw,
    cargando: escalasLoading,
    error: escalasError,
    refetch: refetchEscalas,
  } = useEscalas();

  const {
    formularios: formulariosRaw,
    cargando: formulariosLoading,
    error: formulariosError,
    refetch: refetchFormularios,
  } = useFormularios();

  const planActivo = useMemo(() => planes[0] || null, [planes]);

  const patientPlan = useMemo(() => {
    if (!planActivo) return null;
    return {
      mainObjective: planActivo.objetivoPrincipal,
      progressPercent: planActivo.porcentajeProgreso,
      steps: (planActivo.pasos || []).map((paso: any) => ({
        id: paso.id,
        moment: paso.momento,
        objective: paso.objetivo,
        focus: paso.enfoque,
        musicalResources: paso.recursosMusicales,
        musicalEmphasis: paso.enfasisMusical,
        mltMethod: paso.metodoMlt,
        durationMinutes: paso.duracionMinutos,
      })),
    };
  }, [planActivo]);

  const totalSteps = patientPlan?.steps?.length ?? 0;

  const recursos = useMemo((): MappedResource[] => {
    const digitales: MappedResource[] = (recursosRaw || []).map((r: any) => ({
      id: `digital-${r.id}`,
      title: r.titulo,
      type: r.tipo,
      category: r.categoria,
    }));
    const inventario: MappedResource[] = (articulosRaw || []).map((a: any) => ({
      id: `inv-${a.id}`,
      title: a.nombre,
      type: a.tipo,
      category: a.aula,
    }));
    return [...digitales, ...inventario];
  }, [recursosRaw, articulosRaw]);

  const evaluationScales = useMemo((): MappedScale[] => {
    return (escalasRaw || []).map((s: any) => ({
      id: s.id,
      name: s.nombre,
      description: s.descripcion,
      type: MAPA_TIPO_ESCALA[s.tipoEscala] ?? s.tipoEscala,
      subscales: (s.subescalas || []).map(
        (sub: any): MappedSubscale => ({
          id: sub.id,
          name: sub.nombre,
          maxScore: sub.valorMaximo,
        }),
      ),
      values: (s.valores || []).map(
        (v: any): MappedScaleValue => ({
          id: v.id,
          label: v.etiqueta,
          value: v.valor,
        }),
      ),
    }));
  }, [escalasRaw]);

  const formTemplates = useMemo((): MappedFormTemplate[] => {
    return (formulariosRaw || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      description: f.description,
      fields: (f.questions || []).map(
        (q: any): MappedFormField => ({
          id: q.id,
          label: q.question,
          type: normalizarTipoCampo(q.questionType),
          required: q.isRequired,
        }),
      ),
    }));
  }, [formulariosRaw]);

  const cargandoInicial =
    planesLoading ||
    recursosLoading ||
    escalasLoading ||
    formulariosLoading ||
    inventarioLoading;
  const errorGeneral =
    planesError ||
    recursosError ||
    escalasError ||
    formulariosError ||
    inventarioError;

  const toggleStep = useCallback((id: string) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }, []);

  const toggleResource = useCallback((id: string) => {
    setSelectedResources((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  }, []);

  const toggleScale = useCallback((id: string) => {
    setSelectedScales((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }, []);

  const toggleForm = useCallback((id: string) => {
    setSelectedForms((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }, []);

  const updateForm = useCallback((key: string, value: any) => {
    setFormResponses((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleRecording = useCallback(() => {
    if (grabacion.estaGrabando) {
      void grabacion.detenerGrabacion();
    } else {
      void grabacion.iniciarGrabacion();
    }
  }, [grabacion]);

  const reintentar = useCallback(() => {
    refetchPlanes();
    refetchRecursos();
    refetchInventario();
    refetchEscalas();
    refetchFormularios();
  }, [
    refetchPlanes,
    refetchRecursos,
    refetchInventario,
    refetchEscalas,
    refetchFormularios,
  ]);

  const subirGrabacion = useCallback(
    async (archivo: File | null): Promise<UploadResponse | null> => {
      if (!archivo || !sesion) return null;

      const formData = new FormData();
      formData.append("file", archivo);
      formData.append("pacienteId", sesion.pacienteId);
      formData.append("pacienteNombre", sesion.pacienteNombre);
      formData.append("sessionId", sesion.id);
      formData.append("numeroCiclo", "sin-ciclo");
      formData.append("grabadoEn", new Date().toISOString());

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as UploadResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || "No se pudo guardar la grabación");
      }

      return data;
    },
    [sesion],
  );

  const handleFinalizar = async () => {
    if (finalizando || !sesion) return;
    setFinalizando(true);
    setShowFinishModal(false);
    setEstadoGuardado(crearEstadoGuardadoInicial());
    setDetallesPasos({
      "detener-grabacion": "",
      "preparar-video": "",
      "subir-video": "",
      "guardar-datos": "",
      completar: "",
    });
    setSubidaTimer(0);

    const sessionId = sesion.id;
    const pacienteId = sesion.pacienteId;
    const evaluatorId = usuario?.id;

    if (!evaluatorId) {
      toast.error("No se encontró el usuario autenticado");
      setFinalizando(false);
      return;
    }

    const errores: string[] = [];
    let videoUrl: string | null = null;
    let almacenamientoVideo: UploadResponse["storage"] | null = null;

    try {
      actualizarPasoGuardado("detener-grabacion", "loading");
      const archivo = await grabacion.detenerGrabacion();
      actualizarPasoGuardado("detener-grabacion", "completed");

      actualizarPasoGuardado("preparar-video", "loading");
      await new Promise((resolve) => setTimeout(resolve, 500));
      actualizarPasoGuardado("preparar-video", "completed");

      actualizarPasoGuardado("subir-video", "loading");

      let resultadoSubida: UploadResponse | null = null;
      if (archivo) {
        resultadoSubida = await subirGrabacion(archivo);
        videoUrl = resultadoSubida?.url ?? null;
        almacenamientoVideo = resultadoSubida?.storage ?? null;
      }

      if (almacenamientoVideo === "local") {
        actualizarDetallePaso(
          "subir-video",
          "No se pudo subir a Cloudflare R2, se utilizará almacenamiento local como respaldo.",
        );
      }

      actualizarPasoGuardado("subir-video", "completed");
    } catch {
      actualizarPasoGuardado("subir-video", "error");
      actualizarDetallePaso(
        "subir-video",
        "No se pudo subir a Cloudflare R2, se utilizará almacenamiento local como respaldo.",
      );
      errores.push("grabación de video");
    }

    actualizarPasoGuardado("guardar-datos", "loading");

    // 1. Pasos completados
    if (completedSteps.length > 0) {
      try {
        await agregarPasosSesion({ planStepIds: completedSteps, sessionId });
      } catch {
        errores.push("pasos");
      }
    }

    // 2. Recursos digitales
    const digitalIds = selectedResources
      .filter((id) => id.startsWith("digital-"))
      .map((id) => id.replace(/^digital-/, ""));
    if (digitalIds.length > 0) {
      try {
        await agregarRecursosSesion({ resourceIds: digitalIds, sessionId });
      } catch {
        errores.push("recursos digitales");
      }
    }

    // 3. Inventario
    const invIds = selectedResources
      .filter((id) => id.startsWith("inv-"))
      .map((id) => id.replace(/^inv-/, ""));
    if (invIds.length > 0) {
      try {
        await agregarInventarioSesion({ itemIds: invIds, sessionId });
      } catch {
        errores.push("inventario");
      }
    }

    // 4. Escalas
    for (const scaleId of selectedScales) {
      try {
        const subscales = Object.entries(formResponses)
          .filter(([k]) => k.startsWith(`scale_${scaleId}_sub_`))
          .map(([k, v]) => ({
            subscaleId: k.replace(`scale_${scaleId}_sub_`, ""),
            score: v as number,
          }));

        const valueKey = `scale_${scaleId}_value`;
        const valueId = formResponses[valueKey]
          ? String(formResponses[valueKey])
          : null;

        await agregarEscalaSesion({
          patientId: pacienteId,
          evaluatorId,
          scaleId,
          sessionId,
          subscales: subscales.length > 0 ? subscales : null,
          valueId,
        });
      } catch {
        errores.push(`escala ${scaleId}`);
      }
    }

    // 5. Formularios
    for (const formId of selectedForms) {
      try {
        const { data: assignData } = await assignForm({
          formId,
          assignedToId: null,
          assignedById: evaluatorId,
          patientId: pacienteId,
          sessionId,
        });

        const assignmentId = (assignData as any)?.assignForm?.assignment?.id;
        if (assignmentId) {
          const responses = Object.entries(formResponses)
            .filter(([k]) => k.startsWith(`form_${formId}_field_`))
            .map(([k, v]) => ({
              questionId: k.replace(`form_${formId}_field_`, ""),
              responseText: String(v),
            }));

          if (responses.length > 0) {
            await submitFullForm({ assignmentId, responses });
          }
        }
      } catch {
        errores.push(`formulario ${formId}`);
      }
    }

    // 6. Actualizar sesión
    try {
      await actualizarSesion({
        variables: {
          id: sessionId,
          notes: notas || null,
          durationMinutes: Math.floor(segundos / 60),
          sessionStatus: "completa",
          videoUrl,
        },
      });
    } catch {
      errores.push("actualización de sesión");
    }

    const guardarDatosExitoso =
      !errores.includes("actualización de sesión") &&
      errores.filter((e) => e !== "grabación de video").length === 0;

    actualizarPasoGuardado(
      "guardar-datos",
      guardarDatosExitoso ? "completed" : "error",
    );
    if (!guardarDatosExitoso) {
      actualizarDetallePaso(
        "guardar-datos",
        `Errores en: ${errores.filter((e) => e !== "grabación de video").join(", ")}`,
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    actualizarPasoGuardado(
      "completar",
      errores.length === 0
        ? "completed"
        : errores.length === 1 &&
            errores[0] === "grabación de video" &&
            almacenamientoVideo === "local"
          ? "completed"
          : "error",
    );

    // 7. Cleanup
    limpiarSesion();

    if (errores.length === 0) {
      toast.success("Sesión guardada exitosamente");
      if (almacenamientoVideo === "r2") {
        toast.success("Video subido a Cloudflare R2");
      }
      if (almacenamientoVideo === "local") {
        toast.warning(
          "Cloudflare R2 no estuvo disponible. Video guardado localmente",
        );
      }
    } else if (
      errores.length === 1 &&
      errores[0] === "grabación de video" &&
      almacenamientoVideo === "local"
    ) {
      toast.success("Sesión guardada exitosamente");
      toast.warning(
        "Cloudflare R2 no estuvo disponible. Video guardado localmente",
      );
    } else {
      toast.warning(`Sesión guardada con errores en: ${errores.join(", ")}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setFinalizando(false);
    router.push("/dashboard/sesiones");
  };

  const insertarMarcaTiempo = useCallback(() => {
    setNotas((prev) => prev + `[${formatearTiempo(segundos)}] `);
  }, [segundos, formatearTiempo]);

  const marcarPasoAnterior = useCallback(() => {
    if (!patientPlan?.steps?.length) return;
    const step = patientPlan.steps[completedSteps.length];
    if (step) toggleStep(step.id);
  }, [patientPlan, completedSteps, toggleStep]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (finalizando) return;
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT";

      // Alt+1-4: Switch tabs (works everywhere)
      if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const map: Record<string, TabId> = {
          "1": "plan",
          "2": "notas",
          "3": "recursos",
          "4": "escalas",
        };
        const tab = map[e.key];
        if (tab) {
          e.preventDefault();
          setTabActiva(tab);
          return;
        }
      }

      // Ctrl+Shift+ shortcuts
      if (e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "t":
            e.preventDefault();
            insertarMarcaTiempo();
            return;
          case "e":
            e.preventDefault();
            marcarPasoAnterior();
            return;
          case "f":
            e.preventDefault();
            setShowFinishModal(true);
            return;
        }
      }

      // 1-4 on non-input elements
      if (!isInput && !e.altKey && !e.ctrlKey && !e.metaKey) {
        const mapNum: Record<string, TabId> = {
          "1": "plan",
          "2": "notas",
          "3": "recursos",
          "4": "escalas",
        };
        const tab = mapNum[e.key];
        if (tab) {
          e.preventDefault();
          setTabActiva(tab);
          return;
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [insertarMarcaTiempo, marcarPasoAnterior, finalizando]);

  // Notificación al acercarse al fin de la sesión
  const tiempoRestante = duracionSesion * 60 - segundos;

  useEffect(() => {
    if (
      !alertaEnviadaRef.current &&
      duracionSesion > 0 &&
      tiempoRestante <= 120 &&
      tiempoRestante > 0
    ) {
      alertaEnviadaRef.current = true;
      alertarFinSesion();
    }
  }, [tiempoRestante, duracionSesion]);

  const formatearTemporizadorSubida = (segundosTotales: number) => {
    const mins = Math.floor(segundosTotales / 60);
    const secs = segundosTotales % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (finalizando) {
    return (
      <div className="fixed inset-0 z-[120] bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
        {/* Glow effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {/* Animated top border line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600" />

          <div className="mb-6 flex flex-col items-center text-center">
            <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 text-[#008080]">
              <Loader2 size={36} className="animate-spin" />
              <div className="absolute inset-0 rounded-2xl border-2 border-teal-500/20 animate-ping opacity-30 pointer-events-none" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Guardando sesión
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Estamos procesando la información de la sesión. No cierres esta
              ventana hasta completar el proceso.
            </p>
          </div>

          {/* WARNING BANNER */}
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-amber-800 dark:text-amber-400">
            <AlertCircle
              size={18}
              className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-500"
            />
            <p className="text-xs font-semibold leading-relaxed">
              No cierres esta ventana mientras guardamos la sesión.
            </p>
          </div>

          {/* STEP LIST */}
          <div className="space-y-3">
            {PASOS_GUARDADO.map((paso) => {
              const estado = estadoGuardado[paso.id];
              const pending = estado === "pending";
              const loading = estado === "loading";
              const completed = estado === "completed";
              const error = estado === "error";

              return (
                <div
                  key={paso.id}
                  className={`flex items-start gap-4 rounded-2xl px-4 py-3.5 border transition-all duration-300 ${
                    loading
                      ? "bg-teal-500/5 border-teal-500/20 shadow-sm"
                      : error
                        ? "bg-red-500/5 border-red-500/20"
                        : "bg-slate-50/50 dark:bg-zinc-900/50 border-slate-100 dark:border-zinc-800/60"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {completed ? (
                      <CheckCircle2
                        size={20}
                        className="text-emerald-500 dark:text-emerald-400"
                      />
                    ) : error ? (
                      <AlertCircle
                        size={20}
                        className="text-red-500 dark:text-red-400"
                      />
                    ) : loading ? (
                      <Loader2
                        size={19}
                        className="animate-spin text-[#008080]"
                      />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-zinc-700" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-bold leading-normal transition-colors duration-200 ${
                        loading
                          ? "text-[#008080] dark:text-teal-400"
                          : error
                            ? "text-red-500 dark:text-red-400"
                            : pending
                              ? "text-slate-400 dark:text-zinc-500"
                              : "text-slate-700 dark:text-zinc-300"
                      }`}
                    >
                      {paso.id === "subir-video" && loading ? (
                        <span className="flex items-center gap-2 flex-wrap">
                          <span>Subiendo video</span>
                          <span className="font-mono text-[10px] font-extrabold bg-teal-500/10 dark:bg-teal-400/10 text-[#008080] dark:text-teal-400 px-2 py-0.5 rounded-full">
                            {formatearTemporizadorSubida(subidaTimer)}
                          </span>
                        </span>
                      ) : (
                        paso.label
                      )}
                    </p>

                    {detallesPasos[paso.id] && (
                      <p
                        className={`mt-1 text-xs leading-normal font-medium transition-opacity ${
                          error
                            ? "text-red-500 dark:text-red-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {detallesPasos[paso.id]}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (!sesion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold dark:text-white mb-2">
          No hay sesión activa
        </h2>
        <p className="text-gray-400 max-w-md mb-8">
          Inicia una sesión desde el listado de sesiones o la ficha del
          paciente.
        </p>
        <button
          onClick={() => router.push("/dashboard/sesiones")}
          className="px-8 py-3 bg-[#008080] text-white rounded-2xl font-bold"
        >
          Ir a Sesiones
        </button>
      </div>
    );
  }

  const activeSession = {
    patientName: sesion.pacienteNombre,
    sessionNum: 1,
    therapist: "",
    sessionType: "",
  };

  const cameraSummary = (
    <div className="flex flex-col items-center gap-3 py-6">
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center ${grabacion.estaGrabando ? "bg-red-500/10 text-red-500" : "bg-gray-100 dark:bg-white/5 text-gray-400"}`}
      >
        {grabacion.estaGrabando ? <Mic size={20} /> : <Video size={20} />}
      </div>
      <div className="text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Sesión
        </p>
        <p className="text-lg font-mono font-bold dark:text-white tabular-nums">
          {formatearTiempo(segundos)}
        </p>
        {duracionSesion > 0 && tiempoRestante <= 300 && tiempoRestante > 0 && (
          <p
            className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${
              tiempoRestante <= 120 ? "text-red-500" : "text-amber-500"
            }`}
          >
            {tiempoRestante <= 60
              ? `${tiempoRestante}s`
              : `Faltan ${Math.ceil(tiempoRestante / 60)} min`}
          </p>
        )}
      </div>
      {grabacion.estaGrabando && (
        <div className="flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-full">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">
            REC
          </span>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-[#f8fafc] dark:bg-[#050505] flex flex-col"
    >
      <SessionHeader
        activeSession={activeSession}
        timer={segundos}
        isActive={isActive}
        setIsActive={setIsActive}
        isRecording={grabacion.estaGrabando}
        toggleRecording={toggleRecording}
        setShowFinishConfirm={setShowFinishModal}
        formatTime={formatearTiempo}
        duracionSesion={duracionSesion}
        tiempoRestante={tiempoRestante}
      />

      {cargandoInicial && (
        <div className="h-1 bg-gray-200 dark:bg-white/5">
          <motion.div
            className="h-full bg-[#008080]"
            animate={{ width: ["0%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      )}

      {errorGeneral && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border-b border-red-500/20">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <p className="text-xs font-medium text-red-600 dark:text-red-400 flex-1">
            Error al cargar datos.{" "}
            <button
              onClick={reintentar}
              className="underline font-bold hover:no-underline"
            >
              Reintentar
            </button>
          </p>
        </div>
      )}

      <main
        className="
        flex-1
        min-h-0
        flex
        flex-col
        lg:flex-row
        overflow-hidden
    "
      >
        <motion.section
          initial={false}
          animate={{
            width: {
              lg: camaraAbierta ? "50%" : "56px",
            } as any,
          }}
          className="
        relative
        border-b lg:border-b-0 lg:border-r
        border-gray-200 dark:border-white/5
        bg-gray-50/30 dark:bg-white/[0.02]
        lg:w-1/2
        w-full
        lg:flex-shrink-0
    "
        >
          {/* MOBILE CAMERA */}
          <div
            className={`
            lg:hidden
            relative
            transition-all
            duration-300
            overflow-hidden

            ${mobileCameraOpen ? "h-full" : "h-16"}
        `}
          >
            {mobileCameraOpen ? (
              <>
                <VistaCamara
                  stream={grabacion.stream}
                  videoRef={grabacion.videoRef}
                  isRecording={grabacion.estaGrabando}
                  videoDevices={grabacion.dispositivos}
                  selectedDeviceId={grabacion.dispositivoSeleccionado}
                  switchCamera={grabacion.cambiarCamara}
                  startRecording={grabacion.iniciarGrabacion}
                />

                <button
                  onClick={() => setMobileCameraOpen(false)}
                  className="
                        absolute top-3 right-3
                        z-20
                        rounded-xl
                        bg-black/50
                        text-white
                        p-2
                    "
                >
                  <ChevronLeft size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setMobileCameraOpen(true)}
                className="
                    h-full
                    w-full
                    flex
                    items-center
                    justify-center
                    text-gray-400
                "
              >
                <Video size={22} />
              </button>
            )}
          </div>

          {/* DESKTOP CAMERA */}
          <div
            className="
            hidden
            lg:block
            h-full
            relative
        "
          >
            {camaraAbierta ? (
              <>
                <VistaCamara
                  stream={grabacion.stream}
                  videoRef={grabacion.videoRef}
                  isRecording={grabacion.estaGrabando}
                  videoDevices={grabacion.dispositivos}
                  selectedDeviceId={grabacion.dispositivoSeleccionado}
                  switchCamera={grabacion.cambiarCamara}
                  startRecording={grabacion.iniciarGrabacion}
                />

                <button
                  onClick={() => setCamaraAbierta(false)}
                  className="
                        absolute
                        top-3
                        right-3
                        p-2
                        rounded-xl
                        bg-white
                        dark:bg-[#111]
                        shadow
                    "
                >
                  <ChevronRight size={18} />
                </button>
              </>
            ) : (
              <div
                className="
                    h-full
                    flex
                    flex-col
                    items-center
                    justify-between
                    py-4
                "
              >
                <button onClick={() => setCamaraAbierta(true)} className="p-2">
                  <ChevronLeft />
                </button>

                {cameraSummary}

                <button
                  onClick={toggleRecording}
                  className="
                        p-2
                        rounded-xl
                        text-gray-400
                    "
                >
                  {grabacion.estaGrabando ? (
                    <Square fill="currentColor" />
                  ) : (
                    <Mic />
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.section>

        {/* Workspace */}
        {cargandoInicial ? (
          <div className="flex-1 flex items-center justify-center bg-white dark:bg-accent">
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={32} className="animate-spin text-[#008080]" />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Cargando sesión...
              </p>
            </div>
          </div>
        ) : (
          <WorkspaceSesion
            tabActiva={tabActiva}
            setTabActiva={setTabActiva}
            notas={notas}
            alCambiarNotas={setNotas}
            timer={segundos}
            formatTime={formatearTiempo}
            planTratamiento={patientPlan}
            completedSteps={completedSteps}
            totalSteps={totalSteps}
            toggleStep={toggleStep}
            recursos={recursos}
            selectedResources={selectedResources}
            toggleResource={toggleResource}
            evaluationScales={evaluationScales}
            selectedScales={selectedScales}
            toggleScale={toggleScale}
            formTemplates={formTemplates}
            selectedForms={selectedForms}
            toggleForm={toggleForm}
            formResponses={formResponses}
            updateForm={updateForm}
          />
        )}
      </main>

      <ConfirmModal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onConfirm={handleFinalizar}
        title="Finalizar Sesión"
        message="¿Estás seguro de que deseas finalizar y guardar esta sesión clínica?"
        confirmLabel="Finalizar y Guardar"
      />
    </motion.div>
  );
};
