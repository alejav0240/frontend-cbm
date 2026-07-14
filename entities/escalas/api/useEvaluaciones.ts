"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { OBTENER_EVALUACIONES } from "./consultas";
import type { ObtenerEvaluacionesQuery } from "@/shared/api/generated/graphql";
import type { Evaluacion } from "../model/tipos";

interface UseEvaluacionesParams {
  patientId?: string;
  scaleId?: string;
  page?: number;
  pageSize?: number;
  busqueda?: string;
}

export function useEvaluaciones(params?: UseEvaluacionesParams) {
  const { patientId, scaleId, page = 1, pageSize = 10, busqueda } = params ?? {};

  const { data, loading, error, refetch } = useQuery<ObtenerEvaluacionesQuery>(
    OBTENER_EVALUACIONES,
    {
      variables: {
        patientId: patientId || undefined,
        scaleId: scaleId || undefined,
        page,
        pageSize,
        search: busqueda || "",
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const paginated = data?.scaleEvaluations;

  const evaluaciones: Evaluacion[] = useMemo(
    () =>
      (paginated?.results ?? [])
        .filter((e): e is NonNullable<typeof e> => e != null)
        .map((e) => ({
          id: e.id,
          patientId: e.paciente?.id ?? "",
          patientName: e.paciente?.fullName ?? "Sin paciente",
          date: e.fechaEvaluacion
            ? new Date(e.fechaEvaluacion as string).toLocaleDateString("es-ES")
            : "—",
          type: "Completada",
          score: e.puntajeTotal,
          status: "Completada",
          scaleId: e.escala?.id ?? "",
          scaleName: e.escala?.nombre ?? "",
          subscaleResponses: (e.respuestasSubescala ?? []).map((r) => ({
            id: r.id,
            score: r.puntaje,
            subscaleId: r.subescala?.id ?? "",
            subscaleName: r.subescala?.nombre ?? "",
          })),
        })),
    [paginated],
  );

  return {
    evaluaciones,
    total: paginated?.totalCount ?? 0,
    currentPage: paginated?.currentPage ?? 1,
    totalPages: paginated?.totalPages ?? 1,
    cargando: loading,
    error,
    refetch,
  };
}
