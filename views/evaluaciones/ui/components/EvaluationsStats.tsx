"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { FileText, TrendingUp, Calendar } from "lucide-react";
import type { Evaluacion } from "@/entities/escalas/model/tipos";

interface EvaluationsStatsProps {
  evaluaciones: Evaluacion[];
  total: number;
}

export function EvaluationsStats({ evaluaciones, total }: EvaluationsStatsProps) {
  const promedio = useMemo(() => {
    const scores = evaluaciones
      .map((e) => e.score)
      .filter((s): s is number => s != null);
    if (scores.length === 0) return 0;
    return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
  }, [evaluaciones]);

  const esteMes = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return evaluaciones.filter((e) => {
      const d = new Date(e.date);
      return !isNaN(d.getTime()) && d >= start;
    }).length;
  }, [evaluaciones]);

  const stats = [
    {
      icon: FileText,
      label: "Total Evaluaciones",
      value: String(total),
      color: "text-[#008080]",
      bg: "bg-[#008080]/10",
    },
    {
      icon: TrendingUp,
      label: "Promedio Puntaje",
      value: promedio > 0 ? String(promedio) : "—",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      icon: Calendar,
      label: "Este Mes",
      value: String(esteMes),
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white dark:bg-[#111] p-5 rounded-[32px] border border-gray-200 dark:border-white/5"
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}
            >
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-2xl font-bold dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
