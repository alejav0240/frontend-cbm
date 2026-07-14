import { useQuery } from "@apollo/client/react";
import { OBTENER_FORMULARIOS } from "./consultas";
import { useMemo } from "react";
import type { ObtenerFormulariosQuery } from "@/shared/api/generated/graphql";

export interface FormulariosFiltros {
  page?: number;
  pageSize?: number;
}

export const useFormularios = (filtros: FormulariosFiltros = {}) => {
  const { data, loading, error, refetch } = useQuery<ObtenerFormulariosQuery>(
    OBTENER_FORMULARIOS,
    {
      variables: {
        page: filtros.page,
        pageSize: filtros.pageSize,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const formularios = useMemo(() => {
    return (data?.forms?.results ?? []).filter(
      (f): f is NonNullable<typeof f> => f != null,
    );
  }, [data]);

  return {
    formularios,
    total: data?.forms?.totalCount ?? 0,
    paginas: data?.forms?.totalPages ?? 0,
    paginaActual: data?.forms?.currentPage ?? 0,
    cargando: loading,
    error,
    refetch,
  };
};
