import { useQuery } from "@apollo/client/react";
import { OBTENER_USUARIOS } from "./consultas";
import { Usuario, UsuarioFiltros } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerUsuariosQuery } from "@/shared/api/generated/graphql";

export const useUsuarios = (filtros: UsuarioFiltros) => {
  const { data, loading, error, refetch } = useQuery<ObtenerUsuariosQuery>(
    OBTENER_USUARIOS,
    {
      variables: {
        page: filtros.pagina || 1,
        pageSize: filtros.pageSize || 10,
        search: filtros.busqueda,
        roleName: filtros.nombreRol,
        excludeRole: filtros.excluirRol,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const usuarios = useMemo(() => {
    return (data?.users?.results || []).filter(Boolean) as unknown as Usuario[];
  }, [data]);

  return {
    usuarios,
    total: data?.users?.totalCount || 0,
    paginas: data?.users?.totalPages || 0,
    paginaActual: data?.users?.currentPage || 0,
    cargando: loading,
    error,
    refetch,
  };
};
