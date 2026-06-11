"use client";

import React, { useState } from "react";
import { 
  usePacientes, 
  usePacienteCrecimiento, 
  usePacienteSeleccionadoStore, 
  generarPacientesPDF, 
  generarPacientesExcel, 
  PacienteExportarFila 
} from "@/entities/paciente";
import { EstadisticasPacientes } from "@/widgets/estadisticas-pacientes";
import { TablaPacientes } from "@/widgets/tabla-pacientes";
import { FiltrarPacientes } from "@/features/filtrar-pacientes";
import { ModalesPaciente } from "@/features/gestion-paciente";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { Plus, Download } from "lucide-react";
import { toast } from "sonner";

export const PacientesPage = () => {
  const router = useRouter();
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const busquedaDebounced = useDebounce(terminoBusqueda, 500);

  const { pacientes, total, paginas, cargando, refetch } = usePacientes({
    search: busquedaDebounced,
    page: paginaActual,
    status: filtroEstado,
  });

  const { datosCrecimiento } = usePacienteCrecimiento();
  const { setPaciente } = usePacienteSeleccionadoStore();

  // Mapeador/Adaptador a DTO de Exportación
  const prepararDatosExportacion = (): PacienteExportarFila[] => {
    return pacientes.map(p => ({
      id: p.id,
      nombre: p.nombre,
      cedula: p.cedula,
      diagnostico: p.diagnosis,
      estado: p.status,
      tutor: p.tutor?.fullName,
      telefonoTutor: p.tutor?.celular,
    }));
  };

  const manejarExportarPDF = async () => {
    try {
      const filas = prepararDatosExportacion();
      const doc = await generarPacientesPDF(filas);
      doc.save(`reporte_pacientes_${Date.now()}.pdf`);
      toast.success("PDF generado exitosamente");
    } catch (err) {
      toast.error("Error al generar PDF");
    }
  };

  const manejarExportarExcel = async () => {
    try {
      const filas = prepararDatosExportacion();
      await generarPacientesExcel(filas);
      toast.success("Excel generado exitosamente");
    } catch (err) {
      toast.error("Error al generar Excel");
    }
  };

  // Estados de modales
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [pacienteAEliminar, setPacienteAEliminar] = useState<string | null>(null);

  const manejarVerPerfil = (id: string, nombre: string) => {
    setPaciente({ id, nombre });
    router.push(`/dashboard/expedientes/${id}`);
  };

  return (
    <div className="space-y-8">
      <EstadisticasPacientes totalPacientes={total} datosCrecimiento={datosCrecimiento} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Gestión de Pacientes</h1>
          <p className="text-gray-400 text-sm">Administra la información y el historial de tus pacientes</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white dark:bg-accent border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
            <button 
              onClick={manejarExportarPDF}
              className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-all border-r border-gray-100 dark:border-white/5"
            >
              PDF
            </button>
            <button 
              onClick={manejarExportarExcel}
              className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-all"
            >
              Excel
            </button>
          </div>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#008080] text-white rounded-2xl text-sm font-bold hover:bg-[#006666] transition-all shadow-lg shadow-[#008080]/20"
          >
            <Plus size={18} />
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

      <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        <TablaPacientes
          pacientes={pacientes}
          alVerPerfil={manejarVerPerfil}
          alEliminar={(id) => {
            setPacienteAEliminar(id);
            setMostrarEliminar(true);
          }}
          alCompletarClinico={() => {}}
        />
      </div>

      <ModalesPaciente
        mostrarFormulario={mostrarFormulario}
        alCerrarFormulario={() => setMostrarFormulario(false)}
        alEnviarFormulario={() => {}}
        estaCreando={false}
        mostrarConfirmarEliminar={mostrarEliminar}
        alCerrarConfirmarEliminar={() => setMostrarEliminar(false)}
        alConfirmarEliminar={() => {}}
        mostrarExportar={false}
        alCerrarExportar={() => {}}
        listaPacientes={pacientes}
      />
    </div>
  );
};
