"use client";

import React from "react";
import { BarChart3, TrendingUp, PieChart, Download } from "lucide-react";

export const AnalisisPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">
            Análisis y Estadísticas
          </h1>
          <p className="text-gray-400 text-sm">
            Visualiza el rendimiento y métricas operativas del centro
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-accent border border-gray-200 dark:border-white/5 rounded-2xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-all shadow-sm">
          <Download size={18} />
          Exportar Reporte
        </button>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 shadow-xl p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mx-auto mb-6">
          <BarChart3 size={40} />
        </div>
        <h2 className="text-xl font-bold dark:text-white mb-2">
          Módulo de Análisis en Desarrollo
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Estamos trabajando en gráficas avanzadas para mostrar la evolución de
          pacientes, ingresos y gastos de forma consolidada.
        </p>
      </div>
    </div>
  );
};
