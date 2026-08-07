"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import {
  esquemaInforme,
  type DatosFormularioInforme,
} from "@/entities/informes";

export type NuevoInforme = DatosFormularioInforme;

interface ReportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientOptions: { label: string; value: string }[];
  onSearchPatient: (term: string) => void;
  onSend: (data: NuevoInforme) => void;
}

export function ReportFormModal({
  isOpen,
  onClose,
  patientOptions,
  onSearchPatient,
  onSend,
}: ReportFormModalProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosFormularioInforme>({
    resolver: zodResolver(esquemaInforme),
    defaultValues: {
      patientId: "",
      reportUrl: "",
      type: "Mensual",
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Informe">
      <form
        className="space-y-6"
        onSubmit={handleSubmit((data) => onSend(data))}
      >
        <div className="space-y-2">
          <Controller
            name="patientId"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Paciente"
                options={patientOptions}
                value={field.value}
                onChange={field.onChange}
                onSearch={onSearchPatient}
                placeholder="Buscar paciente..."
              />
            )}
          />
          {errors.patientId && (
            <p className="text-xs text-red-500">{errors.patientId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Link del Informe (Drive/PDF)
          </label>
          <input
            type="url"
            {...register("reportUrl")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="https://drive.google.com/..."
          />
          {errors.reportUrl && (
            <p className="text-xs text-red-500">{errors.reportUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Tipo de Informe
          </label>
          <select
            {...register("type")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
          >
            <option>Mensual</option>
            <option>Trimestral</option>
            <option>Semestral</option>
            <option>Final</option>
          </select>
          {errors.type && (
            <p className="text-xs text-red-500">{errors.type.message}</p>
          )}
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
            Enviar Informe
          </button>
        </div>
      </form>
    </Modal>
  );
}
