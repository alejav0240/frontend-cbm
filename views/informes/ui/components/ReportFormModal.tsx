"use client";

import React from "react";
import Modal from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";

interface ReportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientOptions: { label: string; value: string }[];
  onSearchPatient: (term: string) => void;
  newReport: any;
  setNewReport: (val: any) => void;
  onSend: () => void;
}

export function ReportFormModal({
  isOpen,
  onClose,
  patientOptions,
  onSearchPatient,
  newReport,
  setNewReport,
  onSend,
}: ReportFormModalProps) {
  console.log("Patients", patientOptions);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Informe">
      <div className="space-y-6">
        <SearchableSelect
          label="Paciente"
          options={patientOptions}
          value={newReport.patientId}
          onChange={(val) => setNewReport({ ...newReport, patientId: val })}
          onSearch={onSearchPatient}
          placeholder="Buscar paciente..."
        />

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Link del Informe (Drive/PDF)
          </label>
          <input
            type="url"
            value={newReport.reportUrl}
            onChange={(e) =>
              setNewReport({ ...newReport, reportUrl: e.target.value })
            }
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="https://drive.google.com/..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Tipo de Informe
          </label>
          <select
            value={newReport.type}
            onChange={(e) =>
              setNewReport({ ...newReport, type: e.target.value })
            }
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
          >
            <option>Mensual</option>
            <option>Trimestral</option>
            <option>Semestral</option>
            <option>Final</option>
          </select>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onSend}
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
          >
            Enviar Informe
          </button>
        </div>
      </div>
    </Modal>
  );
}
