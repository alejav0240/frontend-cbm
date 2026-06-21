import { useMutation } from "@apollo/client/react";
import { ELIMINAR_PACIENTE, usePacientes } from "@/entities/paciente";

export function useEliminarPaciente() {
  const { refetch } = usePacientes();
  const [deleteMutation] = useMutation<{
    deletePatient: { success: boolean; message: string };
  }>(ELIMINAR_PACIENTE, {
    onCompleted: () => refetch(),
  });

  const deletePatient = (id: string) => deleteMutation({ variables: { id } });

  return {
    deletePatient,
    deleteMutation,
  };
}
