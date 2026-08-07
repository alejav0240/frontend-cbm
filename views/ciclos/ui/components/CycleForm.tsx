"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import {
  esquemaCiclo,
  type DatosFormularioCiclo,
} from "@/entities/sesion";

interface CycleFormProps {
  patientOptions: { label: string; value: string }[];
  therapistOptions: { label: string; value: string }[];
  onSearchTherapist?: (term: string) => void;
  isLoadingTherapists?: boolean;
  onSubmit: (data: DatosFormularioCiclo) => void;
  onCancel: () => void;
}

export function CycleForm({
  patientOptions,
  therapistOptions,
  onSearchTherapist,
  isLoadingTherapists,
  onSubmit,
  onCancel,
}: CycleFormProps) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DatosFormularioCiclo>({
    resolver: zodResolver(esquemaCiclo),
    defaultValues: {
      patientName: "",
      startDate: new Date().toISOString().split("T")[0],
      numSessions: "4",
      therapist: "",
    },
  });

  const numSessions = watch("numSessions");

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit((data) => onSubmit(data))}
    >
      <div className="space-y-2">
        <Controller
          name="patientName"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              label="Paciente"
              options={patientOptions}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.patientName && (
          <p className="text-xs text-red-500">{errors.patientName.message}</p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
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
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Número de Sesiones
          </label>
          <select
            {...register("numSessions")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
          >
            <option value="4">4 Sesiones (Estándar)</option>
            <option value="8">8 Sesiones</option>
            <option value="12">12 Sesiones</option>
          </select>
          {errors.numSessions && (
            <p className="text-xs text-red-500">{errors.numSessions.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Terapeuta Responsable
        </label>
        <Controller
          name="therapist"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              options={therapistOptions}
              value={field.value}
              onChange={field.onChange}
              onSearch={onSearchTherapist}
              isLoading={isLoadingTherapists}
            />
          )}
        />
        {errors.therapist && (
          <p className="text-xs text-red-500">{errors.therapist.message}</p>
        )}
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
