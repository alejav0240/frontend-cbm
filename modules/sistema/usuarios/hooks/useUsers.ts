import {
  SearchUserData,
  SearchUserFilter,
} from "@/modules/sistema/usuarios/types";
import { GET_THERAPISTS_SEARCH } from "@/modules/sistema/usuarios/graphql/query";
import { useQuery } from "@apollo/client/react";

export function useSearchUsers({
  pageSize = 50,
  roleName = "",
  excludeRole = "",
  page = 1,
  search = "",
}: SearchUserFilter) {
  const { data, loading, refetch } = useQuery<SearchUserData>(
    GET_THERAPISTS_SEARCH,
    {
      variables: {
        pageSize: pageSize,
        page: page,
        search: search,
        roleName: roleName,
        excludeRole: excludeRole,
      },
    },
  );
  return { users: data?.users.results, loading, refetch };
}
