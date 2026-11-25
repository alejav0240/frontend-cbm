"use client";

import React from "react";
import { Activity, TrendingUp, Brain } from "lucide-react";

interface PatientAIOverviewCardsProps {
  analysesCount: number;
  lastUpdateDate: string;
  progressLabel: string;
  focusLabel: string;
}

export function AIOverviewCards({
  analysesCount,
  lastUpdateDate,
  progressLabel,
  focusLabel,
}: PatientAIOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Activity size={20} />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Sesiones Analizadas
          </h4>
        </div>
        <p className="text-3xl font-bold dark:text-white">{analysesCount}</p>
        <p className="text-xs text-gray-500 mt-2">
          Última actualización: {lastUpdateDate}
        </p>
      </div>

      <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500">
            <TrendingUp size={20} />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Progreso General
          </h4>
        </div>
        <p className="text-3xl font-bold dark:text-white">{progressLabel}</p>
        <p className="text-xs text-gray-500 mt-2">
          Comparación basada en evaluaciones disponibles
        </p>
      </div>

      <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500">
            <Brain size={20} />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Foco Terapéutico
          </h4>
        </div>
        <p className="text-xl font-bold dark:text-white">{focusLabel}</p>
        <p className="text-xs text-gray-500 mt-2">
          Área con mayor puntuación en la última evaluación
        </p>
      </div>
    </div>
  );
}
