"use client";

import React, { useMemo } from "react";
import Modal from "@/shared/ui/components/Modal";
import { CycleForm } from "./CycleForm";
import { useCreateCycle } from "@/entities/sesion";
import type { DatosFormularioCiclo } from "@/entities/sesion";
import { usePacientes } from "@/entities/paciente";
import { useUsuarios } from "@/entities/usuario";
import { toast } from "sonner";

interface CrearCicloModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCicloCreado: () => void;
}

export const CrearCicloModal = ({
  isOpen,
  onClose,
  onCicloCreado,
}: CrearCicloModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nuevo Ciclo Terapéutico"
    >
      <ContenidoFormulario
        key={String(isOpen)}
        onClose={onClose}
        onCicloCreado={onCicloCreado}
      />
    </Modal>
  );
};

const ContenidoFormulario = ({
  onClose,
  onCicloCreado,
}: {
  onClose: () => void;
  onCicloCreado: () => void;
}) => {
  const { createCycle } = useCreateCycle();

  const { pacientes } = usePacientes({
    search: "",
    pageSize: 20,
  });

  const patientOptions = useMemo(
    () =>
      pacientes.map((p) => ({
        value: p.id,
        label: `${p.nombre} — ${p.cedula || "Sin CI"}`,
      })),
    [pacientes],
  );

  const { usuarios: terapeutas, cargando: cargandoT } = useUsuarios({
    pagina: 1,
    pageSize: 50,
    nombreRol: "TERAPEUTA",
  });

  const therapistOptions = useMemo(
    () =>
      terapeutas.map((t) => ({
        value: t.id,
        label: t.fullName,
      })),
    [terapeutas],
  );

  const handleSubmit = async (data: DatosFormularioCiclo) => {
    try {
      const { data: result } = await createCycle(
        data.patientName,
        data.therapist,
        data.startDate,
        parseInt(data.numSessions, 10),
      );
      if (result?.createCycle?.success) {
        toast.success("Ciclo creado exitosamente");
        onClose();
        onCicloCreado();
      } else {
        toast.error(result?.createCycle?.message || "Error al crear el ciclo");
      }
    } catch {
      toast.error("Error al crear el ciclo");
    }
  };

  return (
    <CycleForm
      patientOptions={patientOptions}
      therapistOptions={therapistOptions}
      onSearchTherapist={undefined}
      isLoadingTherapists={cargandoT}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
};
