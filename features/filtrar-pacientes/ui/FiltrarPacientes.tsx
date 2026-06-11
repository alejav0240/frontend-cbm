"use client";

import React from "react";
import { Search } from "lucide-react";

interface FiltrarPacientesProps {
  terminoBusqueda: string;
  alCambiarBusqueda: (valor: string) => void;
  filtroEstado: string;
  alCambiarEstado: (valor: string) => void;
}

export const FiltrarPacientes = ({
  terminoBusqueda,
  alCambiarBusqueda,
  filtroEstado,
  alCambiarEstado,
}: FiltrarPacientesProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#008080] transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar por nombre o carnet..."
          value={terminoBusqueda}
          onChange={(e) => alCambiarBusqueda(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/5 focus:border-[#008080] focus:ring-4 focus:ring-[#008080]/10 outline-none transition-all text-sm dark:text-white shadow-sm"
        />
      </div>
      {/* Podríamos añadir el selector de estado aquí si se desea desacoplar más */}
    </div>
  );
};
