import { useQuery } from "@apollo/client/react";
import { OBTENER_ESCALAS } from "./consultas";
import type { ObtenerEscalasQuery } from "@/shared/api/generated/graphql";

export interface EscalaFiltros {
  tipo?: string;
  busqueda?: string;
  page?: number;
  pageSize?: number;
}

export const useEscalas = (filtros: EscalaFiltros = {}) => {
  const { data, loading, error, refetch } = useQuery<ObtenerEscalasQuery>(
    OBTENER_ESCALAS,
    {
      variables: {
        scaleType: filtros.tipo || undefined,
        search: filtros.busqueda || undefined,
        page: filtros.page,
        pageSize: filtros.pageSize,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  return {
    escalas: data?.scales?.results ?? [],
    total: data?.scales?.totalCount ?? 0,
    paginas: data?.scales?.totalPages ?? 0,
    paginaActual: data?.scales?.currentPage ?? 1,
    cargando: loading,
    error,
    refetch,
  };
};
