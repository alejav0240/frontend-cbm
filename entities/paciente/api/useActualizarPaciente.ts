import { useMutation } from "@apollo/client/react";
import { ACTUALIZAR_PACIENTE, usePacientes } from "@/entities/paciente";

export function useActualizarPaciente() {
  const { refetch } = usePacientes();
  const [updateMutation] = useMutation(ACTUALIZAR_PACIENTE, {
    onCompleted: () => refetch(),
  });

  const updatePatient = (variables: any) => updateMutation({ variables });

  return {
    updatePatient,
    updateMutation,
  };
}
