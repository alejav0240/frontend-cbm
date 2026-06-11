"use client";

import React from "react";
import { ListChecks, Plus } from "lucide-react";

export const CiclosPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Ciclos Terapéuticos</h1>
          <p className="text-gray-400 text-sm">Gestiona las etapas y series de sesiones de tus pacientes</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#008080] text-white rounded-2xl text-sm font-bold shadow-lg">
          <Plus size={18} />
          Nuevo Ciclo
        </button>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-[#008080]/10 flex items-center justify-center text-[#008080] mx-auto mb-6">
          <ListChecks size={40} />
        </div>
        <h2 className="text-xl font-bold dark:text-white mb-2">Módulo de Ciclos en Desarrollo</h2>
        <p className="text-gray-400 max-w-md mx-auto">Pronto podrás agrupar sesiones en ciclos para un mejor seguimiento de la evolución.</p>
      </div>
    </div>
  );
};
