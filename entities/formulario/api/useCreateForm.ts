import { useMutation } from "@apollo/client/react";
import { CREATE_FORM } from "./mutaciones";
import type {
  CreateFormMutation,
  CreateFormMutationVariables,
} from "@/shared/api/generated/graphql";

export function useCreateForm() {
  const [mutation, { loading, error, data }] = useMutation<
    CreateFormMutation,
    CreateFormMutationVariables
  >(CREATE_FORM);

  const createForm = (variables: CreateFormMutationVariables) =>
    mutation({ variables });

  return {
    createForm,
    creando: loading,
    error,
    data,
  };
}
