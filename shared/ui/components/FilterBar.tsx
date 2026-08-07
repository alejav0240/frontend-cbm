"use client";

import React from "react";
import { X } from "lucide-react";
import { SearchableSelect } from "./SearchableSelect";

export interface FiltroDefinicion {
  clave: string;
  etiqueta: string;
  opciones: { label: string; value: string; color?: string }[];
  valor: string;
  alCambiar: (valor: string) => void;
  valorTodos?: string;
}

interface FilterBarProps {
  filtros: FiltroDefinicion[];
  onLimpiar: () => void;
}

export function FilterBar({ filtros, onLimpiar }: FilterBarProps) {
  const chips: { label: string; onRemove: () => void }[] = [];

  for (const filtro of filtros) {
    const valorTodos = filtro.valorTodos ?? "all";
    if (!filtro.valor || filtro.valor === valorTodos) continue;
    const opt = filtro.opciones.find((o) => o.value === filtro.valor);
    chips.push({
      label: opt?.label ?? filtro.valor,
      onRemove: () => filtro.alCambiar(valorTodos),
    });
  }

  if (filtros.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {filtros.map((filtro) => (
          <SearchableSelect
            key={filtro.clave}
            options={filtro.opciones}
            value={filtro.valor}
            onChange={filtro.alCambiar}
            placeholder={filtro.etiqueta}
            clearable={false}
            className="min-w-[170px]"
          />
        ))}
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
            onClick={onLimpiar}
            className="text-[10px] font-bold text-gray-400 hover:text-[#008080] uppercase tracking-widest transition-colors ml-1"
          >
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  );
}
