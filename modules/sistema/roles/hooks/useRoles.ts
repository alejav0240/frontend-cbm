import { useMutation, useSuspenseQuery } from "@apollo/client/react";
import {GET_ROLES} from "@/modules/sistema/roles/graphql/query";
import {CREATE_ROLE, DELETE_ROLE, UPDATE_ROLE} from "@/modules/sistema/roles/graphql/mutations";
import {RoleData} from "@/modules/sistema/roles/types";
import {CreateRoleInput, UpdateRoleInput} from "@/modules/sistema/roles/schemas";


export function useRoles() {
    const { data: rolesData, refetch: refetchRoles } = useSuspenseQuery<RoleData>(GET_ROLES);

    const [createRole] = useMutation(CREATE_ROLE, { onCompleted: () => refetchRoles() });
    const [updateRole] = useMutation(UPDATE_ROLE, { onCompleted: () => refetchRoles() });
    const [deleteRole] = useMutation(DELETE_ROLE, { onCompleted: () => refetchRoles() });

    return {
        roles: rolesData?.roles ?? [],
        createRole: (variables: CreateRoleInput) => createRole({ variables }),
        updateRole: (variables: UpdateRoleInput) => updateRole({ variables }),
        deleteRole: (id: string | number) => deleteRole({ variables: { id } }),
        refetchRoles
    };
}
