import { useSuspenseQuery } from "@apollo/client/react";
import { GET_DIGITAL_RESOURCES } from "@/modules/comunidad/recursos/graphql/query";
import { RecursoData, RecursoFilters } from "@/modules/comunidad/recursos/types";

interface Props {
  filters: RecursoFilters;
}

export function useResources({ filters }: Props) {
  const { data, refetch } = useSuspenseQuery<RecursoData>(GET_DIGITAL_RESOURCES, {
    variables: { 
      type: filters.type, 
      search: filters.search, 
      page: filters.page, 
      pageSize: filters.pageSize 
    }
  });

  return {
    resources: data?.digitalResources?.results ?? [],
    totalCount: data?.digitalResources?.totalCount ?? 0,
    totalPages: data?.digitalResources?.totalPages ?? 1,
    currentPage: data?.digitalResources?.currentPage ?? 1,
    refetch,
  };
}
