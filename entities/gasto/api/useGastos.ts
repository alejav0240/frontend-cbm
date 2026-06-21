import { useQuery } from "@apollo/client/react";
import { OBTENER_GASTOS } from "./consultas";
import { Gasto, GastoFiltros } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerGastosQuery } from "@/shared/api/generated/graphql";

export const useGastos = (filtros: GastoFiltros = {}) => {
  const { data, loading, error, refetch } = useQuery<ObtenerGastosQuery>(
    OBTENER_GASTOS,
    {
      variables: {
        status: filtros.estado,
        category: filtros.categoria,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const gastos = useMemo(() => {
    return (data?.expenses || []).filter(Boolean) as unknown as Gasto[];
  }, [data]);

  return {
    gastos,
    cargando: loading,
    error,
    refetch,
  };
};
