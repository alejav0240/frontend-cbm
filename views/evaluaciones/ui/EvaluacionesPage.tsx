"use client";

import React from "react";
import { ClipboardList, Plus } from "lucide-react";

export const EvaluacionesPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">
            Evaluaciones Clínicas
          </h1>
          <p className="text-gray-400 text-sm">
            Gestiona pruebas, escalas y valoraciones iniciales
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-amber-500 text-white rounded-2xl text-sm font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20">
          <Plus size={18} />
          Nueva Evaluación
        </button>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-6">
          <ClipboardList size={40} />
        </div>
        <h2 className="text-xl font-bold dark:text-white mb-2">
          Módulo de Evaluaciones
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Estamos migrando las escalas de valoración y pruebas estandarizadas a
          este nuevo formato.
        </p>
      </div>
    </div>
  );
};
