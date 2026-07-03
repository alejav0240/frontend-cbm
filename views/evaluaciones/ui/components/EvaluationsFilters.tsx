"use client";

import React from "react";
import { Search } from "lucide-react";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";

interface ScaleOption {
  id: string;
  nombre: string;
}

interface EvaluationsFiltersProps {
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  scaleId: string;
  onScaleChange: (value: string) => void;
  scales: ScaleOption[];
}

export function EvaluationsFilters({
  total,
  search,
  onSearchChange,
  scaleId,
  onScaleChange,
  scales,
}: EvaluationsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="relative flex-1 w-full sm:w-auto">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por paciente..."
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
        />
      </div>

      <div className="w-full sm:w-64">
        <SearchableSelect
          options={scales.map((s) => ({ label: s.nombre ?? "", value: String(s.id) }))}
          value={scaleId}
          onChange={onScaleChange}
          placeholder="Todas las escalas"
          clearable
        />
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {total} evaluación{total !== 1 ? "es" : ""} en total
      </div>
    </div>
  );
}
