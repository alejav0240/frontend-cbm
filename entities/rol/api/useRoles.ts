import { useQuery } from "@apollo/client/react";
import { OBTENER_ROLES } from "./consultas";
import { Rol } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerRolesQuery } from "@/shared/api/generated/graphql";

export const useRoles = () => {
  const { data, loading, error, refetch } =
    useQuery<ObtenerRolesQuery>(OBTENER_ROLES);

  const roles = useMemo(() => {
    return (data?.roles || []).filter(Boolean) as unknown as Rol[];
  }, [data]);

  return {
    roles,
    cargando: loading,
    error,
    refetch,
  };
};
