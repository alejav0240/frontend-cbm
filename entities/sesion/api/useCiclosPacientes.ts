import { useQuery } from "@apollo/client/react";
import { OBTENER_CICLOS_PACIENTES } from "./consultas";
import { useMemo } from "react";
import { ObtenerCiclosPacientesQuery } from "@/shared/api/generated/graphql";

export interface CicloPaciente {
  id: string;
  patientName: string;
  cycleNumber: number;
  startDate: string;
  totalSessions: number;
  completedSessions: number;
  status: string;
  paymentStatus: string;
  paymentSummary: {
    paid: number | null;
    pending: number | null;
    exempt: number | null;
  } | null;
  sessionsList: Array<{
    id: string;
    sessionDate: unknown;
    sessionStatus: string;
  }>;
  patientPhone: string;
  patientId: string;
  therapists: string;
}

export interface CicloPacienteFiltros {
  page?: number;
  pageSize?: number;
  search?: string;
  therapistId?: string;
}

export const useCiclosPacientes = (filtros: CicloPacienteFiltros = {}) => {
  const { data, loading, error, refetch } =
    useQuery<ObtenerCiclosPacientesQuery>(OBTENER_CICLOS_PACIENTES, {
      variables: {
        page: filtros.page || 1,
        pageSize: filtros.pageSize || 50,
        search: filtros.search || undefined,
        therapistId: filtros.therapistId || undefined,
      },
      notifyOnNetworkStatusChange: true,
    });

  const ciclos = useMemo(() => {
    const results = data?.patientsLastCycle?.results || [];
    return results
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .map((r) => ({
        id: `${r.patientName || "anonimo"}-${r.cycleNumber || 0}`,
        patientName: r.patientName || "",
        cycleNumber: r.cycleNumber || 0,
        startDate: r.sessions?.[0]?.sessionDate
          ? new Date(r.sessions[0].sessionDate as string).toLocaleDateString()
          : "N/A",
        totalSessions: r.sessionCount || 0,
        completedSessions: r.completedCount || 0,
        status: r.status || "",
        paymentStatus: r.paymentSummary?.pending === 0 ? "Pagado" : "Pendiente",
        paymentSummary: r.paymentSummary,
        sessionsList: r.sessions?.filter(Boolean) || [],
        patientPhone: "",
        patientId: "",
        therapists: "N/A",
      }));
  }, [data]);

  return {
    ciclos,
    total: data?.patientsLastCycle?.totalCount ?? 0,
    totalPages: data?.patientsLastCycle?.totalPages ?? 0,
    currentPage: data?.patientsLastCycle?.currentPage ?? 1,
    cargando: loading,
    error,
    refetch,
  };
};
