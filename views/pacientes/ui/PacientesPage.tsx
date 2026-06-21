"use client";

import React, {useState} from "react";
import {
    usePacientes,
    usePacienteCrecimiento,
    usePacienteSeleccionadoStore,
    DatosFormularioPaciente,
    useActualizarNotasClinicas,
    useActualizarPaciente,
    useEliminarPaciente,
    PuntoCrecimiento,
} from "@/entities/paciente";
import {EstadisticasPacientes} from "@/widgets/estadisticas-pacientes";
import {TablaPacientes} from "@/widgets/tabla-pacientes";
import {FiltrarPacientes} from "@/features/filtrar-pacientes";
import {ModalesPaciente} from "@/features/gestion-paciente";
import {useDebounce} from "@/shared/lib/hooks/useDebounce";
import {useRouter} from "next/navigation";
import {Plus, Download} from "lucide-react";
import {toast} from "sonner";
import {useCreatePaciente} from "@/entities/paciente/api/useCreatePaciente";
import {useAuthStore} from "@/shared/model/useAuthStore";
import {FormularioClinicoDataSchema} from "@/features/gestion-paciente/model/FormularioClinicoData.schema";

export const PacientesPage = () => {
    const router = useRouter();
    const [terminoBusqueda, setTerminoBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("Todos");
    const [paginaActual, setPaginaActual] = useState(1);
    const busquedaDebounced = useDebounce(terminoBusqueda, 500);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {pacientes, total, paginas, cargando, refetch} = usePacientes({
        search: busquedaDebounced,
        page: paginaActual,
        status: filtroEstado,
    });

    const {datosCrecimiento} = usePacienteCrecimiento();
    const {setPaciente} = usePacienteSeleccionadoStore();

    const {addPatient, loading} = useCreatePaciente();
    const {updateClinicalNotes, loading: updatingNotes} = useActualizarNotasClinicas();
    const {deletePatient} = useEliminarPaciente();

    // Estados de modales
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarEliminar, setMostrarEliminar] = useState(false);
    const [pacienteAEliminar, setPacienteAEliminar] = useState<string | null>(
        null,
    );
    const [mostrarExportar, setMostrarExportar] = useState(false);
    const [mostrarFormularioClinico, setMostrarFormularioClinico] =
        useState(false);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState<any>(null);

    const manejarVerPerfil = (id: string, nombre: string) => {
        setPaciente({id, nombre});
        router.push(`/dashboard/expedientes/${id}`);
    };

    const {usuario} = useAuthStore();

    const {updatePatient} = useActualizarPaciente();

    const handleFormSubmit = async (formData: DatosFormularioPaciente) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            if (!usuario?.databaseId) {
                toast.error("Sesión inválida. Por favor, reingresa.");
                return;
            }

            let imageUrl = "";
            if (formData.photo instanceof File) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", formData.photo);

                const uploadResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                if (!uploadResponse.ok) {
                    throw new Error("Error al subir la imagen");
                }

                const uploadData = await uploadResponse.json();
                imageUrl = uploadData.url;
            }

            await addPatient({
                authorId: usuario.databaseId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                ci: formData.idCard,
                birthDate: formData.dob,
                diagnosis: formData.diagnostico,
                residence: formData.residenciaActual,
                imageUrl: imageUrl,
                tutorName: formData.tutor,
                tutorCi: formData.ciTutor,
                tutorCelular: formData.tutorPhone,
                tutorEmail: formData.contactEmail,
                selectedDay: formData.selectedDay,
                selectedTime: formData.selectedTime,
            });
            // Aseguramos que el estado de la vista se actualiza
            setMostrarFormulario(false);

            // El refetch ya se dispara por onCompleted en el hook,
            // pero si currentPage ya era 1, el refetch() manual lo garantiza.
            await refetch();
            toast.success(`Paciente registrado correctamente`);
        } catch (error: any) {
            toast.error(error?.message || "Error al registrar el paciente");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClinicalNotesSubmit = async (
        formData: FormularioClinicoDataSchema,
    ) => {
        if (!pacienteSeleccionado || !usuario?.databaseId) return;

        try {
            await updateClinicalNotes(
                pacienteSeleccionado.id,
                String(usuario.databaseId),
                formData,
            );
            setMostrarFormularioClinico(false);
            await updatePatient({
                id: pacienteSeleccionado.databaseId,
                registrationComplete: true,
            });
            toast.success("Notas clínicas actualizadas correctamente");
            await refetch();
        } catch (error: any) {
            toast.error(error?.message || "Error al actualizar notas clínicas");
        }
    };

    const handleDelete = async () => {
        if (!pacienteAEliminar || !usuario?.databaseId) return;

        try {
            await String(usuario.databaseId);
            await deletePatient(pacienteAEliminar);
            toast.success("Paciente Eliminado correctamente");
            await refetch();
        } catch (error: any) {
            toast.error(error?.message || "Error al actualizar notas clínicas");
        }
    };

    const datosCrecimientoLimpios: PuntoCrecimiento[] = datosCrecimiento.filter(
        (item): item is PuntoCrecimiento =>
            item !== null && item.month !== null && item.total !== null,
    );

    return (
        <div className="space-y-8">
            <EstadisticasPacientes
                totalPacientes={total}
                datosCrecimiento={datosCrecimientoLimpios}
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">
                        Gestión de Pacientes
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Administra la información y el historial de tus pacientes
                    </p>
                </div>
                <div className="flex gap-3">
                    <div
                        className="flex bg-white dark:bg-accent border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
                        <button
                            onClick={() => setMostrarExportar(true)}
                            className="p-4 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                            <Download size={20}/>
                            <span className="hidden sm:inline">Exportar</span>
                        </button>
                    </div>
                    <button
                        onClick={() => setMostrarFormulario(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-[#008080] text-white rounded-2xl text-sm font-bold hover:bg-[#006666] transition-all shadow-lg shadow-[#008080]/20"
                    >
                        <Plus size={18}/>
                        Nuevo Paciente
                    </button>
                </div>
            </div>

            <FiltrarPacientes
                terminoBusqueda={terminoBusqueda}
                alCambiarBusqueda={setTerminoBusqueda}
                filtroEstado={filtroEstado}
                alCambiarEstado={setFiltroEstado}
            />

            <div
                className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
                <TablaPacientes
                    pacientes={pacientes}
                    alVerPerfil={manejarVerPerfil}
                    alEliminar={(id) => {
                        setPacienteAEliminar(id);
                        setMostrarEliminar(true);
                    }}
                    alCompletarClinico={(paciente) => {
                        setPacienteSeleccionado(paciente);
                        setMostrarFormularioClinico(true);
                    }}
                    totalPaginas={paginas}
                    paginaActual={paginaActual}
                    alCambiarPagina={setPaginaActual}
                />
            </div>

            <ModalesPaciente
                mostrarFormulario={mostrarFormulario}
                alCerrarFormulario={() => setMostrarFormulario(false)}
                alEnviarFormulario={handleFormSubmit}
                estaCreando={loading}
                mostrarConfirmarEliminar={mostrarEliminar}
                alCerrarConfirmarEliminar={() => setMostrarEliminar(false)}
                alConfirmarEliminar={handleDelete}
                mostrarExportar={mostrarExportar}
                alCerrarExportar={() => {
                    setMostrarExportar(false);
                }}
                listaPacientes={pacientes}
                mostrarFormularioClinico={mostrarFormularioClinico}
                alCerrarFormularioClinico={() => setMostrarFormularioClinico(false)}
                alEnviarFormularioClinico={handleClinicalNotesSubmit}
                pacienteSeleccionado={pacienteSeleccionado}
            />
        </div>
    );
};
