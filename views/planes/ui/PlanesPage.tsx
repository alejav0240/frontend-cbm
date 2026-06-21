"use client";

import React, { useState } from "react";
import { usePlanesTratamiento } from "@/entities/plan-tratamiento";
import { TablaPlanes } from "@/widgets/lista-planes";
import { Plus, Search, Filter } from "lucide-react";

export const PlanesPage = () => {
  const [paginaActual, setPaginaActual] = useState(1);
  const { planes, total, cargando } = usePlanesTratamiento({
    pagina: paginaActual,
    pageSize: 10,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">
            Planes de Intervención
          </h1>
          <p className="text-gray-400 text-sm">
            Diseña y supervisa los objetivos terapéuticos de tus pacientes
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-2xl text-sm font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20">
          <Plus size={18} />
          Nuevo Plan
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por objetivo o paciente..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/5 focus:border-purple-500 outline-none transition-all text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        <TablaPlanes planes={planes} alSeleccionar={() => {}} />
      </div>
    </div>
  );
};
