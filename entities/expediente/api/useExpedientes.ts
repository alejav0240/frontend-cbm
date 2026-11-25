"use client";

import { useMemo, useState, useCallback } from "react";
import { usePacientes } from "@/entities/paciente";
import { useCiclosPacientes } from "@/entities/sesion";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";
import type { ExpedienteResumen } from "../model/tipos";

export function useExpedientes() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const busquedaDebounced = useDebounce(search, 500);

  const {
    pacientes,
    total,
    paginas: totalPages,
    paginaActual: currentPage,
    cargando: cargandoPacientes,
    error: errorPacientes,
    refetch: refetchPacientes,
  } = usePacientes({
    search: busquedaDebounced,
    page,
    pageSize: 50,
  });
  const {
    ciclos,
    cargando: cargandoCiclos,
    error: errorCiclos,
    refetch: refetchCiclos,
  } = useCiclosPacientes({
    search: busquedaDebounced || undefined,
    page: 1,
    pageSize: 100,
  });

  const expedientes: ExpedienteResumen[] = useMemo(
    () =>
      pacientes.map((paciente) => {
        const ciclo = ciclos.find((item) => item.patientId === paciente.id);
        return {
          id: ciclo?.id ?? paciente.id,
          patientId: paciente.id,
          patientName: paciente.fullName || paciente.firstName || "Sin nombre",
          cycleNumber: ciclo?.cycleNumber ?? 0,
          totalSessions: ciclo?.totalSessions ?? 0,
          completedSessions: ciclo?.completedSessions ?? 0,
          status: ciclo?.status ?? paciente.status,
          paymentSummary: ciclo?.paymentSummary ?? null,
          sessionsList: (ciclo?.sessionsList ?? []).map((s) => ({
            id: s.id,
            sessionDate: String(s.sessionDate ?? ""),
            sessionStatus: s.sessionStatus,
          })),
          startDate: ciclo?.startDate ?? "Sin sesiones",
          lastSessionDate: ciclo?.sessionsList?.length
            ? String(ciclo.sessionsList[0]?.sessionDate ?? "")
            : "",
        };
      }),
    [ciclos, pacientes],
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return {
    expedientes,
    total,
    totalPages,
    currentPage,
    cargando: cargandoPacientes || cargandoCiclos,
    error: errorPacientes || errorCiclos,
    search,
    setSearch: handleSearchChange,
    page,
    setPage: handlePageChange,
    refetch: async () => {
      await Promise.all([refetchPacientes(), refetchCiclos()]);
    },
  };
}
