"use client";

import React, {useState, useCallback, useMemo, useEffect, useRef} from "react";
import {
    useTemporizador,
    useGrabacion,
    VistaCamara,
    WorkspaceSesion,
} from "@/features/sesion-en-progreso";
import {useSesionActivaStore} from "@/entities/sesion";
import {usePlanesTratamiento} from "@/entities/plan-tratamiento";
import {useRecursosDigitales} from "@/entities/recurso";
import {useEscalas} from "@/entities/evaluacion";
import {useFormularios} from "@/entities/formulario";
import {useInventario} from "@/entities/inventario";
import {
    AlertCircle,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Video,
    Mic,
    Square,
} from "lucide-react";
import {useRouter} from "next/navigation";
import {ConfirmModal} from "@/shared/ui/ConfirmModal";
import {toast} from "sonner";
import {motion} from "motion/react";
import {useSesionConfigStore} from "@/shared/model/useSesionConfigStore";
import {alertarFinSesion} from "@/shared/lib/utils/alarmaDuracion";
import {SessionHeader} from "@/views/sesion-en-progreso/ui/components/SessionHeader";
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

type TabId = "plan" | "notas" | "recursos" | "evaluacion";

export const SesionEnProgresoPage = () => {
    const router = useRouter();
    const {sesion, limpiarSesion} = useSesionActivaStore();
    const [isActive, setIsActive] = useState(true);
    const {segundos, formatearTiempo} = useTemporizador(!!sesion && isActive, sesion?.inicio ? new Date(sesion.inicio) : undefined);
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

    const duracionSesion = useSesionConfigStore((s) => s.duracionSesion);

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
        setFormResponses((prev) => ({...prev, [key]: value}));
    }, []);

    const toggleRecording = useCallback(() => {
        if (grabacion.estaGrabando) {
            grabacion.detenerGrabacion();
        } else {
            grabacion.iniciarGrabacion();
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

    const handleFinalizar = async () => {
        try {
            grabacion.detenerGrabacion();
            limpiarSesion();
            toast.success("Sesión guardada exitosamente");
            router.push("/dashboard/sesiones");
        } catch {
            toast.error("Error al guardar la sesión");
        }
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
                    "4": "evaluacion",
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
                    "4": "evaluacion",
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
    }, [insertarMarcaTiempo, marcarPasoAnterior]);

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

    if (!sesion) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <div
                    className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
                    <AlertCircle size={40}/>
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
                {grabacion.estaGrabando ? <Mic size={20}/> : <Video size={20}/>}
            </div>
            <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Sesión
                </p>
                <p className="text-lg font-mono font-bold dark:text-white tabular-nums">
                    {formatearTiempo(segundos)}
                </p>
                {duracionSesion > 0 && tiempoRestante <= 300 && tiempoRestante > 0 && (
                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${
                        tiempoRestante <= 120
                            ? "text-red-500"
                            : "text-amber-500"
                    }`}>
                        {tiempoRestante <= 60
                            ? `${tiempoRestante}s`
                            : `Faltan ${Math.ceil(tiempoRestante / 60)} min`}
                    </p>
                )}
            </div>
            {grabacion.estaGrabando && (
                <div className="flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"/>
                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">
            REC
          </span>
                </div>
            )}
        </div>
    );

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
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
                        animate={{width: ["0%", "100%"]}}
                        transition={{repeat: Infinity, duration: 1.5, ease: "easeInOut"}}
                    />
                </div>
            )}

            {errorGeneral && (
                <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border-b border-red-500/20">
                    <AlertCircle size={16} className="text-red-500 shrink-0"/>
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
                        },
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
                                    <ChevronLeft size={18}/>
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
                                <Video size={22}/>
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
                                    <ChevronRight size={18}/>
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
                                    <ChevronLeft/>
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
                                        <Square fill="currentColor"/>
                                    ) : (
                                        <Mic/>
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
                            <Loader2 size={32} className="animate-spin text-[#008080]"/>
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
