"use client";

import React from "react";
import { StatCard } from "@/shared/ui/StatCard";
import { CalendarCheck, CheckCircle, Clock, XCircle } from "lucide-react";

interface SessionsStatsProps {
  total: number;
  completadas: number;
  pendientes: number;
  canceladas: number;
  mesActual: string;
}

export function SessionsStats({
  total,
  completadas,
  pendientes,
  canceladas,
  mesActual,
}: SessionsStatsProps) {
  const tasaCompletado =
    total > 0 ? `${Math.round((completadas / total) * 100)}%` : "0%";

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Resumen mensual
          </p>
          <h2 className="text-lg font-bold capitalize dark:text-white">
            {mesActual}
          </h2>
        </div>
        <p className="text-xs text-gray-400">Sesiones programadas y registradas</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={<CalendarCheck />}
          label="Sesiones del mes"
          value={String(total)}
          subtitle={mesActual}
          color="teal"
        />
        <StatCard
          icon={<CheckCircle />}
          label="Completadas"
          value={String(completadas)}
          subtitle={mesActual}
          trend={total > 0 ? tasaCompletado : ""}
          color="green"
        />
        <StatCard
          icon={<Clock />}
          label="Pendientes"
          value={String(pendientes)}
          subtitle="Agendadas, confirmadas o reprogramadas"
          color="blue"
        />
        <StatCard
          icon={<XCircle />}
          label="Canceladas"
          value={String(canceladas)}
          subtitle={mesActual}
          color="red"
        />
      </div>
    </div>
  );
}
