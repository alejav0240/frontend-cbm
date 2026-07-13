"use client";

import React from "react";
import { Modal } from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import { UseFormReturn, Controller } from "react-hook-form";
import { SessionFormData } from "@/shared/lib/schemas/sesion";

interface SessionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  form: UseFormReturn<SessionFormData>;
  patientOptions: { label: string; value: string }[];
  therapistOptions: { label: string; value: string }[];
  onSearchPatient: (term: string) => void;
  onSearchTherapist: (term: string) => void;
  isLoadingPatients: boolean;
  isLoadingTherapists: boolean;
  isSubmitting: boolean;
}

export function SessionFormModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  patientOptions,
  therapistOptions,
  onSearchPatient,
  onSearchTherapist,
  isLoadingPatients,
  isLoadingTherapists,
  isSubmitting,
}: SessionFormModalProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Nueva Sesión">
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="grid sm:grid-cols-2 gap-6">
          <Controller
            name="patientId"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Cliente"
                options={patientOptions}
                value={field.value}
                onChange={field.onChange}
                onSearch={onSearchPatient}
                isLoading={isLoadingPatients}
                placeholder="Buscar paciente..."
                className={errors.patientId ? "border-red-500" : ""}
              />
            )}
          />
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Tipo de Sesión
            </label>
            <select
              {...register("sessionType")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            >
              <option value="individual">Individual</option>
              <option value="group">Grupal</option>
            </select>
            {errors.sessionType && (
              <p className="text-[10px] text-red-500 font-bold uppercase">
                {errors.sessionType.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Fecha
            </label>
            <input
              type="date"
              {...register("sessionDate")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.sessionDate && (
              <p className="text-[10px] text-red-500 font-bold uppercase">
                {errors.sessionDate.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Hora
            </label>
            <input
              type="time"
              {...register("sessionTime")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.sessionTime && (
              <p className="text-[10px] text-red-500 font-bold uppercase">
                {errors.sessionTime.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <Controller
            name="therapistId"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Terapeuta"
                options={therapistOptions}
                value={field.value}
                onChange={field.onChange}
                onSearch={onSearchTherapist}
                isLoading={isLoadingTherapists}
                placeholder="Seleccionar terapeuta..."
              />
            )}
          />
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Duración Real (min)
            </label>
            <input
              type="number"
              {...register("durationMinutes")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
              placeholder="Ej. 45"
            />
            {errors.durationMinutes && (
              <p className="text-[10px] text-red-500 font-bold uppercase">
                {errors.durationMinutes.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Descripción de Ejecución
          </label>
          <textarea
            rows={3}
            {...register("executionDescription")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
            placeholder="Actividades realizadas..."
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Apuntes Terapéuticos
          </label>
          <textarea
            rows={3}
            {...register("notes")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
            placeholder="Observaciones clínicas..."
          ></textarea>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {isSubmitting ? "Registrando..." : "Registrar Sesión"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
