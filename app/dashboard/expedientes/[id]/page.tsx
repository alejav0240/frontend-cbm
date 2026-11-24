"use client";

import { HeaderPaciente } from "@/entities/paciente/ui/headerPaciente";
import { use, useState, useMemo } from "react";
import {
  useActualizarNotasClinicas,
  usePacienteDetalles,
} from "@/entities/paciente";
import { InformacionGeneral } from "@/entities/paciente/ui/InformacionGeneral";
import { CuestionarioInicio } from "@/entities/paciente/ui/CuestionarioInicio";
import { GraficoEvolucion } from "@/entities/paciente/ui/GraficoEvolucion";
import { useRouter } from "next/navigation";
import {
  Search,
  Loader2,
  FileText,
  FileDown,
  UserRound,
  BarChart3,
  Repeat2,
} from "lucide-react";
import { useObtenerProgresoEscala } from "@/entities/paciente/api/useObtenerProgresoEscala";
import AnalisDemuca from "@/entities/paciente/ui/AnalisDemuca";
import { AnalisisIndividualPaciente } from "@/entities/paciente/ui/AnalisisIndividualPaciente";
import { GraficoRadar } from "@/entities/paciente/components/GraficoRadar";
import { HistorialSesiones } from "@/entities/sesion/ui/HistorialSesiones";
import type { SessionType } from "@/entities/sesion/ui/SessionCard";
import { useObtenerProgresoSubEscala } from "@/entities/paciente/api/useObtenerProgresoSubEscala";
import {
  useCiclos,
  useCiclosCompletos,
  useSesionDetalles,
  useActualizarSesion,
  useEliminarSesion,
  mapearSesionADTO,
  generarSesionDetalladaPDF,
  generarSesionDetalladaWord,
} from "@/entities/sesion";
import type { FormularioClinicoDataSchema } from "@/features/gestion-paciente/model/FormularioClinicoData.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  esquemaNotasSesion,
  type DatosFormularioNotasSesion,
} from "@/entities/sesion";

type SessionData = SessionType;

type ExpedienteTab = "general" | "analisis" | "ciclos";

const expedienteTabs: {
  id: ExpedienteTab;
  label: string;
  icon: typeof UserRound;
}[] = [
  { id: "general", label: "Información general", icon: UserRound },
  { id: "analisis", label: "Análisis", icon: BarChart3 },
  { id: "ciclos", label: "Ciclos", icon: Repeat2 },
];

type SesionDetallada = NonNullable<VerSesionQuery["session"]>;

type ResourceSesion = SesionDetallada["sessionResources"][number];
type InventorySesion = SesionDetallada["sessionInventory"][number];
type PlanStepSesion = SesionDetallada["sessionPlanSteps"][number];
type ScaleEvalSesion = SesionDetallada["scaleEvaluations"][number] & {
  scale?: { name?: string | null } | null;
};
type SubscaleRespSesion = ScaleEvalSesion["subscaleResponses"][number] & {
  subscale?: {
    name?: string | null;
    category?: string | null;
    maxValue?: number | null;
  } | null;
};
type ValueRespSesion =
  SesionDetallada["scaleEvaluations"][number]["valueResponses"][number];
type FormAssignSesion = NonNullable<
  NonNullable<SesionDetallada["formAssignments"]>[number]
>;

function GraficosDemucaSesion({
  sesion,
  loading,
}: {
  sesion: SesionDetallada | null;
  loading: boolean;
}) {
  if (loading || !sesion) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-purple-200/60 bg-purple-50/40 text-sm text-gray-500 dark:border-purple-400/20 dark:bg-purple-500/5 dark:text-zinc-300">
        {loading ? "Cargando gráficos DEMUCA..." : "No se encontró la sesión."}
      </div>
    );
  }

  const evaluation = sesion.scaleEvaluations.find((item) =>
    item.scale?.name?.toLowerCase().includes("demuca"),
  );
  const responses = evaluation?.subscaleResponses ?? [];
  const radarData = responses.map((response) => ({
    item: response.subscale?.name || "Subescala",
    score: response.score,
    category: response.subscale?.category || "General",
  }));
  const grouped = responses.reduce<
    Record<string, { score: number; max: number; count: number }>
  >((categories, response) => {
    const category = response.subscale?.category || "General";
    const current = categories[category] || { score: 0, max: 0, count: 0 };
    categories[category] = {
      score: current.score + response.score,
      max: current.max + (response.subscale?.maxValue ?? 0),
      count: current.count + 1,
    };
    return categories;
  }, {});

  if (!evaluation || responses.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 p-6 text-sm text-gray-500 dark:border-white/10 dark:text-zinc-300">
        Esta sesión todavía no tiene una evaluación DEMUCA con subescalas.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-purple-200/70 bg-gradient-to-br from-purple-50/80 via-white to-slate-50 p-5 dark:border-purple-400/20 dark:from-purple-500/10 dark:via-zinc-900 dark:to-zinc-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-600 dark:text-purple-300">
              Perfil de la sesión
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              DEMUCA
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
              Comparación por áreas y detalle de indicadores observados.
            </p>
          </div>
          <div className="rounded-xl border border-purple-200/70 bg-white/80 px-5 py-3 text-center dark:border-purple-400/20 dark:bg-white/5">
            <p className="text-2xl font-black text-purple-700 dark:text-purple-200">
              {evaluation.totalScore ?? 0}
              <span className="text-sm font-semibold text-gray-400">
                {" "}
                / {responses.reduce(
                  (total, response) =>
                    total + (response.subscale?.maxValue ?? 0),
                  0,
                )}
              </span>
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Puntaje total
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(grouped).map(([category, values]) => (
          <div
            key={category}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-bold text-slate-700 dark:text-zinc-200">
                {category}
              </p>
              <span className="shrink-0 text-xs font-black text-purple-600 dark:text-purple-300">
                {values.score}/{values.max}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-purple-100 dark:bg-purple-950/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
                style={{
                  width: `${values.max > 0 ? (values.score / values.max) * 100 : 0}%`,
                }}
              />
            </div>
            <p className="mt-2 text-[10px] text-gray-400">
              {values.count} indicadores
            </p>
          </div>
        ))}
      </div>

      <GraficoRadar data={radarData} />
    </div>
  );
}

