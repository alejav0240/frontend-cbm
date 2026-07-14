import { useQuery } from "@apollo/client/react";
import { OBTENER_GASTOS } from "./consultas";
import { Gasto, GastoFiltros } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerGastosQuery } from "@/shared/api/generated/graphql";

export const useGastos = (filtros: GastoFiltros) => {
  const { data, loading, error, refetch } = useQuery<ObtenerGastosQuery>(
    OBTENER_GASTOS,
    {
      variables: {
        status: filtros.estado,
        category: filtros.categoria,
        page: filtros.pagina,
        pageSize: filtros.pageSize,
        search: filtros.busqueda || "",
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const gastos = useMemo(() => {
    return (data?.expenses?.results || []).filter(Boolean) as unknown as Gasto[];
  }, [data]);

  return {
    gastos,
    total: data?.expenses?.totalCount || 0,
    paginas: data?.expenses?.totalPages || 0,
    paginaActual: data?.expenses?.currentPage || 0,
    cargando: loading,
    error,
    refetch,
  };
};
