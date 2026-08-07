"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import {
  esquemaPlanIntervencion,
  type DatosFormularioPlan,
} from "@/entities/plan-tratamiento";

interface InterventionPlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DatosFormularioPlan) => void;
  patientOptions: { label: string; value: string }[];
  onSearchPatient: (term: string) => void;
}

export function InterventionPlanForm({
  isOpen,
  onClose,
  onSubmit,
  patientOptions,
  onSearchPatient,
}: InterventionPlanFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosFormularioPlan>({
    resolver: zodResolver(esquemaPlanIntervencion),
    defaultValues: {
      patientId: "",
      objective: "",
      startDate: new Date().toISOString().split("T")[0],
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Plan de Intervención">
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="space-y-6"
      >
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

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Objetivo Principal
          </label>
          <textarea
            rows={3}
            {...register("objective")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
            placeholder="Describa el objetivo general del plan..."
          />
          {errors.objective && (
            <p className="text-xs text-red-500">{errors.objective.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Fecha de Inicio
          </label>
          <input
            type="date"
            {...register("startDate")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
          />
          {errors.startDate && (
            <p className="text-xs text-red-500">{errors.startDate.message}</p>
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
            Crear Plan
          </button>
        </div>
      </form>
    </Modal>
  );
}
