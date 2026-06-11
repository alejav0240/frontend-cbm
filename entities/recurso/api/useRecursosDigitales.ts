import { useQuery } from "@apollo/client/react";
import { OBTENER_RECURSOS_DIGITALES } from "./consultas";
import { RecursoDigital, RecursoFiltros } from "../model/tipos";
import { useMemo } from "react";

export const useRecursosDigitales = (filtros: RecursoFiltros) => {
  const { data, loading, error, refetch } = useQuery<any>(OBTENER_RECURSOS_DIGITALES, {
    variables: {
      type: filtros.tipo,
      search: filtros.busqueda,
      page: filtros.pagina,
      pageSize: filtros.pageSize,
    },
  });

  const recursos: RecursoDigital[] = useMemo(() => {
    return (data?.digitalResources?.results || []).map((r: any) => ({
      id: r.id,
      titulo: r.title,
      tipo: r.type,
      categoria: r.category,
      url: r.url,
      tipoMostrado: r.typeDisplay,
    }));
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
