import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useAuthStore } from "@/shared/model/useAuthStore";
import { OBTENER_PACIENTES_POR_USUARIO } from "./consultas";

export interface PacienteTutor {
  fullName: string;
  diagnosis: string | null;
  status: string;
  relation: string;
}

export const usePacientesTutor = () => {
  const { usuario } = useAuthStore();
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(0);

  const { data, loading, error } = useQuery(OBTENER_PACIENTES_POR_USUARIO, {
    variables: { id: usuario?.id ?? "" },
    skip: !usuario?.id,
  });

  const pacientes: PacienteTutor[] = useMemo(
    () =>
      (data?.userWithPatients?.patients ?? []).filter(
        (p: PacienteTutor) => p.relation === "tutor",
      ),
    [data],
  );

  const pacienteSeleccionado = pacientes[indiceSeleccionado] ?? null;

  const seleccionarPaciente = (indice: number) => {
    setIndiceSeleccionado(indice);
  };

  return {
    pacientes,
    pacienteSeleccionado,
    indiceSeleccionado,
    seleccionarPaciente,
    totalPacientes: data?.userWithPatients?.patientsCount ?? 0,
    cargando: loading,
    error,
  };
};
