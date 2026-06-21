"use client";

import {HeaderPaciente} from "@/entities/paciente/ui/headerPaciente";
import {use, useState, useEffect, useMemo} from "react";
import {useActualizarNotasClinicas, usePacienteDetalles} from "@/entities/paciente";
import {InformacionGeneral} from "@/entities/paciente/ui/InformacionGeneral";
import {CuestionarioInicio} from "@/entities/paciente/ui/CuestionarioInicio";
import {GraficoEvolucion} from "@/entities/paciente/ui/GraficoEvolucion";
import {useRouter} from "next/navigation";
import {Search} from "lucide-react";
import {useObtenerProgresoEscala} from "@/entities/paciente/api/useObtenerProgresoEscala";
import AnalisDemuca from "@/entities/paciente/ui/AnalisDemuca";
import {EriCimTablas} from "@/entities/paciente/ui/EriCimTablas";
import {HistorialSesiones} from "@/entities/sesion/ui/HistorialSesiones";
import {useObtenerProgresoSubEscala} from "@/entities/paciente/api/useObtenerProgresoSubEscala";
import {useCiclos} from "@/entities/sesion";
import type {FormularioClinicoDataSchema} from "@/features/gestion-paciente/model/FormularioClinicoData.schema";

type SessionData = Record<string, unknown> & {
    id?: string;
    databaseId?: number;
    notes?: string;
};
import Modal from "@/shared/ui/components/Modal";
import {FormularioClinico} from "@/features/gestion-paciente/ui/FormularioClinico";
import {ConfirmModal} from "@/shared/ui/ConfirmModal";
import {toast} from "sonner";
import {useAuthStore} from "@/shared/model/useAuthStore";
import {useFormulario, useAsignacionesFormulario, useSubmitFullForm, useAssignForm} from "@/entities/formulario";
import ViewForm from "@/entities/formulario/ui/viewForm";
import {useObtenerRespuestaFormulario} from "@/entities/formulario/api/useObtenerRespuestaFormulario";
import GenericExportModal, {Exporter} from "@/shared/ui/GenericExportModal";
import {generarInformeClinicoPDF, generarInformeClinicoWord} from "@/entities/informe-clinico";
import type {InformeClinicoDTO} from "@/entities/informe-clinico";

interface RouteParams {
    id: string;
    value?: string;
}

export interface ExpedientePageProps {
    params: Promise<RouteParams>;
}

