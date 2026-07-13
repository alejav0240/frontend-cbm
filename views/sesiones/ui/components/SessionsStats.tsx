"use client";

import React from "react";
import { StatCard } from "@/shared/ui/StatCard";
import { CalendarCheck, CheckCircle, Clock, XCircle } from "lucide-react";

interface SessionsStatsProps {
  total: number;
  completadas: number;
  pendientes: number;
  canceladas: number;
}

export function SessionsStats({
  total,
  completadas,
  pendientes,
  canceladas,
}: SessionsStatsProps) {
  const tasaCompletado =
    total > 0 ? `${Math.round((completadas / total) * 100)}%` : "0%";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard
        icon={<CalendarCheck />}
        label="Total Sesiones"
        value={String(total)}
        color="teal"
      />
      <StatCard
        icon={<CheckCircle />}
        label="Completadas"
        value={String(completadas)}
        trend={total > 0 ? `+${tasaCompletado}` : ""}
        color="green"
      />
      <StatCard
        icon={<Clock />}
        label="Pendientes"
        value={String(pendientes)}
        color="blue"
      />
      <StatCard
        icon={<XCircle />}
        label="Canceladas"
        value={String(canceladas)}
        color="red"
      />
    </div>
  );
}
