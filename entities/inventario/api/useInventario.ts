import { useQuery } from "@apollo/client/react";
import { OBTENER_ARTICULOS_INVENTARIO } from "./consultas";
import { ArticuloInventario, InventarioFiltros } from "../model/tipos";
import { useMemo } from "react";

export const useInventario = (filtros: InventarioFiltros = {}) => {
  const { data, loading, error, refetch } = useQuery<any>(OBTENER_ARTICULOS_INVENTARIO, {
    variables: {
      status: filtros.estado,
      type: filtros.tipo,
    },
    notifyOnNetworkStatusChange: true,
  });

  const articulos: ArticuloInventario[] = useMemo(() => {
    return (data?.inventoryItems || []).map((item: any) => ({
      id: item.id,
      nombre: item.name,
      tipo: item.type,
      condicion: item.condition,
      estado: item.status,
      aula: item.room,
      estadoMostrado: item.statusDisplay,
    }));
  }, [data]);

  return {
    articulos,
    cargando: loading,
    error,
    refetch,
  };
};
