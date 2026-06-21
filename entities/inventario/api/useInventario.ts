import { useQuery } from "@apollo/client/react";
import { OBTENER_ARTICULOS_INVENTARIO } from "./consultas";
import { ArticuloInventario, InventarioFiltros } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerArticulosInventarioQuery } from "@/shared/api/generated/graphql";

export const useInventario = (filtros: InventarioFiltros = {}) => {
  const { data, loading, error, refetch } =
    useQuery<ObtenerArticulosInventarioQuery>(OBTENER_ARTICULOS_INVENTARIO, {
      variables: {
        status: filtros.estado,
        type: filtros.tipo,
      },
      notifyOnNetworkStatusChange: true,
    });

  const articulos = useMemo(() => {
    return (data?.inventoryItems || []).filter(
      Boolean,
    ) as unknown as ArticuloInventario[];
  }, [data]);

  return {
    articulos,
    cargando: loading,
    error,
    refetch,
  };
};
