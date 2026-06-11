import { useQuery } from "@apollo/client/react";
import { OBTENER_USUARIOS } from "./consultas";
import { Usuario, UsuarioFiltros } from "../model/tipos";
import { useMemo } from "react";

export const useUsuarios = (filtros: UsuarioFiltros) => {
  const { data, loading, error, refetch } = useQuery<any>(OBTENER_USUARIOS, {
    variables: {
      page: filtros.pagina || 1,
      pageSize: filtros.pageSize || 10,
      search: filtros.busqueda,
      roleName: filtros.nombreRol,
      excludeRole: filtros.excluirRol,
    },
    notifyOnNetworkStatusChange: true,
  });

  const usuarios: Usuario[] = useMemo(() => {
    return (data?.users?.results || []).map((u: any) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      fullName: u.fullName,
      isStaff: u.isStaff,
      isActive: u.isActive,
      celular: u.celular,
      status: u.status,
      foto: u.foto,
      ci: u.ci,
      rol: {
        id: u.role?.id,
        nombre: u.role?.name,
      },
    }));
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
