"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_THERAPY_REPORTS } from "./consultas";
import type { ObtenerInformesQuery } from "@/shared/api/generated/graphql";
import type { TherapyReport } from "../model/tipos";

export function useInformes(patientId?: string) {
  const { data, loading, error, refetch } = useQuery<ObtenerInformesQuery>(
    GET_THERAPY_REPORTS,
    {
      variables: { patientId: patientId || undefined },
      notifyOnNetworkStatusChange: true,
    },
  );

  const informes: TherapyReport[] = useMemo(
    () =>
      (data?.therapyReports ?? [])
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
    cargando: loading,
    error,
    refetch,
  };
}
