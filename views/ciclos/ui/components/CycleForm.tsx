"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";

interface CycleFormProps {
  patientName: string;
  setPatientName: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  numSessions: string;
  setNumSessions: (val: string) => void;
  therapist: string;
  setTherapist: (val: string) => void;
  patientOptions: { label: string; value: string }[];
  therapistOptions: { label: string; value: string }[];
  onSearchTherapist?: (term: string) => void;
  isLoadingTherapists?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function CycleForm({
  patientName,
  setPatientName,
  startDate,
  setStartDate,
  numSessions,
  setNumSessions,
  therapist,
  setTherapist,
  patientOptions,
  therapistOptions,
  onSearchTherapist,
  isLoadingTherapists,
  onSubmit,
  onCancel,
}: CycleFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <SearchableSelect
        label="Paciente"
        options={patientOptions}
        value={patientName}
        onChange={setPatientName}
      />

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Fecha de Inicio
          </label>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Número de Sesiones
          </label>
          <select
            value={numSessions}
            onChange={(e) => setNumSessions(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
          >
            <option value="4">4 Sesiones (Estándar)</option>
            <option value="8">8 Sesiones</option>
            <option value="12">12 Sesiones</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Terapeuta Responsable
        </label>
        <SearchableSelect
          options={therapistOptions}
          value={therapist}
          onChange={setTherapist}
          onSearch={onSearchTherapist}
          isLoading={isLoadingTherapists}
        />
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-200 dark:border-blue-500/10 flex items-start gap-3">
        <AlertCircle className="text-blue-500 shrink-0" size={20} />
        <p className="text-xs text-blue-700 dark:text-blue-400">
          Al crear el ciclo, se generarán automáticamente las {numSessions}{" "}
          sesiones programadas semanalmente a partir de la fecha de inicio.
        </p>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
        >
          Crear Ciclo
        </button>
      </div>
    </form>
  );
}
