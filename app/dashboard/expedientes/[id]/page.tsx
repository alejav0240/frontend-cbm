"use client";

import {HeaderPaciente} from "@/entities/paciente/ui/headerPaciente";
import {use, useState} from "react";
import {usePacienteDetalles} from "@/entities/paciente";
import {InformacionGeneral} from "@/entities/paciente/ui/InformacionGeneral";
import {CuestionarioInicio} from "@/entities/paciente/ui/CuestionarioInicio";
import {GraficoEvolucion} from "@/entities/paciente/ui/GraficoEvolucion";
import {useRouter} from "next/navigation";
import {Search} from "lucide-react";
import {useObtenerProgresoEscala} from "@/entities/paciente/api/useObtenerProgresoEscala";
import AnalisDemuca from "@/entities/paciente/ui/AnalisDemuca";
import {HistorialSesiones} from "@/entities/sesion/ui/HistorialSesiones";
import {useObtenerProgresoSubEscala} from "@/entities/paciente/api/useObtenerProgresoSubEscala";
import {useCiclos, useSesiones} from "@/entities/sesion";
import Modal from "@/shared/ui/components/Modal";
import {FormularioClinico} from "@/features/gestion-paciente/ui/FormularioClinico";

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

    const [sessionsPage, setSessionsPage] = useState<number | undefined>(undefined);
    const {sesiones, currentPage, totalPages, ciclo} = useCiclos({pacienteId: idPaciente, page: sessionsPage});

    console.log(sesiones);

    const {paciente, cargando} = usePacienteDetalles(idPaciente);
    const router = useRouter();

    const [mostrarFormularioClinico, setMostrarFormularioClinico] = useState(false);
    const [mostrarCuestionario, setMostrarCuestionario] = useState(false);
    const [mostrarExportarClinico, setMostrarExportarClinico] = useState(false);

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
                onShowQuestionnaire={() => setMostrarCuestionario(true)}
                onBack={() => router.push("/dashboard/expedientes")}
                onExport={() => setMostrarExportarClinico(true)}
            />

            <div className="grid lg:grid-cols-2 gap-8">
                <InformacionGeneral patient={paciente!}/>
                <CuestionarioInicio patient={paciente!}/>
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

            {/* Inyección del componente gráfico mejorado */}
            <GraficoEvolucion progressData={datosEscalas}/>
            <HistorialSesiones
                patientSessions={sesiones ?? []}
                currentPage={currentPage}
                onPageChange={setSessionsPage}
                cicloNumber={ciclo}
                totalPages={totalPages}
                onViewAIAnalysis={() => {
                }}
                onEditSession={() => {
                }}
                onDeleteSession={() => {
                }}
            />


            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Actualizar Información Clínica">
                <FormularioClinico
                    clinicalForm={clinicalForm}
                    setClinicalForm={setClinicalForm}
                    alEnviar={handleUpdateClinicalInfo}
                    alCancelar={() => setShowForm(false)}
                />
            </Modal>
        </div>
    );
}
