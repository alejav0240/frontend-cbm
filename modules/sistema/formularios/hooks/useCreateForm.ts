import { useMutation } from "@apollo/client/react";
import { CREATE_FORM } from "@/modules/sistema/formularios/graphql/mutations";
import { CreateFormInput } from "@/modules/sistema/formularios/schemas";

export function useCreateForm(onCompleted?: () => void) {
  const [createFormMutation, { loading: isCreating }] = useMutation(CREATE_FORM, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const createForm = (variables: CreateFormInput) => createFormMutation({ variables });

  return {
    createForm,
    isCreating,
  };
}
