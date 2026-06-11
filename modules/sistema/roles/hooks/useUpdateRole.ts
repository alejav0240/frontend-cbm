import { useMutation } from "@apollo/client/react";
import { UPDATE_ROLE } from "@/modules/sistema/roles/graphql/mutations";
import { UpdateRoleInput } from "@/modules/sistema/roles/schemas";

export function useUpdateRole(onCompleted?: () => void) {
  const [updateRoleMutation, { loading: isUpdating }] = useMutation(UPDATE_ROLE, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const updateRole = (variables: UpdateRoleInput) => updateRoleMutation({ variables });

  return {
    updateRole,
    isUpdating,
  };
}
