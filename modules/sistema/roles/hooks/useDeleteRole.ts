import { useMutation } from "@apollo/client/react";
import { DELETE_ROLE } from "@/modules/sistema/roles/graphql/mutations";

export function useDeleteRole(onCompleted?: () => void) {
  const [deleteRoleMutation, { loading: isDeleting }] = useMutation(DELETE_ROLE, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const deleteRole = (id: string | number) => deleteRoleMutation({ variables: { id } });

  return {
    deleteRole,
    isDeleting,
  };
}
