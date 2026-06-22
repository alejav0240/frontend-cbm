"use client";

import React, { useState, useMemo } from "react";
import Modal from "@/shared/ui/components/Modal";
import { CycleForm } from "./CycleForm";
import { useCreateCycle } from "@/entities/sesion";
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
      <ContenidoFormulario onClose={onClose} onCicloCreado={onCicloCreado} />
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

  const [patientName, setPatientName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [numSessions, setNumSessions] = useState("4");
  const [therapist, setTherapist] = useState("");

  const { pacientes, cargando: cargandoP } = usePacientes({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !therapist || !startDate) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    try {
      const { data } = await createCycle(
        patientName,
        therapist,
        startDate,
        parseInt(numSessions, 10),
      );
      if (data?.createCycle?.success) {
        toast.success("Ciclo creado exitosamente");
        onClose();
        setPatientName("");
        setStartDate("");
        setNumSessions("4");
        setTherapist("");
        onCicloCreado();
      } else {
        toast.error(data?.createCycle?.message || "Error al crear el ciclo");
      }
    } catch {
      toast.error("Error al crear el ciclo");
    }
  };

  return (
    <CycleForm
      patientName={patientName}
      setPatientName={setPatientName}
      startDate={startDate}
      setStartDate={setStartDate}
      numSessions={numSessions}
      setNumSessions={setNumSessions}
      therapist={therapist}
      setTherapist={setTherapist}
      patientOptions={patientOptions}
      therapistOptions={therapistOptions}
      onSearchTherapist={undefined}
      isLoadingTherapists={cargandoT}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
};
