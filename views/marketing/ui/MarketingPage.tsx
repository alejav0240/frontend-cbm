"use client";

import React from "react";
import { useCampanasMarketing } from "@/entities/marketing";
import { Megaphone, Target, BarChart, ExternalLink, Plus } from "lucide-react";

export const MarketingPage = () => {
  const { campanas, cargando } = useCampanasMarketing();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Marketing y Leads</h1>
          <p className="text-gray-400 text-sm">Monitorea el alcance y la captación de nuevos pacientes</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#008080] text-white rounded-2xl text-sm font-bold shadow-lg">
          <Plus size={18} />
          Nueva Campaña
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {campanas.map((campana) => (
          <div key={campana.id} className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Megaphone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold dark:text-white">{campana.nombre}</h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{campana.plataforma}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                campana.estado === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
              }`}>
                {campana.estado === "ACTIVE" ? "En Marcha" : "Pausada"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leads</p>
                <p className="text-xl font-bold dark:text-white">{campana.conteoLeads}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gastado</p>
                <p className="text-xl font-bold dark:text-white">Bs. {campana.gastado}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Restante</p>
                <p className="text-xl font-bold text-blue-500">Bs. {campana.presupuestoRestante}</p>
              </div>
            </div>

            <div className="relative h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden mb-6">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-1000" 
                style={{ width: `${(campana.gastado / campana.presupuesto) * 100}%` }}
              />
            </div>

            <button className="w-full py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-xs font-bold text-gray-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2">
              <BarChart size={14} />
              Ver Estadísticas Detalladas
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
