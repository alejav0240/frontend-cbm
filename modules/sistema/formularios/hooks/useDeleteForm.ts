import { useMutation } from "@apollo/client/react";
import { DELETE_FORM } from "@/modules/sistema/formularios/graphql/mutations";

export function useDeleteForm(onCompleted?: () => void) {
  const [deleteFormMutation, { loading: isDeleting }] = useMutation(DELETE_FORM, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const deleteForm = (id: string | number) => deleteFormMutation({ variables: { id } });

  return {
    deleteForm,
    isDeleting,
  };
}
