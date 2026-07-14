import { useQuery } from "@apollo/client/react";
import { OBTENER_INSTITUCIONES } from "./consultas";
import { Institucion } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerInstitucionesQuery } from "@/shared/api/generated/graphql";

export const useInstituciones = (params?: { page?: number; pageSize?: number }) => {
  const { data, loading, error, refetch } = useQuery<ObtenerInstitucionesQuery>(
    OBTENER_INSTITUCIONES,
    {
      variables: {
        page: params?.page,
        pageSize: params?.pageSize,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const instituciones = useMemo(() => {
    return (data?.institutions?.results || []).filter(
      Boolean,
    ) as unknown as Institucion[];
  }, [data]);

  return {
    instituciones,
    total: data?.institutions?.totalCount || 0,
    paginas: data?.institutions?.totalPages || 0,
    paginaActual: data?.institutions?.currentPage || 0,
    cargando: loading,
    error,
    refetch,
  };
};
