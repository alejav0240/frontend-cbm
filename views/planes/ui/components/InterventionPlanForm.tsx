"use client";

import React from "react";
import Modal from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";

interface InterventionPlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  patientId: string;
  setPatientId: (val: string) => void;
  objective: string;
  setObjective: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  patientOptions: { label: string; value: string }[];
  onSearchPatient: (term: string) => void;
}

export function InterventionPlanForm({
  isOpen,
  onClose,
  onSubmit,
  patientId,
  setPatientId,
  objective,
  setObjective,
  startDate,
  setStartDate,
  patientOptions,
  onSearchPatient,
}: InterventionPlanFormProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Plan de Intervención">
      <form onSubmit={onSubmit} className="space-y-6">
        <SearchableSelect
          label="Paciente"
          options={patientOptions}
          value={patientId}
          onChange={setPatientId}
          onSearch={onSearchPatient}
          placeholder="Buscar paciente..."
        />

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Objetivo Principal
          </label>
          <textarea
            rows={3}
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
            placeholder="Describa el objetivo general del plan..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Fecha de Inicio
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
          >
            Crear Plan
          </button>
        </div>
      </form>
    </Modal>
  );
}
