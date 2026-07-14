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
        page: filtros.pagina,
        pageSize: filtros.pageSize,
        search: filtros.busqueda || "",
      },
      notifyOnNetworkStatusChange: true,
    });

  const articulos = useMemo(() => {
    return (data?.inventoryItems?.results || []).filter(
      Boolean,
    ) as unknown as ArticuloInventario[];
  }, [data]);

  return {
    articulos,
    total: data?.inventoryItems?.totalCount || 0,
    paginas: data?.inventoryItems?.totalPages || 0,
    paginaActual: data?.inventoryItems?.currentPage || 0,
    cargando: loading,
    error,
    refetch,
  };
};
