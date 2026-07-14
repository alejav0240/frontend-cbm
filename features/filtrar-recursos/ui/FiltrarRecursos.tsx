"use client";

import React from "react";
import { Search } from "lucide-react";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";

const TIPO_OPTIONS = [
  { label: "Todos los tipos", value: "" },
  { label: "Audio", value: "AUDIO" },
  { label: "Video", value: "VIDEO" },
  { label: "Imagen", value: "IMAGE" },
  { label: "Partitura", value: "SHEET_MUSIC" },
  { label: "Documento", value: "DOCUMENT" },
  { label: "Enlace Web", value: "WEB_LINK" },
];

interface FiltrarRecursosProps {
  terminoBusqueda: string;
  alCambiarBusqueda: (valor: string) => void;
  filtroTipo: string;
  alCambiarTipo: (valor: string) => void;
}

export const FiltrarRecursos = ({
  terminoBusqueda,
  alCambiarBusqueda,
  filtroTipo,
  alCambiarTipo,
}: FiltrarRecursosProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 group">
        <label htmlFor="search-recursos" className="sr-only">Buscar recursos</label>
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#008080] transition-colors"
          size={18}
        />
        <input
          id="search-recursos"
          type="text"
          placeholder="Buscar por título o categoría..."
          value={terminoBusqueda}
          onChange={(e) => alCambiarBusqueda(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/5 focus-visible:border-[#008080] focus-visible:ring-4 focus-visible:ring-[#008080]/10 outline-none transition-all text-sm dark:text-white shadow-sm"
        />
      </div>
      <div className="w-full sm:w-56">
        <SearchableSelect
          options={TIPO_OPTIONS}
          value={filtroTipo}
          onChange={alCambiarTipo}
          placeholder="Filtrar por tipo"
          clearable={false}
        />
      </div>
    </div>
  );
};
