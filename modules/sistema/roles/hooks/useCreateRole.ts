import { useMutation } from "@apollo/client/react";
import { CREATE_ROLE } from "@/modules/sistema/roles/graphql/mutations";
import { CreateRoleInput } from "@/modules/sistema/roles/schemas";

export function useCreateRole(onCompleted?: () => void) {
  const [createRoleMutation, { loading: isCreating }] = useMutation(CREATE_ROLE, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const createRole = (variables: CreateRoleInput) => createRoleMutation({ variables });

  return {
    createRole,
    isCreating,
  };
}
