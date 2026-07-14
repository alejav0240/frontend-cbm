"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_THERAPY_REPORTS } from "./consultas";
import type { ObtenerInformesQuery } from "@/shared/api/generated/graphql";
import type { TherapyReport } from "../model/tipos";

export function useInformes(filtros: {
  patientId?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const { data, loading, error, refetch } = useQuery<ObtenerInformesQuery>(
    GET_THERAPY_REPORTS,
    {
      variables: {
        patientId: filtros.patientId || undefined,
        page: filtros.page,
        pageSize: filtros.pageSize,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const informes: TherapyReport[] = useMemo(
    () =>
      (data?.therapyReports?.results ?? [])
        .filter((r): r is NonNullable<typeof r> => r != null)
        .map((r) => ({
          id: r.id,
          title: `Informe - ${r.patient?.fullName ?? "Sin paciente"}`,
          patientName: r.patient?.fullName ?? "Sin paciente",
          date: r.createdAt
            ? new Date(r.createdAt as string).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "—",
          status: "Enviado",
          tutorName: "",
          therapistName: r.generatedBy?.fullName ?? "",
          content: "",
          reportUrl: r.reportUrl ?? "",
        })),
    [data],
  );

  return {
    informes,
    paginas: data?.therapyReports?.totalPages || 0,
    paginaActual: data?.therapyReports?.currentPage || 0,
    cargando: loading,
    error,
    refetch,
  };
}
