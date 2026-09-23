"use client";

import React from "react";
import { Search } from "lucide-react";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";

const ESTADO_OPTIONS = [
  { label: "Todos los estados", value: "Todos" },
  { label: "En curso", value: "En curso" },
  { label: "Finalizado", value: "Finalizado" },
];

interface InterventionPlanFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  patientFilter: string;
  onPatientChange: (patientId: string) => void;
  patientOptions: { label: string; value: string }[];
  onSearchPatient?: (term: string) => void;
}

export function InterventionPlanFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  patientFilter,
  onPatientChange,
  patientOptions,
  onSearchPatient,
}: InterventionPlanFiltersProps) {
  const pacientesConTodos = [
    { label: "Todos los pacientes", value: "Todos" },
    ...patientOptions,
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
      {/* Input de búsqueda por texto */}
      <div className="sm:col-span-6 relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por objetivo o paciente..."
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
        />
      </div>

      {/* Filtro por estado */}
      <div className="sm:col-span-3">
        <SearchableSelect
          options={ESTADO_OPTIONS}
          value={statusFilter}
          onChange={onStatusChange}
          placeholder="Estado"
        />
      </div>

      {/* Filtro por paciente */}
      <div className="sm:col-span-3">
        <SearchableSelect
          options={pacientesConTodos}
          value={patientFilter}
          onChange={onPatientChange}
          onSearch={onSearchPatient}
          placeholder="Paciente"
        />
      </div>
    </div>
  );
}