import Modal from "@/shared/ui/components/Modal";
import { FormularioClinico } from "@/features/gestion-paciente/ui/FormularioClinico";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import { toast } from "sonner";
import { useAuthStore } from "@/shared/model/useAuthStore";
import {
  useFormulario,
  useAsignacionesFormulario,
  useSubmitFullForm,
  useAssignForm,
  crearEsquemaCuestionario,
} from "@/entities/formulario";
import ViewForm from "@/entities/formulario/ui/viewForm";
import { useObtenerRespuestaFormulario } from "@/entities/formulario/api/useObtenerRespuestaFormulario";
import GenericExportModal, {
  type Exporter,
  type ExportFilter,
} from "@/shared/ui/GenericExportModal";
import {
  generarInformeClinicoPDF,
  generarInformeClinicoWord,
} from "@/entities/informe-clinico";
import type { InformeClinicoDTO } from "@/entities/informe-clinico";
import type { VerSesionQuery } from "@/shared/api/generated/graphql";
import { ProcessingStatusCard } from "@/entities/analysis";
import { DemucaEditor } from "@/features/gestion-sesiones/ui/ModalDetalleSesion";

interface RouteParams {
  id: string;
  value?: string;
}

export interface ExpedientePageProps {
  params: Promise<RouteParams>;
}

