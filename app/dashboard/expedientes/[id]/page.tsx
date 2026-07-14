"use client";

import { HeaderPaciente } from "@/entities/paciente/ui/headerPaciente";
import { use, useState, useEffect, useMemo } from "react";
import {
  useActualizarNotasClinicas,
  usePacienteDetalles,
} from "@/entities/paciente";
import { InformacionGeneral } from "@/entities/paciente/ui/InformacionGeneral";
import { CuestionarioInicio } from "@/entities/paciente/ui/CuestionarioInicio";
import { GraficoEvolucion } from "@/entities/paciente/ui/GraficoEvolucion";
import { useRouter } from "next/navigation";
import { Search, Loader2, FileText, FileDown } from "lucide-react";
import { useObtenerProgresoEscala } from "@/entities/paciente/api/useObtenerProgresoEscala";
import AnalisDemuca from "@/entities/paciente/ui/AnalisDemuca";
import { EriCimTablas } from "@/entities/paciente/ui/EriCimTablas";
import { HistorialSesiones } from "@/entities/sesion/ui/HistorialSesiones";
import { useObtenerProgresoSubEscala } from "@/entities/paciente/api/useObtenerProgresoSubEscala";
import {
  useCiclos,
  useSesionDetalles,
  useActualizarSesion,
  useEliminarSesion,
  mapearSesionADTO,
  generarSesionDetalladaPDF,
  generarSesionDetalladaWord,
} from "@/entities/sesion";
import type { FormularioClinicoDataSchema } from "@/features/gestion-paciente/model/FormularioClinicoData.schema";

