import { useQuery } from "@apollo/client/react";
import { OBTENER_ROLES } from "./consultas";
import { Rol } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerRolesQuery } from "@/shared/api/generated/graphql";

export const useRoles = (filtros?: { page?: number; pageSize?: number }) => {
  const { data, loading, error, refetch } = useQuery<ObtenerRolesQuery>(
    OBTENER_ROLES,
    {
      variables: {
        page: filtros?.page,
        pageSize: filtros?.pageSize,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const roles = useMemo(() => {
    return (data?.roles?.results || []).filter(Boolean) as unknown as Rol[];
  }, [data]);

  return {
    roles,
    paginas: data?.roles?.totalPages || 0,
    paginaActual: data?.roles?.currentPage || 0,
    total: data?.roles?.totalCount || 0,
    cargando: loading,
    error,
    refetch,
  };
};