export default function ExpedientePage({ params }: ExpedientePageProps) {
  const { id } = use(params);
  const idPaciente = decodeURIComponent(id);

  // Obtenemos los datos de ambas escalas de manera independiente
  const { data: dataEri } = useObtenerProgresoEscala({
    patientId: idPaciente,
    escalaId: "2",
  });
  const { data: dataCIM } = useObtenerProgresoEscala({
    patientId: idPaciente,
    escalaId: "3",
  });
  const { data: dataDemuca } = useObtenerProgresoSubEscala({
    patientId: idPaciente,
    escalaId: "1",
  });
  const {
    preguntasNormalizadas,
    idAssigmente,
    refetch: refetchRespuestaFormulario,
  } = useObtenerRespuestaFormulario({ patientId: idPaciente, formId: "1" });

  const { formulario } = useFormulario("1");
  const {
    asignaciones,
    cargando: cargandoAsignaciones,
    refetch: refetchAsignaciones,
  } = useAsignacionesFormulario({ patientId: idPaciente });
  const { submitFullForm, enviando } = useSubmitFullForm();
  const { assignForm, asignando: asignandoForm } = useAssignForm();

  const asignacion = asignaciones?.[0];

  const valoresIniciales: Record<string, string> =
    asignacion?.originalData?.responses?.reduce(
      (
        acc: Record<string, string>,
        r: { question?: { id: string }; response?: string },
      ) => {
        if (r?.question?.id && r?.response) {
          acc[r.question.id] = r.response;
        }
        return acc;
      },
      {},
    ) ?? {};

  const [formValues, setFormValues] =
    useState<Record<string, string>>(valoresIniciales);

  const [sessionsPage, setSessionsPage] = useState<number | undefined>(
    undefined,
  );
  const { sesiones, currentPage, totalPages, ciclo } = useCiclos({
    pacienteId: idPaciente,
    page: sessionsPage,
  });

  const { sesiones: sesionesCompletas } = useCiclosCompletos(idPaciente);

  const { paciente, refetch } = usePacienteDetalles(idPaciente);
  const router = useRouter();

  const [mostrarFormularioClinico, setMostrarFormularioClinico] =
    useState(false);
  const [mostrarCuestionario, setMostrarCuestionario] = useState(false);
  const [mostrarExportarClinico, setMostrarExportarClinico] = useState(false);
  const [activeTab, setActiveTab] = useState<ExpedienteTab>("analisis");

  const [selectedSessionForAI, setSelectedSessionForAI] = useState<
    string | null
  >(null);
  const [aiViewMode, setAiViewMode] = useState<"list" | "charts">("list");

  const [showEditSessionModal, setShowEditSessionModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DatosFormularioNotasSesion>({
    resolver: zodResolver(esquemaNotasSesion),
    defaultValues: { notes: "" },
  });

  const [showDeleteSessionConfirm, setShowDeleteSessionConfirm] =
    useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  // Detalle y exportación de sesión única
  const [selectedSessionForDetails, setSelectedSessionForDetails] =
    useState<SessionData | null>(null);
  const [, setSelectedSessionForExport] = useState<SessionData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const {
    obtenerSesion,
    cargando: cargandoDetalles,
    sesion: sesionDetallada,
  } = useSesionDetalles();
  const {
    obtenerSesion: obtenerSesionAI,
    cargando: cargandoSesionAI,
    sesion: sesionAI,
  } = useSesionDetalles();
  const { actualizarSesion } = useActualizarSesion();
  const { eliminarSesion } = useEliminarSesion();

  const handleViewSessionDetails = (session: SessionData) => {
    setSelectedSessionForDetails(session);
    setShowDetailsModal(true);
    obtenerSesion({
      variables: { id: String(session.id || String(session.databaseId)) },
    });
  };

  const handleExportSession = (session: SessionData) => {
    setSelectedSessionForExport(session);
    setShowExportModal(true);
    obtenerSesion({
      variables: { id: String(session.id || String(session.databaseId)) },
    });
  };

  const { updateClinicalNotes } = useActualizarNotasClinicas();

  const { usuario } = useAuthStore();

  const handleClinicalNotesSubmit = async (
    formData: FormularioClinicoDataSchema,
  ) => {
    if (!paciente || !usuario?.databaseId) return;

    try {
      await updateClinicalNotes(
        paciente.id,
        String(usuario.databaseId),
        formData,
      );
      setMostrarFormularioClinico(false);
      toast.success("Notas clínicas actualizadas correctamente");
      refetch();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al actualizar notas clínicas",
      );
    }
  };

  const handleQuestionnaireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario?.databaseId || !paciente?.id) return;

    const esquema = crearEsquemaCuestionario(formulario?.questions ?? []);
    const resultado = esquema.safeParse(formValues);
    if (!resultado.success) {
      const idsFaltantes = new Set(
        resultado.error.issues.map((issue) => String(issue.path[0] ?? "")),
      );
      const preguntasFaltantes = (formulario?.questions ?? [])
        .filter((pregunta) => idsFaltantes.has(pregunta.id))
        .map((pregunta) => pregunta.question);
      toast.error(
        `Completa las preguntas obligatorias: ${preguntasFaltantes.join(", ")}`,
      );
      return;
    }

    const responses = Object.entries(formValues).map(
      ([questionId, responseText]) => ({
        questionId,
        responseText,
      }),
    );

    try {
      let assignmentId = idAssigmente;

      if (!assignmentId) {
        const result = await assignForm({
          formId: "1",
          assignedToId: String(usuario.databaseId),
          assignedById: String(usuario.databaseId),
          patientId: paciente.id,
        });
        const newId = result.data?.assignForm?.assignment?.id;
        if (!newId) throw new Error("No se pudo crear la asignación");
        assignmentId = newId;
      }

      await submitFullForm({ assignmentId: assignmentId as string, responses });
      await Promise.all([refetchRespuestaFormulario(), refetchAsignaciones()]);
      setMostrarCuestionario(false);
      toast.success("Cuestionario guardado correctamente");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al guardar el cuestionario",
      );
    }
  };

  const handleViewAIAnalysis = (
    sessionId: string | number,
    mode: "list" | "charts",
  ) => {
    const normalizedSessionId = String(sessionId);
    setSelectedSessionForAI(normalizedSessionId);
    setAiViewMode(mode);
    obtenerSesionAI({
      variables: { id: normalizedSessionId },
    });
  };

  const handleEditSession = (session: SessionData) => {
    setSelectedSession(session);
    reset({ notes: (session.notes as string) || "" });
    setShowEditSessionModal(true);
  };

  const handleSaveSessionEdit = async (data: DatosFormularioNotasSesion) => {
    if (!selectedSession?.id && !selectedSession?.databaseId) return;
    const sessionId = String(
      selectedSession.id || String(selectedSession.databaseId),
    );
    try {
      await actualizarSesion(sessionId, { notes: data.notes });
      setShowEditSessionModal(false);
      setSelectedSession(null);
      refetch();
    } catch {
      // toast ya se maneja en el hook
    }
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;
    try {
      await eliminarSesion(sessionToDelete);
      setSessionToDelete(null);
      setShowDeleteSessionConfirm(false);
      refetch();
    } catch {
      // toast ya se maneja en el hook
    }
  };

  // ── Preparar datos para exportación ──
  const informeClinicoData = useMemo((): InformeClinicoDTO[] => {
    if (!paciente) return [];

    const eriResults = dataEri?.scaleEvaluations?.results ?? [];
    const cimResults = dataCIM?.scaleEvaluations?.results ?? [];

    const detalleEscala = (
      evals: Array<{
        evaluatedAt?: string;
        totalScore?: number | null;
        subscaleResponses?: Array<{
          score: number;
          subscale?: { name?: string | null; category?: string | null } | null;
        } | null> | null;
        valueResponses?: Array<{
          scaleValue?: { label?: string | null; value?: number | null } | null;
        } | null> | null;
      }>,
    ): InformeClinicoDTO["escalas"][number]["detalle"] =>
      evals.map((e) => ({
        fecha: e.evaluatedAt
          ? new Date(e.evaluatedAt).toLocaleDateString("es-ES")
          : "",
        total: e.totalScore ?? null,
        subescalas: (e.subscaleResponses ?? []).map((sr) => ({
          nombre: sr?.subscale?.name || "",
          categoria: sr?.subscale?.category || "",
          puntuacion: sr?.score ?? 0,
        })),
        valores: (e.valueResponses ?? []).map((vr) => ({
          label: vr?.scaleValue?.label || "",
          value: vr?.scaleValue?.value ?? 0,
        })),
      }));

    const escalas: InformeClinicoDTO["escalas"] = [];
    if (eriResults.length) {
      escalas.push({
        id: "eri",
        nombre: "ERI",
        etiqueta: "Escala de Regulación Emocional",
        color: "#008080",
        puntuaciones: eriResults.map((e) => ({
          sesion: new Date(e.evaluatedAt).toLocaleDateString("es-ES"),
          valor: e.totalScore,
        })),
        detalle: detalleEscala(eriResults),
      });
    }
    if (cimResults.length) {
      escalas.push({
        id: "cim",
        nombre: "CIM",
        etiqueta: "Cambio en la Identidad Musical",
        color: "#3b82f6",
        puntuaciones: cimResults.map((e) => ({
          sesion: new Date(e.evaluatedAt).toLocaleDateString("es-ES"),
          valor: e.totalScore,
        })),
        detalle: detalleEscala(cimResults),
      });
    }
    if (dataDemuca?.length) {
      escalas.push({
        id: "demuca",
        nombre: "DEMUCA",
        etiqueta: "Detección de Musicoterapia",
        color: "#8b5cf6",
        puntuaciones: dataDemuca.map((e) => ({
          sesion: e.evaluatedAt
            ? new Date(e.evaluatedAt).toLocaleDateString("es-ES")
            : "",
          valor: e.totalScore ?? null,
        })),
        detalle: detalleEscala(dataDemuca),
      });
    }

    const sesionesReporte = (sesionesCompletas ?? [])
      .map((s) => ({
        numero: s.sessionNumber || 0,
        fecha: s.sessionDate
          ? new Date(s.sessionDate as string).toLocaleDateString("es-ES")
          : "",
        terapeuta: s.therapist?.fullName || "",
        duracion: s.durationMinutes ? `${s.durationMinutes} min` : "",
        estado: s.sessionStatus || "",
        ciclo: s.cycleNumber || 0,
        notas: s.notes || "",
        recursos: (s.sessionResources ?? [])
          .map((r) => r.resource?.title || "")
          .filter(Boolean),
        materiales: (s.sessionInventory ?? [])
          .map((i) => i.item?.name || "")
          .filter(Boolean),
        evaluaciones: (s.scaleEvaluations ?? []).map((e) => ({
          escala: e.scale?.name || "",
          puntuacion: e.totalScore,
          subescalas: (e.subscaleResponses ?? []).map((sr) => ({
            nombre: sr.subscale?.name || "",
            categoria: sr.subscale?.category || "",
            puntuacion: sr.score,
          })),
          valores: (e.valueResponses ?? []).map((vr) => ({
            label: vr.scaleValue?.label || "",
            value: vr.scaleValue?.value ?? 0,
          })),
        })),
      }))
      .sort(
        (a, b) =>
          (a.fecha
            ? new Date(a.fecha.split("/").reverse().join("-")).getTime()
            : 0) -
          (b.fecha
            ? new Date(b.fecha.split("/").reverse().join("-")).getTime()
            : 0),
      );

    return [
      {
        paciente: {
          nombre: paciente.name || paciente.fullName || "",
          cedula: paciente.idNumber || paciente.ci || "",
          edad: paciente.age || "",
          diagnostico: paciente.diagnosis || paciente.diagnostico || "",
          residencia: paciente.residence || paciente.residenciaActual || "",
          tutor: paciente.tutor || "",
          telefono: paciente.tutorPhone || "",
          objetivosGenerales: paciente.objetivosGenerales || "",
          fisico: paciente.fisico || "",
          emocional: paciente.emocional || "",
          cognitivo: paciente.cognitivo || "",
          social: paciente.social || "",
          metodosAUsar: paciente.metodosAUsar || "",
          notas: paciente.notas || paciente.notes || "",
        },
        sesiones: sesionesReporte,
        escalas,
      },
    ];
  }, [paciente, dataEri, dataCIM, dataDemuca, sesionesCompletas]);

  const informeFilters = useMemo((): ExportFilter<InformeClinicoDTO>[] => {
    const sesionesInforme = informeClinicoData[0]?.sesiones ?? [];

    const etiquetasEstado: Record<string, string> = {
      AGENDADA: "Agendada",
      CONFIRMA: "Confirmada",
      COMPLETA: "Completa",
      CANCELADA: "Cancelada",
      REPROGRAMA: "Reprogramada",
    };

    const estados = Array.from(
      new Set(sesionesInforme.map((s) => s.estado).filter(Boolean)),
    ).sort();

    return [
      {
        key: "sesiones",
        label: "Ciclo",
        type: "select",
        itemKey: "ciclo",
        options: Array.from(new Set(sesionesInforme.map((s) => s.ciclo)))
          .sort((a, b) => a - b)
          .map((ciclo) => ({
            value: String(ciclo),
            label: `Ciclo ${ciclo}`,
          })),
      },
      {
        key: "sesiones",
        label: "Rango de Fechas",
        type: "date-range",
        itemKey: "fecha",
      },
      {
        key: "sesiones",
        label: "Estado",
        type: "select",
        itemKey: "estado",
        options: estados.map((estado) => ({
          value: estado,
          label: etiquetasEstado[estado] ?? estado,
        })),
      },
    ];
  }, [informeClinicoData]);

  const informePdfExporter = useMemo(
    (): Exporter<InformeClinicoDTO> => ({
      id: "pdf",
      label: "Exportar PDF",
      async execute(data) {
        const doc = await generarInformeClinicoPDF(data);
        doc.save(`informe_clinico_${Date.now()}.pdf`);
      },
      async preview(data) {
        const doc = await generarInformeClinicoPDF(data);
        return doc.output("blob");
      },
    }),
    [],
  );

  const informeWordExporter = useMemo(
    (): Exporter<InformeClinicoDTO> => ({
      id: "word",
      label: "Exportar Word",
      color: "#2b5797",
      async execute(data, _columns, fileName) {
        await generarInformeClinicoWord(data, fileName);
      },
    }),
    [],
  );

  const exporters = useMemo(
    () => [informePdfExporter, informeWordExporter],
    [informePdfExporter, informeWordExporter],
  );

  const eriData = dataEri?.scaleEvaluations?.results ?? [];
  const cimData = dataCIM?.scaleEvaluations?.results ?? [];
  const datosEscalas = [eriData, cimData];

  return (
    <div className="space-y-8">
      <HeaderPaciente
        patient={paciente!}
        onShowClinicalForm={() => setMostrarFormularioClinico(true)}
        onShowQuestionnaire={() => {
          if (cargandoAsignaciones) {
            toast.info("Cargando las respuestas del cuestionario...");
            return;
          }
          setFormValues(valoresIniciales);
          setMostrarCuestionario(true);
        }}
        onBack={() => router.push("/dashboard/expedientes")}
        onExport={() => setMostrarExportarClinico(true)}
      />

      <div
        role="tablist"
        aria-label="Secciones del expediente"
        className="flex gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-2xl"
      >
        {expedienteTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`expediente-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`expediente-panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? "bg-white dark:bg-[#111] text-[#008080] shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <Icon size={17} aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "general" && (
        <div
          id="expediente-panel-general"
          role="tabpanel"
          aria-labelledby="expediente-tab-general"
          className="grid lg:grid-cols-2 gap-8"
        >
          <InformacionGeneral patient={paciente!} />
          <CuestionarioInicio preguntas={preguntasNormalizadas!} />
        </div>
      )}

      {activeTab === "analisis" && (
        <div
          id="expediente-panel-analisis"
          role="tabpanel"
          aria-labelledby="expediente-tab-analisis"
          className="space-y-6"
        >
          {paciente && (
            <AnalisisIndividualPaciente
              paciente={paciente}
              dataDemuca={dataDemuca ?? []}
              datosEscalas={datosEscalas}
              sesionesCount={sesionesCompletas?.length || sesiones?.length || 0}
            />
          )}
        </div>
      )}

      {activeTab === "ciclos" && (
        <div
          id="expediente-panel-ciclos"
          role="tabpanel"
          aria-labelledby="expediente-tab-ciclos"
        >
          <HistorialSesiones
            patientSessions={sesiones ?? []}
            currentPage={currentPage}
            onPageChange={setSessionsPage}
            cicloNumber={ciclo}
            totalPages={totalPages}
            onViewAIAnalysis={handleViewAIAnalysis}
            onEditSession={handleEditSession}
            onDeleteSession={(sessionId) => {
              setSessionToDelete(String(sessionId));
              setShowDeleteSessionConfirm(true);
            }}
            onViewDetails={handleViewSessionDetails}
            onExport={handleExportSession}
          />
        </div>
      )}

      {/* Modal: Actualizar Información Clínica */}
      <Modal
        isOpen={mostrarFormularioClinico}
        onClose={() => setMostrarFormularioClinico(false)}
        title="Actualizar Información Clínica"
      >
        <FormularioClinico
          paciente={paciente ?? null}
          alEnviar={handleClinicalNotesSubmit}
          alCancelar={() => setMostrarFormularioClinico(false)}
        />
      </Modal>

      {/* Modal: Cuestionario de Ingreso */}
      <Modal
        isOpen={mostrarCuestionario}
        onClose={() => {
          setMostrarCuestionario(false);
          setFormValues(valoresIniciales);
        }}
        title="Cuestionario de Ingreso"
      >
        <form onSubmit={handleQuestionnaireSubmit} className="space-y-6">
          {formulario ? (
            <ViewForm
              form={formulario}
              values={formValues}
              onChange={(questionId, value) =>
                setFormValues((prev) => ({ ...prev, [questionId]: value }))
              }
            />
          ) : (
            <p className="text-center text-gray-500 py-8">
              Cargando formulario...
            </p>
          )}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setMostrarCuestionario(false)}
              className="px-6 py-2 border rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando || asignandoForm}
              className="px-6 py-2 bg-[#008080] text-white rounded-xl disabled:opacity-50"
            >
              {enviando || asignandoForm ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Exportar Informe Clínico */}
      <GenericExportModal<InformeClinicoDTO>
        isOpen={mostrarExportarClinico}
        onClose={() => setMostrarExportarClinico(false)}
        title="Vista Previa de Expediente Clínico"
        data={informeClinicoData}
        fileName={`informe_${paciente?.name?.replace(/\s+/g, "_") || "paciente"}`}
        columns={[
          {
            key: "paciente",
            label: "Paciente",
            formatter: (v) => (v as { nombre?: string })?.nombre || "",
          },
          {
            key: "sesiones",
            label: "Sesiones",
            formatter: (v) => String((v as { length?: number })?.length || 0),
          },
          {
            key: "escalas",
            label: "Escalas",
            formatter: (v) => String((v as { length?: number })?.length || 0),
          },
        ]}
        filters={informeFilters}
        summaryCount={(rows) =>
          rows.reduce((total, row) => total + row.sesiones.length, 0)
        }
        exporters={exporters}
      />

      {/* Modal: Análisis de IA */}
      <Modal
        isOpen={selectedSessionForAI !== null}
        onClose={() => setSelectedSessionForAI(null)}
        title={aiViewMode === "charts" ? "Gráficos DEMUCA" : "Análisis DEMUCA"}
        maxWidth="max-w-5xl"
      >
        {selectedSessionForAI && (
          <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-1.5 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => setAiViewMode("list")}
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                      aiViewMode === "list"
                        ? "bg-white text-purple-700 shadow-sm dark:bg-zinc-900 dark:text-purple-200"
                        : "text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                  >
                    Análisis y evidencia
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiViewMode("charts")}
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                      aiViewMode === "charts"
                        ? "bg-white text-purple-700 shadow-sm dark:bg-zinc-900 dark:text-purple-200"
                        : "text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                  >
                    Gráficos por área
                  </button>
                </div>
              </div>

              {aiViewMode === "charts" ? (
                <GraficosDemucaSesion
                  sesion={sesionAI}
                  loading={cargandoSesionAI}
                />
              ) : (
                <>
                  <div className="rounded-2xl border border-purple-200/60 bg-purple-50/40 p-4 dark:border-purple-400/20 dark:bg-purple-500/5">
                    <p className="text-sm font-bold text-purple-900 dark:text-purple-100">
                      Análisis multimodal de la sesión
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-purple-800/70 dark:text-purple-200/70">
                      Revisá el estado del procesamiento, la evidencia devuelta
                      por el worker y la línea de revisión humana.
                    </p>
                  </div>
                  <ProcessingStatusCard
                    sessionId={selectedSessionForAI}
                    sourceUri={sesionAI?.videoUrl}
                  />
                  {(() => {
                    const demucaEvaluation = sesionAI?.scaleEvaluations?.find(
                      (evaluation) =>
                        evaluation.scale?.name?.toLowerCase().includes("demuca"),
                    );

                    return demucaEvaluation ? (
                      <DemucaEditor
                        key={demucaEvaluation.id}
                        evaluation={demucaEvaluation}
                        onSaved={() => {
                          void obtenerSesionAI({
                            variables: { id: selectedSessionForAI },
                          });
                        }}
                      />
                    ) : null;
                  })()}
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Editar Notas de Sesión */}
      <Modal
        isOpen={showEditSessionModal}
        onClose={() => setShowEditSessionModal(false)}
        title={`Editar Notas de Sesión`}
      >
        <form onSubmit={handleSubmit(handleSaveSessionEdit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Notas Clínicas
            </label>
            <textarea
              {...register("notes")}
              rows={8}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 outline-none transition-all text-sm dark:text-white resize-none ${errors.notes ? "border-red-500" : "border-transparent focus-visible:border-[#008080]"}`}
              placeholder="Escribe las observaciones clínicas aquí..."
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => setShowEditSessionModal(false)}
              className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Confirmar Eliminación de Sesión */}
      <ConfirmModal
        isOpen={showDeleteSessionConfirm}
        onClose={() => {
          setShowDeleteSessionConfirm(false);
          setSessionToDelete(null);
        }}
        onConfirm={handleDeleteSession}
        title="Eliminar Sesión"
        message="¿Estás seguro de que deseas eliminar este registro de sesión? Esta acción no se puede deshacer."
        confirmLabel="Eliminar Sesión"
      />

      {/* Modal: Ver Detalles de Sesión */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedSessionForDetails(null);
        }}
        title={`Detalles de Sesión #${selectedSessionForDetails?.sessionNumber || ""}`}
        maxWidth="max-w-4xl"
      >
        {cargandoDetalles ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="animate-spin text-[#008080]" size={36} />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest font-sans">
              Cargando información detallada...
            </p>
          </div>
        ) : sesionDetallada ? (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Información General */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-200/50 dark:border-zinc-800">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-sans">
                  Paciente
                </span>
                <span className="text-sm font-semibold dark:text-white font-sans">
                  {paciente?.fullName || paciente?.name || "—"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-sans">
                  Fecha
                </span>
                <span className="text-sm font-semibold dark:text-white font-sans">
                  {sesionDetallada.sessionDate
                    ? new Date(
                        String(sesionDetallada.sessionDate),
                      ).toLocaleDateString("es-ES")
                    : "—"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-sans">
                  Duración
                </span>
                <span className="text-sm font-semibold dark:text-white font-sans">
                  {sesionDetallada.durationMinutes || 0} min
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-sans">
                  Terapeuta
                </span>
                <span className="text-sm font-semibold dark:text-white font-sans">
                  {(
                    sesionDetallada as {
                      therapist?: { fullname?: string | null } | null;
                    }
                  ).therapist?.fullname || "No asignado"}
                </span>
              </div>
            </div>

            {/* Notas Clínicas */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#008080] font-sans">
                Notas Clínicas
              </h4>
              <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200/50 dark:border-zinc-800/80">
                <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-sans">
                  {sesionDetallada.notes || "No hay observaciones registradas."}
                </p>
              </div>
            </div>

            {/* Recursos y Materiales */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Recursos Digitales */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#008080] font-sans">
                  Recursos Digitales
                </h4>
                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200/50 dark:border-zinc-800/80 min-h-[60px] flex flex-wrap gap-2 items-center">
                  {sesionDetallada.sessionResources &&
                  sesionDetallada.sessionResources.length > 0 ? (
                    sesionDetallada.sessionResources.map(
                      (r: ResourceSesion, idx: number) => (
                        <span
                          key={idx}
                          className="text-xs bg-teal-500/10 text-[#008080] px-2.5 py-1 rounded-full font-medium font-sans"
                        >
                          {r.resource?.title || "Recurso"}
                        </span>
                      ),
                    )
                  ) : (
                    <span className="text-xs text-gray-400 italic font-sans">
                      Ninguno
                    </span>
                  )}
                </div>
              </div>

              {/* Materiales Aula */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#008080] font-sans">
                  Materiales del Aula
                </h4>
                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200/50 dark:border-zinc-800/80 min-h-[60px] flex flex-wrap gap-2 items-center">
                  {sesionDetallada.sessionInventory &&
                  sesionDetallada.sessionInventory.length > 0 ? (
                    sesionDetallada.sessionInventory.map(
                      (i: InventorySesion, idx: number) => (
                        <span
                          key={idx}
                          className="text-xs bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-2.5 py-1 rounded-full font-medium font-sans"
                        >
                          {i.item?.name || "Material"}
                        </span>
                      ),
                    )
                  ) : (
                    <span className="text-xs text-gray-400 italic font-sans">
                      Ninguno
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Planificación de la Sesión */}
            {sesionDetallada.sessionPlanSteps &&
              sesionDetallada.sessionPlanSteps.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#008080] font-sans">
                    Planificación y Pasos
                  </h4>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-zinc-800">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-zinc-800/60 text-slate-500 dark:text-zinc-400 font-bold border-b border-slate-200 dark:border-zinc-800">
                          <th className="p-3">Momento</th>
                          <th className="p-3">Objetivo</th>
                          <th className="p-3">Método MLT</th>
                          <th className="p-3 text-center">Duración</th>
                          <th className="p-3 text-center">Completado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sesionDetallada.sessionPlanSteps.map(
                          (s: PlanStepSesion) => (
                            <tr
                              key={s.id}
                              className="border-b last:border-0 border-slate-200/60 dark:border-zinc-800/60 hover:bg-slate-50/50 dark:hover:bg-zinc-800/20"
                            >
                              <td className="p-3 font-semibold text-slate-700 dark:text-zinc-300">
                                {s.planStep?.moment || "—"}
                              </td>
                              <td className="p-3 text-gray-500 dark:text-zinc-400">
                                {s.planStep?.objective || "—"}
                              </td>
                              <td className="p-3 text-gray-500 dark:text-zinc-400">
                                {s.planStep?.mltMethod || "—"}
                              </td>
                              <td className="p-3 text-center text-gray-500 dark:text-zinc-400">
                                {s.actualDuration || 0} /{" "}
                                {s.planStep?.durationMinutes || 0} min
                              </td>
                              <td className="p-3 text-center">
                                {s.isCompleted ? (
                                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-sans">
                                    Sí
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full font-sans">
                                    No
                                  </span>
                                )}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            {/* Evaluaciones Clínicas */}
            {sesionDetallada.scaleEvaluations &&
              sesionDetallada.scaleEvaluations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#008080] font-sans">
                    Evaluaciones Realizadas
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {sesionDetallada.scaleEvaluations.map(
                      (evalData: ScaleEvalSesion) => {
                        const respuestas = evalData.subscaleResponses ?? [];
                        const maxScore = respuestas.reduce(
                          (total, response) =>
                            total + (response.subscale?.maxValue ?? 0),
                          0,
                        );
                        const score = evalData.totalScore ?? 0;
                        const percentage =
                          maxScore > 0
                            ? Math.round((score / maxScore) * 100)
                            : 0;
                        const groupedResponses = respuestas.reduce<
                          Record<string, SubscaleRespSesion[]>
                        >((groups, response) => {
                          const category =
                            response.subscale?.category || "General";
                          groups[category] ??= [];
                          groups[category].push(response);
                          return groups;
                        }, {});

                        return (
                          <div
                            key={evalData.id}
                            className="overflow-hidden rounded-2xl border border-purple-200/70 bg-gradient-to-br from-purple-50/80 via-white to-slate-50 dark:border-purple-400/20 dark:from-purple-500/10 dark:via-zinc-900 dark:to-zinc-900"
                          >
                            <div className="border-b border-purple-200/60 px-5 py-4 dark:border-purple-400/15">
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="rounded-lg bg-purple-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-200">
                                      DEMUCA
                                    </span>
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                                      Resultado provisional
                                    </span>
                                  </div>
                                  <h5 className="mt-2 text-base font-bold text-slate-900 dark:text-white font-sans">
                                    {evalData.scale?.name || "Escala DEMUCA"}
                                  </h5>
                                  <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
                                    {respuestas.length} indicadores · requiere revisión profesional
                                  </p>
                                </div>

                                <div className="min-w-[180px] rounded-xl border border-purple-200/70 bg-white/80 px-4 py-3 dark:border-purple-400/15 dark:bg-white/5">
                                  <div className="flex items-end justify-between gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                      Puntaje total
                                    </span>
                                    <span className="text-2xl font-black text-purple-700 dark:text-purple-200">
                                      {score}
                                      <span className="text-sm font-semibold text-gray-400">
                                        {" "}
                                        / {maxScore}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-purple-100 dark:bg-purple-950/60">
                                    <div
                                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <p className="mt-1 text-right text-[10px] font-semibold text-purple-600 dark:text-purple-300">
                                    {percentage}% del máximo
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="grid gap-3 p-4 md:grid-cols-2">
                              {Object.entries(groupedResponses).map(
                                ([category, categoryResponses]) => {
                                  const categoryScore = categoryResponses.reduce(
                                    (total, response) => total + response.score,
                                    0,
                                  );
                                  const categoryMax = categoryResponses.reduce(
                                    (total, response) =>
                                      total +
                                      (response.subscale?.maxValue ?? 0),
                                    0,
                                  );

                                  return (
                                    <div
                                      key={category}
                                      className="rounded-xl border border-slate-200/80 bg-white/70 p-3 dark:border-zinc-800 dark:bg-white/[0.03]"
                                    >
                                      <div className="mb-2 flex items-center justify-between gap-3">
                                        <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">
                                          {category}
                                        </span>
                                        <span className="shrink-0 rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-200">
                                          {categoryScore}/{categoryMax}
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
                                        {categoryResponses.map(
                                          (
                                            response: SubscaleRespSesion,
                                            responseIndex: number,
                                          ) => (
                                            <div
                                              key={`${response.subscale?.name || "subscale"}-${responseIndex}`}
                                              className="flex min-w-0 items-center justify-between gap-2 text-xs"
                                            >
                                              <span className="truncate text-gray-500 dark:text-zinc-400">
                                                {response.subscale?.name ||
                                                  "Subescala"}
                                              </span>
                                              <span className="shrink-0 font-bold text-slate-700 dark:text-zinc-200">
                                                {response.score}/
                                                {response.subscale?.maxValue ?? 0}
                                              </span>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  );
                                },
                              )}
                            </div>

                            {evalData.valueResponses &&
                              evalData.valueResponses.length > 0 && (
                                <div className="border-t border-purple-200/60 px-5 py-3 dark:border-purple-400/15">
                                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    Valores cualitativos
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {evalData.valueResponses.map(
                                      (valueResponse: ValueRespSesion) => (
                                        <span
                                          key={valueResponse.id}
                                          className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-white/5 dark:text-zinc-300"
                                        >
                                          {valueResponse.scaleValue?.label}:{" "}
                                          <strong>
                                            {valueResponse.scaleValue?.value ??
                                              "—"}
                                          </strong>
                                        </span>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}

            {/* Formularios Clínicos */}
            {sesionDetallada.formAssignments &&
              sesionDetallada.formAssignments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#008080] font-sans">
                    Cuestionarios y Formularios
                  </h4>
                  <div className="space-y-3">
                    {sesionDetallada.formAssignments.map(
                      (formAssign, assignIdx: number) => {
                        if (formAssign == null) return null;
                        return (
                          <div
                            key={assignIdx}
                            className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200/50 dark:border-zinc-800/80 space-y-3"
                          >
                            <div className="border-b border-slate-200 dark:border-zinc-800/60 pb-2 flex justify-between items-center">
                              <span className="text-xs font-bold text-gray-400 font-sans">
                                Respuestas del Cuestionario
                              </span>
                              <span className="text-[10px] font-bold text-[#008080] bg-teal-500/10 px-2 py-0.5 rounded-full font-sans">
                                {Math.round(
                                  Number(formAssign.completionRatio ?? 0) * 100,
                                )}
                                % Completado
                              </span>
                            </div>

                            <div className="space-y-3">
                              {formAssign.responses &&
                                formAssign.responses.map(
                                  (
                                    r: FormAssignSesion["responses"][number],
                                    idx: number,
                                  ) => (
                                    <div key={idx} className="space-y-1">
                                      <p className="text-xs font-bold text-slate-700 dark:text-zinc-300 font-sans">
                                        Q: {r.question?.question}
                                      </p>
                                      <p className="text-xs text-slate-500 dark:text-zinc-400 pl-3 border-l-2 border-slate-200 dark:border-zinc-800 italic font-sans">
                                        R: {r.response || "—"}
                                      </p>
                                    </div>
                                  ),
                                )}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8 font-sans">
            No se pudo cargar la información de la sesión.
          </p>
        )}
      </Modal>

      {/* Modal: Exportar Informe de Sesión */}
      <Modal
        isOpen={showExportModal}
        onClose={() => {
          setShowExportModal(false);
          setSelectedSessionForExport(null);
        }}
        title="Exportar Informe de Sesión"
        maxWidth="max-w-md"
      >
        {cargandoDetalles ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="animate-spin text-[#008080]" size={36} />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest font-sans">
              Preparando datos de exportación...
            </p>
          </div>
        ) : sesionDetallada ? (
          <div className="space-y-6 py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed font-sans">
              Selecciona el formato en el que deseas exportar el informe
              detallado de la **Sesión #{sesionDetallada.sessionNumber}**.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={async () => {
                  try {
                    const dto = mapearSesionADTO(
                      sesionDetallada,
                      paciente?.fullName || paciente?.name || "",
                    );
                    const doc = await generarSesionDetalladaPDF(dto);
                    doc.save(
                      `informe_sesion_${sesionDetallada.sessionNumber}_${Date.now()}.pdf`,
                    );
                    toast.success("PDF generado correctamente");
                  } catch (error) {
                    console.error(error);
                    toast.error("Error al generar PDF");
                  }
                }}
                className="flex flex-col items-center gap-3 p-6 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 rounded-2xl border border-slate-200 dark:border-zinc-700/60 hover:scale-105 transition-all text-[#008080]"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <span className="text-sm font-bold font-sans">
                  Exportar PDF
                </span>
              </button>

              <button
                onClick={async () => {
                  try {
                    const dto = mapearSesionADTO(
                      sesionDetallada,
                      paciente?.fullName || paciente?.name || "",
                    );
                    await generarSesionDetalladaWord(
                      dto,
                      `informe_sesion_${sesionDetallada.sessionNumber}`,
                    );
                    toast.success("Documento Word generado correctamente");
                  } catch (error) {
                    console.error(error);
                    toast.error("Error al generar Word");
                  }
                }}
                className="flex flex-col items-center gap-3 p-6 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 rounded-2xl border border-slate-200 dark:border-zinc-700/60 hover:scale-105 transition-all text-blue-500"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <FileDown size={24} />
                </div>
                <span className="text-sm font-bold font-sans">
                  Exportar Word
                </span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8 font-sans">
            No se pudo cargar la información de la sesión para exportar.
          </p>
        )}
      </Modal>
    </div>
  );
}
