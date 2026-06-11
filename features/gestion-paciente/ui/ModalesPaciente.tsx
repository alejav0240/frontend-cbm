"use client";

import React from "react";
import { Modal } from "@/shared/ui/components/Modal";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import { PDFExportModal } from "@/shared/ui/PDFExportModal";
import { PacienteNormalizado } from "@/entities/paciente";
import { FormularioCrearPaciente } from "./FormularioCrearPaciente";

interface ModalesPacienteProps {
  mostrarFormulario: boolean;
  alCerrarFormulario: () => void;
  alEnviarFormulario: (datos: any) => void;
  estaCreando: boolean;
  mostrarConfirmarEliminar: boolean;
  alCerrarConfirmarEliminar: () => void;
  alConfirmarEliminar: () => void;
  mostrarExportar: boolean;
  alCerrarExportar: () => void;
  listaPacientes: PacienteNormalizado[];
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
}: ModalesPacienteProps) => {
  return (
    <>
      <Modal isOpen={mostrarFormulario} onClose={alCerrarFormulario} title="Registrar Nuevo Cliente">
        <FormularioCrearPaciente alEnviar={alEnviarFormulario} alCancelar={alCerrarFormulario} estaCreando={estaCreando} />
      </Modal>

      <ConfirmModal
        isOpen={mostrarConfirmarEliminar}
        onClose={alCerrarConfirmarEliminar}
        onConfirm={alConfirmarEliminar}
        title="Eliminar Paciente"
        message="¿Estás seguro de que deseas eliminar este paciente? Esta acción no se puede deshacer."
        confirmLabel="Eliminar Paciente"
      />

      {/* ExportModal pendiente de configuración de servicios de PDF/Excel */}
    </>
  );
};