type SessionData = Record<string, unknown> & {
  id?: string;
  databaseId?: number;
  notes?: string;
};
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
} from "@/entities/formulario";
import ViewForm from "@/entities/formulario/ui/viewForm";
import { useObtenerRespuestaFormulario } from "@/entities/formulario/api/useObtenerRespuestaFormulario";
import GenericExportModal, { Exporter } from "@/shared/ui/GenericExportModal";
import {
  generarInformeClinicoPDF,
  generarInformeClinicoWord,
} from "@/entities/informe-clinico";
import type { InformeClinicoDTO } from "@/entities/informe-clinico";

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
  const { preguntasNormalizadas, idAssigmente } = useObtenerRespuestaFormulario(
    { patientId: idPaciente, formId: "1" },
  );

  const { formulario, cargando: cargandoForm } = useFormulario("1");
  const { asignaciones } = useAsignacionesFormulario({ patientId: idPaciente });
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

  const { paciente, cargando, refetch } = usePacienteDetalles(idPaciente);
  const router = useRouter();

  const [mostrarFormularioClinico, setMostrarFormularioClinico] =
    useState(false);
  const [mostrarCuestionario, setMostrarCuestionario] = useState(false);
  const [mostrarExportarClinico, setMostrarExportarClinico] = useState(false);

  const [selectedSessionForAI, setSelectedSessionForAI] = useState<
    string | null
  >(null);
  const [aiViewMode, setAiViewMode] = useState<"list" | "charts">("list");

  const [showEditSessionModal, setShowEditSessionModal] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(
    null,
  );

  const [showDeleteSessionConfirm, setShowDeleteSessionConfirm] =
    useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  // Detalle y exportación de sesión única
  const [selectedSessionForDetails, setSelectedSessionForDetails] =
    useState<SessionData | null>(null);
  const [selectedSessionForExport, setSelectedSessionForExport] =
    useState<SessionData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const {
    obtenerSesion,
    cargando: cargandoDetalles,
    sesion: sesionDetallada,
  } = useSesionDetalles();
  const { actualizarSesion, actualizando: actualizandoSesion } =
    useActualizarSesion();
  const { eliminarSesion, eliminando: eliminandoSesion } = useEliminarSesion();

  const handleViewSessionDetails = (session: any) => {
    setSelectedSessionForDetails(session);
    setShowDetailsModal(true);
    obtenerSesion({
      variables: { id: session.id || String(session.databaseId) },
    });
  };

  const handleExportSession = (session: any) => {
    setSelectedSessionForExport(session);
    setShowExportModal(true);
    obtenerSesion({
      variables: { id: session.id || String(session.databaseId) },
    });
  };

  const { updateClinicalNotes, loading: updatingNotes } =
    useActualizarNotasClinicas();

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
    } catch (error: any) {
      toast.error(error?.message || "Error al actualizar notas clínicas");
    }
  };

  const handleQuestionnaireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario?.databaseId || !paciente?.id) return;

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
          assignedToId: usuario.databaseId,
          assignedById: usuario.databaseId,
          patientId: paciente.id,
        });
        const newId = result.data?.assignForm?.assignment?.id;
        if (!newId) throw new Error("No se pudo crear la asignación");
        assignmentId = newId;
      }

      await submitFullForm({ assignmentId: assignmentId as string, responses });
      setMostrarCuestionario(false);
      toast.success("Cuestionario guardado correctamente");
    } catch (error: any) {
      toast.error(error?.message || "Error al guardar el cuestionario");
    }
  };

  const handleViewAIAnalysis = (
    sessionId: string | number,
    mode: "list" | "charts",
  ) => {
    setSelectedSessionForAI(String(sessionId));
    setAiViewMode(mode);
  };

  const handleEditSession = (session: SessionData) => {
    setSelectedSession(session);
    setEditedNotes((session.notes as string) || "");
    setShowEditSessionModal(true);
  };

  const handleSaveSessionEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession?.id && !selectedSession?.databaseId) return;
    const sessionId = selectedSession.id || String(selectedSession.databaseId);
    try {
      await actualizarSesion(sessionId, { notes: editedNotes });
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

    const escalas: InformeClinicoDTO["escalas"] = [];
    if (eriResults.length) {
      escalas.push({
        nombre: "ERI",
        etiqueta: "Escala de Regulación Emocional",
        puntuaciones: eriResults.map((e: any) => ({
          sesion: new Date(e.evaluatedAt).toLocaleDateString("es-ES"),
          valor: e.totalScore,
        })),
      });
    }
    if (cimResults.length) {
      escalas.push({
        nombre: "CIM",
        etiqueta: "Cambio en la Identidad Musical",
        puntuaciones: cimResults.map((e: any) => ({
          sesion: new Date(e.evaluatedAt).toLocaleDateString("es-ES"),
          valor: e.totalScore,
        })),
      });
    }
    if (dataDemuca?.length) {
      escalas.push({
        nombre: "DEMUCA",
        etiqueta: "Detección de Musicoterapia",
        puntuaciones: dataDemuca.map((e: any) => ({
          sesion: new Date(e.evaluatedAt).toLocaleDateString("es-ES"),
          valor: e.totalScore,
        })),
      });
    }

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
        sesiones: (sesiones ?? []).map((s: any) => ({
          numero: s.sessionNumber ?? s.numeroSesion ?? 0,
          fecha: s.sessionDate ?? s.fecha ?? "",
          terapeuta: s.therapist?.fullname ?? s.terapeuta ?? "",
          duracion: s.durationMinutes ? `${s.durationMinutes} min` : "",
          estado: s.sessionStatus ?? s.estado ?? "",
          notas: s.notes ?? "",
        })),
        escalas,
      },
    ];
  }, [paciente, dataEri, dataCIM, dataDemuca, sesiones]);

  const informePdfExporter: Exporter<InformeClinicoDTO> = {
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
  };

  const informeWordExporter: Exporter<InformeClinicoDTO> = {
    id: "word",
    label: "Exportar Word",
    color: "#2b5797",
    async execute(data, _columns, fileName) {
      await generarInformeClinicoWord(data, fileName);
    },
  };

  const exporters = useMemo(
    () => [informePdfExporter, informeWordExporter],
    [],
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
          setMostrarCuestionario(true);
          setFormValues(valoresIniciales);
        }}
        onBack={() => router.push("/dashboard/expedientes")}
        onExport={() => setMostrarExportarClinico(true)}
      />

      <div className="grid lg:grid-cols-2 gap-8">
        <InformacionGeneral patient={paciente!} />
        <CuestionarioInicio preguntas={preguntasNormalizadas!} />
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <Search size={20} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white serif">
            Análisis Inteligente DEMUCA
            <span className="text-purple-500 italic"> General</span>
          </h2>
        </div>
        <AnalisDemuca dataDemuca={dataDemuca ?? []} />
      </div>

      {/*<EriCimTablas eriData={dataEri?.scaleEvaluations} cimData={dataCIM?.scaleEvaluations}/>*/}

      {/* Inyección del componente gráfico mejorado */}
      <GraficoEvolucion progressData={datosEscalas} />
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

      {/* Modal: Actualizar Información Clínica */}
      <Modal
        isOpen={mostrarFormularioClinico}
        onClose={() => setMostrarFormularioClinico(false)}
        title="Actualizar Información Clínica"
      >
        <FormularioClinico
          paciente={paciente}
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
            formatter: (v) => (v as any)?.nombre || "",
          },
          {
            key: "sesiones",
            label: "Sesiones",
            formatter: (v) => String((v as any)?.length || 0),
          },
          {
            key: "escalas",
            label: "Escalas",
            formatter: (v) => String((v as any)?.length || 0),
          },
        ]}
        exporters={exporters}
      />

      {/* Modal: Análisis de IA */}
      <Modal
        isOpen={selectedSessionForAI !== null}
        onClose={() => setSelectedSessionForAI(null)}
        title="Análisis de Inteligencia Artificial"
        maxWidth="max-w-5xl"
      >
        {selectedSessionForAI && (
          <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-center text-gray-500 py-8">
              Componente AIAnalysisView en desarrollo para la sesión{" "}
              {selectedSessionForAI}
              (modo: {aiViewMode})
            </p>
          </div>
        )}
      </Modal>

      {/* Modal: Editar Notas de Sesión */}
      <Modal
        isOpen={showEditSessionModal}
        onClose={() => setShowEditSessionModal(false)}
        title={`Editar Notas de Sesión`}
      >
        <form onSubmit={handleSaveSessionEdit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Notas Clínicas
            </label>
            <textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
              placeholder="Escribe las observaciones clínicas aquí..."
            />
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
                  {(sesionDetallada as any).therapist?.fullname ||
                    "No asignado"}
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
                      (r: any, idx: number) => (
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
                      (i: any, idx: number) => (
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
                        {sesionDetallada.sessionPlanSteps.map((s: any) => (
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
                        ))}
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
                    {sesionDetallada.scaleEvaluations.map((evalData: any) => (
                      <div
                        key={evalData.id}
                        className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200/50 dark:border-zinc-800/80 space-y-2"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800/60 pb-2">
                          <span className="text-sm font-bold dark:text-white font-sans">
                            {evalData.scale?.name || "Escala"}
                          </span>
                          <span className="text-xs font-extrabold text-[#008080] bg-teal-500/10 px-2 py-1 rounded-full font-sans">
                            Puntuación: {evalData.totalScore}/10
                          </span>
                        </div>

                        <div className="space-y-1 pt-1">
                          {evalData.subscaleResponses &&
                            evalData.subscaleResponses.map(
                              (r: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex justify-between text-xs text-gray-500 font-sans"
                                >
                                  <span>{r.subscale?.name || "Subescala"}</span>
                                  <span className="font-semibold">
                                    {r.score} (máx: {r.subscale?.maxValue || 10}
                                    )
                                  </span>
                                </div>
                              ),
                            )}
                          {evalData.valueResponses &&
                            evalData.valueResponses.map(
                              (v: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex justify-between text-xs text-gray-500 font-sans"
                                >
                                  <span>
                                    {v.scaleValue?.label || "Indicador"}
                                  </span>
                                  <span className="font-semibold">
                                    {v.scaleValue?.value || "—"}
                                  </span>
                                </div>
                              ),
                            )}
                        </div>
                      </div>
                    ))}
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
                      (formAssign: any, assignIdx: number) => (
                        <div
                          key={assignIdx}
                          className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200/50 dark:border-zinc-800/80 space-y-3"
                        >
                          <div className="border-b border-slate-200 dark:border-zinc-800/60 pb-2 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-400 font-sans">
                              Respuestas del Cuestionario
                            </span>
                            <span className="text-[10px] font-bold text-[#008080] bg-teal-500/10 px-2 py-0.5 rounded-full font-sans">
                              {Math.round(formAssign.completionRatio * 100)}%
                              Completado
                            </span>
                          </div>

                          <div className="space-y-3">
                            {formAssign.responses &&
                              formAssign.responses.map(
                                (r: any, idx: number) => (
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
                      ),
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
