import { useMutation } from "@apollo/client/react";
import { ACTUALIZAR_PACIENTE, usePacientes } from "@/entities/paciente";
import {
  ActualizarPacienteMutation,
  ActualizarPacienteMutationVariables,
} from "@/shared/api/generated/graphql";

export function useActualizarPaciente() {
  const { refetch } = usePacientes();
  const [updateMutation] = useMutation<
    ActualizarPacienteMutation,
    ActualizarPacienteMutationVariables
  >(ACTUALIZAR_PACIENTE, {
    onCompleted: () => refetch(),
  });

  const updatePatient = (variables: ActualizarPacienteMutationVariables) =>
    updateMutation({ variables });

  return {
    updatePatient,
    updateMutation,
  };
}
