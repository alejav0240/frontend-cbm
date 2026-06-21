import { useMutation } from "@apollo/client/react";
import { CREAR_PACIENTE, usePacientes } from "@/entities/paciente";
import {
  CrearPacienteMutation,
  CrearPacienteMutationVariables,
} from "@/shared/api/generated/graphql";

export function useCreatePaciente() {
  const { refetch } = usePacientes();
  const [addMutation, { loading: isAdding }] = useMutation<
    CrearPacienteMutation,
    CrearPacienteMutationVariables
  >(CREAR_PACIENTE, {
    onCompleted: () => refetch(),
  });

  const addPatient = (variables: CrearPacienteMutationVariables) =>
    addMutation({ variables });

  return {
    addPatient,
    loading: isAdding,
  };
}
