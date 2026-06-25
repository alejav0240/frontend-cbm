import { useMutation } from "@apollo/client/react";
import { ASSIGN_FORM } from "./mutaciones";

interface AssignFormVariables {
  formId: string;
  assignedToId?: string | null;
  assignedById: string;
  patientId?: string | null;
  sessionId?: string | null;
}

export function useAssignForm() {
  const [mutation, { loading, error, data }] = useMutation(ASSIGN_FORM);

  const assignForm = (variables: AssignFormVariables) =>
    mutation({ variables });

  return {
    assignForm,
    asignando: loading,
    error,
    data,
  };
}
