"use client";

import { useMemo, useState, useCallback } from "react";
import { useCiclosPacientes } from "@/entities/sesion";
import type { ExpedienteResumen } from "../model/tipos";

export function useExpedientes() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { ciclos, total, totalPages, currentPage, cargando, error, refetch } =
    useCiclosPacientes({ search: search || undefined, page });

  const expedientes: ExpedienteResumen[] = useMemo(
    () =>
      ciclos.map((c) => ({
        id: c.id,
        patientId: c.patientId,
        patientName: c.patientName,
        cycleNumber: c.cycleNumber,
        totalSessions: c.totalSessions,
        completedSessions: c.completedSessions,
        status: c.status,
        paymentSummary: c.paymentSummary,
        sessionsList: c.sessionsList.map((s: any) => ({
          id: s?.id ?? "",
          sessionDate: String(s?.sessionDate ?? ""),
          sessionStatus: s?.sessionStatus ?? "",
        })),
        startDate: c.startDate,
        lastSessionDate:
          c.sessionsList.length > 0
            ? String(c.sessionsList[0]?.sessionDate ?? "")
            : "",
      })),
    [ciclos],
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
    cargando,
    error,
    search,
    setSearch: handleSearchChange,
    page,
    setPage: handlePageChange,
    refetch,
  };
}
