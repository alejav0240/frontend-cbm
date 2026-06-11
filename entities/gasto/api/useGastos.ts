import { useQuery } from "@apollo/client/react";
import { OBTENER_GASTOS } from "./consultas";
import { Gasto, GastoFiltros } from "../model/tipos";
import { useMemo } from "react";

export const useGastos = (filtros: GastoFiltros = {}) => {
  const { data, loading, error, refetch } = useQuery<any>(OBTENER_GASTOS, {
    variables: {
      status: filtros.estado,
      category: filtros.categoria,
    },
    notifyOnNetworkStatusChange: true,
  });

  const gastos: Gasto[] = useMemo(() => {
    return (data?.expenses || []).map((e: any) => ({
      id: e.id,
      descripcion: e.description,
      categoria: e.category,
      monto: e.amount,
      fechaGasto: e.expenseDate,
      estado: e.status,
    }));
  }, [data]);

  return {
    gastos,
    cargando: loading,
    error,
    refetch,
  };
};
