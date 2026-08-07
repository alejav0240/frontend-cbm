"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import {
  esquemaSesionGrupal,
  type DatosFormularioSesionGrupal,
} from "@/entities/sesion";

interface SessionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DatosFormularioSesionGrupal) => Promise<void>;
  therapistOptions: { label: string; value: string }[];
  isLoadingTherapists?: boolean;
  onSearchTherapist?: (term: string) => void;
}

export function SessionFormModal({
  isOpen,
  onClose,
  onSave,
  therapistOptions,
  isLoadingTherapists,
  onSearchTherapist,
}: SessionFormModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DatosFormularioSesionGrupal>({
    resolver: zodResolver(esquemaSesionGrupal),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      time: "09:00",
      therapistId: "",
      notes: "",
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmitForm = async (data: DatosFormularioSesionGrupal) => {
    setIsSaving(true);
    try {
      await onSave(data);
      reset();
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Programar Sesión Grupal">
      <form className="space-y-6" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Fecha
            </label>
            <input
              type="date"
              {...register("date")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.date && (
              <p className="text-xs text-red-500">{errors.date.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Hora
            </label>
            <input
              type="time"
              {...register("time")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.time && (
              <p className="text-xs text-red-500">{errors.time.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
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
              />
            )}
          />
          {errors.therapistId && (
            <p className="text-xs text-red-500">{errors.therapistId.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Notas Iniciales
          </label>
          <textarea
            {...register("notes")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
            rows={3}
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
            disabled={isSaving}
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Programando..." : "Programar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
