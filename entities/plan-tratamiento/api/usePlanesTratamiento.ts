import { useQuery } from "@apollo/client/react";
import { OBTENER_PLANES_INTERVENCION } from "./consultas";
import { PlanTratamiento, PlanFiltros } from "../model/tipos";
import { useMemo } from "react";

export const usePlanesTratamiento = (filtros: PlanFiltros) => {
  const { data, loading, error, refetch } = useQuery<any>(OBTENER_PLANES_INTERVENCION, {
    variables: {
      patientId: filtros.pacienteId,
      search: filtros.busqueda,
      page: filtros.pagina || 1,
      pageSize: filtros.pageSize || 10,
    },
    notifyOnNetworkStatusChange: true,
  });

  const planes: PlanTratamiento[] = useMemo(() => {
    return (data?.interventionPlans?.results || []).map((p: any) => ({
      id: p.id,
      objetivoPrincipal: p.mainObjective,
      fechaInicio: p.startDate,
      fechaFin: p.endDate,
      porcentajeProgreso: p.progressPercent,
      estado: p.status,
      paciente: p.patient,
      pasos: (p.steps || []).map((s: any) => ({
        id: s.id,
        momento: s.moment,
        duracionMinutos: s.durationMinutes,
        objetivo: s.objective,
        enfoque: s.focus,
        recursosMusicales: s.musicalResources,
        enfasisMusical: s.musicalEmphasis,
        abordaje: s.approach,
        metodoMlt: s.mltMethod,
        indiceOrden: s.orderIndex,
        estaCompletado: s.isCompleted,
      })),
    }));
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
