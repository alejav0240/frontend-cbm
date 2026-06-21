import { useQuery } from "@apollo/client/react";
import { OBTENER_INSTITUCIONES } from "./consultas";
import { Institucion } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerInstitucionesQuery } from "@/shared/api/generated/graphql";

export const useInstituciones = () => {
  const { data, loading, error, refetch } = useQuery<ObtenerInstitucionesQuery>(
    OBTENER_INSTITUCIONES,
  );

  const instituciones = useMemo(() => {
    return (data?.institutions || []).filter(
      Boolean,
    ) as unknown as Institucion[];
  }, [data]);

  return {
    instituciones,
    cargando: loading,
    error,
    refetch,
  };
};
