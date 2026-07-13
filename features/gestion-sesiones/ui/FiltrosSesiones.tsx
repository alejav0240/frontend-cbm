"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";

const ESTADO_OPCIONES = [
  { label: "Todos los estados", value: "all" },
  { label: "Agendada", value: "AGENDADA", color: "bg-blue-500" },
  { label: "Confirmada", value: "CONFIRMA", color: "bg-emerald-500" },
  { label: "Completada", value: "COMPLETA", color: "bg-green-500" },
  { label: "Reprogramada", value: "REPROGRAMA", color: "bg-orange-500" },
  { label: "Cancelada", value: "CANCELADA", color: "bg-red-500" },
];

const TIPO_OPCIONES = [
  { label: "Todos los tipos", value: "all" },
  { label: "Individual", value: "individual" },
  { label: "Grupal", value: "group" },
];

interface FiltrosSesionesProps {
  busqueda: string;
  onBusquedaChange: (value: string) => void;
  filtroEstado: string;
  onEstadoChange: (value: string) => void;
  filtroTipo: string;
  onTipoChange: (value: string) => void;
  filtroTerapeuta: string;
  onTerapeutaChange: (value: string) => void;
  terapeutasDisponibles?: string[];
}

export function FiltrosSesiones({
  busqueda,
  onBusquedaChange,
  filtroEstado,
  onEstadoChange,
  filtroTipo,
  onTipoChange,
  filtroTerapeuta,
  onTerapeutaChange,
  terapeutasDisponibles = [],
}: FiltrosSesionesProps) {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filtroEstado !== "all") {
    const opt = ESTADO_OPCIONES.find((o) => o.value === filtroEstado);
    chips.push({
      label: opt?.label ?? filtroEstado,
      onRemove: () => onEstadoChange("all"),
    });
  }
  if (filtroTipo !== "all") {
    const opt = TIPO_OPCIONES.find((o) => o.value === filtroTipo);
    chips.push({
      label: opt?.label ?? filtroTipo,
      onRemove: () => onTipoChange("all"),
    });
  }
  if (filtroTerapeuta) {
    chips.push({
      label: filtroTerapeuta,
      onRemove: () => onTerapeutaChange(""),
    });
  }
  if (busqueda) {
    chips.push({
      label: `Búsqueda: "${busqueda}"`,
      onRemove: () => onBusquedaChange(""),
    });
  }

  const terapeutaOpciones = [
    { label: "Todos los terapeutas", value: "" },
    ...terapeutasDisponibles.map((t) => ({ label: t, value: t })),
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Buscar por paciente o terapeuta..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] focus:ring-2 focus:ring-[#008080]/10 outline-none transition-all text-sm dark:text-white placeholder:text-gray-400"
          />
          {busqueda && (
            <button
              onClick={() => onBusquedaChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <SearchableSelect
          options={ESTADO_OPCIONES}
          value={filtroEstado}
          onChange={onEstadoChange}
          placeholder="Estado"
          clearable={false}
          className="min-w-[180px]"
        />

        <SearchableSelect
          options={TIPO_OPCIONES}
          value={filtroTipo}
          onChange={onTipoChange}
          placeholder="Tipo"
          clearable={false}
          className="min-w-[160px]"
        />

        {terapeutaOpciones.length > 1 && (
          <SearchableSelect
            options={terapeutaOpciones}
            value={filtroTerapeuta}
            onChange={onTerapeutaChange}
            placeholder="Terapeuta"
            clearable={false}
            className="min-w-[180px]"
          />
        )}
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Filtros activos
          </span>
          {chips.map((chip, i) => (
            <button
              key={i}
              onClick={chip.onRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#008080]/10 text-[#008080] rounded-full text-xs font-bold transition-all hover:bg-[#008080]/20 group"
            >
              {chip.label}
              <X
                size={12}
                className="opacity-50 group-hover:opacity-100 transition-opacity"
              />
            </button>
          ))}
          <button
            onClick={() => {
              onBusquedaChange("");
              onEstadoChange("all");
              onTipoChange("all");
              onTerapeutaChange("");
            }}
            className="text-[10px] font-bold text-gray-400 hover:text-[#008080] uppercase tracking-widest transition-colors ml-1"
          >
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  );
}
