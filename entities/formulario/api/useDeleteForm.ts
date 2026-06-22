import { useMutation } from "@apollo/client/react";
import { DELETE_FORM } from "./mutaciones";
import type {
  DeleteFormMutation,
  DeleteFormMutationVariables,
} from "@/shared/api/generated/graphql";

export function useDeleteForm() {
  const [mutation, { loading, error, data }] = useMutation<
    DeleteFormMutation,
    DeleteFormMutationVariables
  >(DELETE_FORM);

  const deleteForm = (id: string | number) => mutation({ variables: { id } });

  return {
    deleteForm,
    eliminando: loading,
    error,
    data,
  };
}
