"use client";

import React, { useMemo } from "react";
import { Modal } from "@/shared/ui/components/Modal";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import {
  DatosFormularioPaciente,
  generarPacientesExcel,
  generarPacientesPDF,
  PacienteExportarFila,
  PacienteNormalizado,
} from "@/entities/paciente";
import { FormularioCrearPaciente } from "./FormularioCrearPaciente";
import GenericExportModal, { Exporter } from "@/shared/ui/GenericExportModal";
import { toast } from "sonner";
import { FormularioClinico } from "@/features/gestion-paciente/ui/FormularioClinico";
import { FormularioClinicoDataSchema } from "@/features/gestion-paciente/model/FormularioClinicoData.schema";

interface ModalesPacienteProps {
  mostrarFormulario: boolean;
  alCerrarFormulario: () => void;
  alEnviarFormulario: (datos: DatosFormularioPaciente) => void;
  estaCreando: boolean;
  mostrarConfirmarEliminar: boolean;
  alCerrarConfirmarEliminar: () => void;
  alConfirmarEliminar: () => void;
  mostrarExportar: boolean;
  alCerrarExportar: () => void;
  listaPacientes: PacienteNormalizado[];
  mostrarFormularioClinico: boolean;
  alCerrarFormularioClinico: () => void;
  alEnviarFormularioClinico: (datos: FormularioClinicoDataSchema) => void;
  pacienteSeleccionado: any;
}

export const ModalesPaciente = ({
  mostrarFormulario,
  alCerrarFormulario,
  alEnviarFormulario,
  estaCreando,
  mostrarConfirmarEliminar,
  alCerrarConfirmarEliminar,
  alConfirmarEliminar,
  mostrarExportar,
  alCerrarExportar,
  listaPacientes,
  mostrarFormularioClinico,
  alCerrarFormularioClinico,
  alEnviarFormularioClinico,
  pacienteSeleccionado,
}: ModalesPacienteProps) => {
  const datosExportacion = useMemo((): PacienteExportarFila[] => {
    return listaPacientes.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      cedula: p.cedula,
      diagnostico: p.diagnosis,
      tutor: (p.tutor as any)?.fullName ?? p.tutor?.firstName ?? "Sin Tutor",
      telefonoTutor: p.tutor?.celular ?? "Sin Telefono Tutor",
      emailTutor: p.tutor?.email ?? "Sin Email",
      fechaRegistro: p?.createdAt
        ? new Date(p.createdAt).toLocaleDateString()
        : "Sin Fecha",
      edad: p.birthDate
        ? String(
            new Date().getFullYear() - new Date(p.birthDate).getFullYear(),
          ) + " años"
        : "No Registrado",
      residencia: p?.residence ?? "Sin Residencia",
      status: p.status,
    }));
  }, [listaPacientes]);

  const pacientePDFExporter: Exporter<PacienteExportarFila> = {
    id: "pdf",
    label: "Exportar PDF",
    async execute(data, columns, fileName) {
      const doc = await generarPacientesPDF(data);
      doc.save(`${fileName}_${Date.now()}.pdf`);
    },
    async preview(data) {
      const doc = await generarPacientesPDF(data);
      return doc.output("blob");
    },
  };

  const pacienteExcelExporter: Exporter<PacienteExportarFila> = {
    id: "excel",
    label: "Exportar Excel",
    async execute(data) {
      await generarPacientesExcel(data);
    },
  };

  const exporters = useMemo(
    () => [pacientePDFExporter, pacienteExcelExporter],
    [],
  );

  return (
    <>
      <Modal
        isOpen={mostrarFormulario}
        onClose={alCerrarFormulario}
        title="Registrar Nuevo Paciente"
      >
        <FormularioCrearPaciente
          alEnviar={alEnviarFormulario}
          alCancelar={alCerrarFormulario}
          estaCreando={estaCreando}
        />
      </Modal>

      <Modal
        isOpen={mostrarFormularioClinico}
        onClose={alCerrarFormularioClinico}
        title="Completar Registro Clínico"
      >
        <FormularioClinico
          alEnviar={alEnviarFormularioClinico}
          alCancelar={alCerrarFormularioClinico}
          paciente={pacienteSeleccionado}
        />
      </Modal>

      <ConfirmModal
        isOpen={mostrarConfirmarEliminar}
        onClose={alCerrarConfirmarEliminar}
        onConfirm={alConfirmarEliminar}
        title="Eliminar Paciente"
        message="¿Estás seguro de que deseas eliminar este paciente? Esta acción no se puede deshacer."
        confirmLabel="Eliminar Paciente"
      />

      <GenericExportModal<PacienteExportarFila>
        title="Exportar usuarios"
        isOpen={mostrarExportar}
        onClose={alCerrarExportar}
        data={datosExportacion}
        fileName="usuarios"
        columns={[
          {
            key: "nombre",
            label: "Nombre",
          },
          {
            key: "cedula",
            label: "Carnet",
          },
        ]}
        filters={[
          {
            key: "status",
            label: "Estado",
            type: "select",
            options: [
              {
                value: "active",
                label: "Activo",
              },
            ],
          },
        ]}
        exporters={exporters}
      />
      {/* ExportModal pendiente de configuración de servicios de PDF/Excel */}
    </>
  );
};