export default function ExpedientePage({params}: ExpedientePageProps) {
    const {id} = use(params);
    const idPaciente = decodeURIComponent(id);

    // Obtenemos los datos de ambas escalas de manera independiente
    const {data: dataEri} = useObtenerProgresoEscala({
        patientId: idPaciente,
        escalaId: "2",
    });
    const {data: dataCIM} = useObtenerProgresoEscala({
        patientId: idPaciente,
        escalaId: "3",
    });
    const {data: dataDemuca} = useObtenerProgresoSubEscala({
        patientId: idPaciente,
        escalaId: "1",
    });
    const {preguntasNormalizadas, idAssigmente} = useObtenerRespuestaFormulario({patientId: idPaciente, formId: "1"});

    const {formulario, cargando: cargandoForm} = useFormulario("1")
    const {asignaciones} = useAsignacionesFormulario(idPaciente)
    const {submitFullForm, enviando} = useSubmitFullForm()
    const {assignForm, asignando: asignandoForm} = useAssignForm()

    const asignacion = asignaciones?.[0]

    const valoresIniciales = asignacion?.responses?.reduce<Record<string, string>>(
        (acc, r) => {
            if (r?.question?.id && r?.response) {
                acc[r.question.id] = r.response;
            }
            return acc;
        },
        {},
    ) ?? {};

    const [formValues, setFormValues] = useState<Record<string, string>>(valoresIniciales)

    const [sessionsPage, setSessionsPage] = useState<number | undefined>(undefined);
    const {sesiones, currentPage, totalPages, ciclo} = useCiclos({pacienteId: idPaciente, page: sessionsPage});

    const {paciente, cargando, refetch} = usePacienteDetalles(idPaciente);
    const router = useRouter();

    const [mostrarFormularioClinico, setMostrarFormularioClinico] = useState(false);
    const [mostrarCuestionario, setMostrarCuestionario] = useState(false);
    const [mostrarExportarClinico, setMostrarExportarClinico] = useState(false);

    const [selectedSessionForAI, setSelectedSessionForAI] = useState<string | null>(null);
    const [aiViewMode, setAiViewMode] = useState<"list" | "charts">("list");

    const [showEditSessionModal, setShowEditSessionModal] = useState(false);
    const [editedNotes, setEditedNotes] = useState("");
    const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);

    const [showDeleteSessionConfirm, setShowDeleteSessionConfirm] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

    const {updateClinicalNotes, loading: updatingNotes,} = useActualizarNotasClinicas();

    const {usuario} = useAuthStore()

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

        const responses = Object.entries(formValues).map(([questionId, responseText]) => ({
            questionId,
            responseText,
        }));

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

            await submitFullForm({assignmentId, responses});
            setMostrarCuestionario(false);
            toast.success("Cuestionario guardado correctamente");
        } catch (error: any) {
            toast.error(error?.message || "Error al guardar el cuestionario");
        }
    };

    const handleViewAIAnalysis = (sessionId: number, mode: "list" | "charts") => {
        setSelectedSessionForAI(String(sessionId));
        setAiViewMode(mode);
    };

    const handleEditSession = (session: SessionData) => {
        setSelectedSession(session);
        setEditedNotes((session.notes as string) || "");
        setShowEditSessionModal(true);
    };

    const handleSaveSessionEdit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Guardar edición de sesión:", selectedSession?.id, editedNotes);
        setShowEditSessionModal(false);
        setSelectedSession(null);
    };

    const handleDeleteSession = () => {
        if (sessionToDelete) {
            console.log("Eliminar sesión:", sessionToDelete);
            setSessionToDelete(null);
        }
    };

    // ── Preparar datos para exportación ──
    const informeClinicoData = useMemo((): InformeClinicoDTO[] => {
        if (!paciente) return [];

        const escalas: InformeClinicoDTO["escalas"] = [];
        if (dataEri?.scaleEvaluations?.length) {
            escalas.push({
                nombre: "ERI",
                etiqueta: "Escala de Regulación Emocional",
                puntuaciones: dataEri.scaleEvaluations.map((e: any) => ({
                    sesion: new Date(e.evaluatedAt).toLocaleDateString("es-ES"),
                    valor: e.totalScore,
                })),
            });
        }
        if (dataCIM?.scaleEvaluations?.length) {
            escalas.push({
                nombre: "CIM",
                etiqueta: "Cambio en la Identidad Musical",
                puntuaciones: dataCIM.scaleEvaluations.map((e: any) => ({
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

        return [{
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
        }];
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

    const exporters = useMemo(() => [informePdfExporter, informeWordExporter], []);

    // Agrupamos de forma segura. Si alguno no ha cargado, enviamos matriz vacía [].
    const datosEscalas =
        dataEri?.scaleEvaluations && dataCIM?.scaleEvaluations
            ? [dataEri.scaleEvaluations, dataCIM.scaleEvaluations]
            : [];

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
                <InformacionGeneral patient={paciente!}/>
                <CuestionarioInicio preguntas={preguntasNormalizadas!}/>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Search size={20}/>
                    </div>
                    <h2 className="text-2xl font-bold dark:text-white serif">
                        Análisis Inteligente DEMUCA
                        <span className="text-purple-500 italic"> General</span>
                    </h2>
                </div>
                <AnalisDemuca dataDemuca={dataDemuca!}/>
            </div>

            {/*<EriCimTablas eriData={dataEri?.scaleEvaluations} cimData={dataCIM?.scaleEvaluations}/>*/}
            
            {/* Inyección del componente gráfico mejorado */}
            <GraficoEvolucion progressData={datosEscalas}/>
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
            />

            {/* Modal: Actualizar Información Clínica */}
            <Modal isOpen={mostrarFormularioClinico} onClose={() => setMostrarFormularioClinico(false)}
                   title="Actualizar Información Clínica">
                <FormularioClinico
                    paciente={paciente}
                    alEnviar={handleClinicalNotesSubmit}
                    alCancelar={() => setMostrarFormularioClinico(false)}
                />
            </Modal>

            {/* Modal: Cuestionario de Ingreso */}
            <Modal isOpen={mostrarCuestionario} onClose={() => {
                setMostrarCuestionario(false);
                setFormValues(valoresIniciales);
            }}
                   title="Cuestionario de Ingreso">
                <form onSubmit={handleQuestionnaireSubmit} className="space-y-6">
                    {formulario ? (
                        <ViewForm
                            form={formulario}
                            values={formValues}
                            onChange={(questionId, value) =>
                                setFormValues((prev) => ({...prev, [questionId]: value}))
                            }
                        />
                    ) : (
                        <p className="text-center text-gray-500 py-8">Cargando formulario...</p>
                    )}
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => setMostrarCuestionario(false)}
                                className="px-6 py-2 border rounded-xl">Cancelar
                        </button>
                        <button type="submit" disabled={enviando || asignandoForm}
                                className="px-6 py-2 bg-[#008080] text-white rounded-xl disabled:opacity-50">{enviando || asignandoForm ? "Guardando..." : "Guardar"}</button>
                    </div>
                </form>
            </Modal>

            {/* Modal: Exportar Informe Clínico */}
            <GenericExportModal<InformeClinicoDTO>
                isOpen={mostrarExportarClinico}
                onClose={() => setMostrarExportarClinico(false)}
                title="Vista Previa de Expediente Clínico"
                data={informeClinicoData}
                fileName={`informe_${paciente?.name?.replace(/\s+/g, '_') || 'paciente'}`}
                columns={[
                    {key: "paciente", label: "Paciente", formatter: (v) => (v as any)?.nombre || ""},
                    {key: "sesiones", label: "Sesiones", formatter: (v) => String((v as any)?.length || 0)},
                    {key: "escalas", label: "Escalas", formatter: (v) => String((v as any)?.length || 0)},
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
                            Componente AIAnalysisView en desarrollo para la sesión {selectedSessionForAI}
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
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Notas
                            Clínicas</label>
                        <textarea
                            value={editedNotes}
                            onChange={(e) => setEditedNotes(e.target.value)}
                            rows={8}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
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
        </div>
    );
}
