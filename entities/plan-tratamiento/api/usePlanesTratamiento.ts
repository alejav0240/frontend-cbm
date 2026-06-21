import { useQuery } from "@apollo/client/react";
import { OBTENER_PLANES_INTERVENCION } from "./consultas";
import { PlanTratamiento, PlanFiltros } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerPlanesIntervencionQuery } from "@/shared/api/generated/graphql";

export const usePlanesTratamiento = (filtros: PlanFiltros) => {
  const { data, loading, error, refetch } =
    useQuery<ObtenerPlanesIntervencionQuery>(OBTENER_PLANES_INTERVENCION, {
      variables: {
        patientId: filtros.pacienteId,
        search: filtros.busqueda,
        page: filtros.pagina || 1,
        pageSize: filtros.pageSize || 10,
      },
      notifyOnNetworkStatusChange: true,
    });

  const planes = useMemo(() => {
    return (data?.interventionPlans?.results || []).filter(
      Boolean,
    ) as unknown as PlanTratamiento[];
  }, [data]);

  return {
    planes,
    total: data?.interventionPlans?.totalCount || 0,
    paginas: data?.interventionPlans?.totalPages || 0,
    paginaActual: data?.interventionPlans?.currentPage || 0,
    cargando: loading,
    error,
    refetch,
  };
};
