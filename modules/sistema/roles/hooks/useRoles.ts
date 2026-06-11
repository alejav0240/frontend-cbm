import { useSuspenseQuery } from "@apollo/client/react";
import { GET_ROLES } from "@/modules/sistema/roles/graphql/query";
import { RoleData } from "@/modules/sistema/roles/types";

export function useRoles() {
  const { data, refetch } = useSuspenseQuery<RoleData>(GET_ROLES);

  return {
    roles: data?.roles ?? [],
    refetch,
  };
}
