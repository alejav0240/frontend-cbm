import { useQuery } from "@apollo/client/react";
import { OBTENER_ROLES } from "./consultas";
import { Rol } from "../model/tipos";
import { useMemo } from "react";

export const useRoles = () => {
  const { data, loading, error, refetch } = useQuery<any>(OBTENER_ROLES);

  const roles: Rol[] = useMemo(() => {
    return (data?.roles || []).map((r: any) => ({
      id: r.id,
      nombre: r.name,
      permisos: r.permissions,
      conteoUsuarios: r.usersCount,
    }));
  }, [data]);

  return {
    roles,
    cargando: loading,
    error,
    refetch,
  };
};
