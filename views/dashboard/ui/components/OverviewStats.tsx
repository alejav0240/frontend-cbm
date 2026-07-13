"use client";

import React from "react";
import { Users, Calendar, Activity, TrendingUp } from "lucide-react";
import { StatCard } from "@/shared/ui/StatCard";

interface OverviewStatsProps {
  activePatients: number;
  todaySessionsCount: number;
  activeCyclesCount: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export function OverviewStats({
  activePatients,
  todaySessionsCount,
  activeCyclesCount,
  monthlyIncome,
  monthlyExpenses,
}: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
      <StatCard
        icon={<Users />}
        label="Pacientes Activos"
        value={activePatients.toString()}
        trend="+12%"
        color="teal"
      />
      <StatCard
        icon={<Calendar />}
        label="Sesiones Hoy"
        value={todaySessionsCount.toString()}
        trend="En curso"
        color="blue"
      />
      <StatCard
        icon={<Activity />}
        label="Ciclos Activos"
        value={activeCyclesCount.toString()}
        trend="85% progreso"
        color="purple"
      />
      <StatCard
        icon={<TrendingUp />}
        label="Ingresos Mes"
        value={`Bs ${monthlyIncome.toLocaleString()}`}
        trend={
          monthlyIncome - monthlyExpenses >= 0
            ? `Neto: Bs ${Math.round(monthlyIncome - monthlyExpenses).toLocaleString()}`
            : `Neto: -Bs ${Math.abs(Math.round(monthlyIncome - monthlyExpenses)).toLocaleString()}`
        }
        color="green"
      />
    </div>
  );
}
