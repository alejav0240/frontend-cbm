"use client";

import React from "react";
import { Calendar as CalendarIcon, Clock, Plus } from "lucide-react";

export const AgendaPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Agenda y Citas</h1>
          <p className="text-gray-400 text-sm">
            Organiza tus sesiones y eventos del centro
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#008080] text-white rounded-2xl text-sm font-bold hover:bg-[#006666] transition-all shadow-lg">
          <Plus size={18} />
          Nueva Cita
        </button>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 shadow-xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-20 h-20 rounded-full bg-[#008080]/10 flex items-center justify-center text-[#008080] mb-6">
          <CalendarIcon size={40} />
        </div>
        <h2 className="text-xl font-bold dark:text-white mb-2">
          Calendario en Construcción
        </h2>
        <p className="text-gray-400 max-w-md">
          Estamos integrando el calendario interactivo para que puedas gestionar
          tus citas de forma más visual.
        </p>
      </div>
    </div>
  );
};
