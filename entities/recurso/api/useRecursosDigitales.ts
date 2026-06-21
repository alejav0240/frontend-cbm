import { useQuery } from "@apollo/client/react";
import { OBTENER_RECURSOS_DIGITALES } from "./consultas";
import { RecursoDigital, RecursoFiltros } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerRecursosDigitalesQuery } from "@/shared/api/generated/graphql";

export const useRecursosDigitales = (filtros: RecursoFiltros) => {
  const { data, loading, error, refetch } =
    useQuery<ObtenerRecursosDigitalesQuery>(OBTENER_RECURSOS_DIGITALES, {
      variables: {
        type: filtros.tipo,
        search: filtros.busqueda,
        page: filtros.pagina,
        pageSize: filtros.pageSize,
      },
    });

  const recursos = useMemo(() => {
    return (data?.digitalResources?.results || []).filter(
      Boolean,
    ) as unknown as RecursoDigital[];
  }, [data]);

  return {
    recursos,
    total: data?.digitalResources?.totalCount || 0,
    paginas: data?.digitalResources?.totalPages || 0,
    paginaActual: data?.digitalResources?.currentPage || 0,
    cargando: loading,
    error,
    refetch,
  };
};
