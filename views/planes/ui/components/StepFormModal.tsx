"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import {
  esquemaPasoPlan,
  type DatosFormularioPasoPlan,
} from "@/entities/plan-tratamiento";
import {
  MOMENTO_OPTIONS,
  OBJETIVOS_CON_FOCOS,
  ENFOQUES_OPTIONS,
  ENFASIS_MUSICAL_OPTIONS,
  MLT_OPTIONS,
  RECURSOS_MUSICALES_OPTIONS,
} from "@/data/intervention-options";

export interface DatosPasoInicial {
  momento?: string;
  duracion?: number;
  objetivo?: string;
  foco?: string;
  recursosMusicales?: string;
  enfasisMusical?: string;
  enfoque?: string;
  mltEnfoque?: string;
}

interface StepFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DatosFormularioPasoPlan) => void;
  editingStepId: string | number | null;
  initialData?: DatosPasoInicial | null;
}

const OBJETIVOS_OPTIONS = OBJETIVOS_CON_FOCOS.map((o) => o.objetivo);

export function StepFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingStepId,
  initialData,
}: StepFormModalProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DatosFormularioPasoPlan>({
    resolver: zodResolver(esquemaPasoPlan),
    defaultValues: {
      momento: initialData?.momento ?? "",
      duracion: initialData?.duracion ?? 45,
      objetivoPaso: initialData?.objetivo ?? "",
      focoPaso: initialData?.foco ?? "",
      recursosMusicales: initialData?.recursosMusicales ?? "",
      enfasisMusical: initialData?.enfasisMusical ?? "",
      enfoque: initialData?.enfoque ?? "",
      mltEnfoque: initialData?.mltEnfoque ?? "",
    },
  });

  const objetivoPaso = watch("objetivoPaso");
  const recursosMusicales = watch("recursosMusicales");
  const enfasisMusical = watch("enfasisMusical");

  const FOCOS_OPTIONS =
    OBJETIVOS_CON_FOCOS.find((o) => o.objetivo === objetivoPaso)?.focos || [];

  const agregarValor = (actual: string | undefined, val: string): string => {
    const current = (actual ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!current.includes(val)) {
      return [...current, val].join(", ");
    }
    return current.join(", ");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingStepId ? "Editar Paso del Plan" : "Añadir Paso al Plan"}
    >
      <form
        className="space-y-6"
        onSubmit={handleSubmit((data) => onSubmit(data))}
      >
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Controller
              name="momento"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  label="Momento"
                  options={MOMENTO_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Seleccionar momento..."
                />
              )}
            />
            {errors.momento && (
              <p className="text-xs text-red-500">{errors.momento.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Duración (min)
            </label>
            <input
              type="number"
              {...register("duracion", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.duracion && (
              <p className="text-xs text-red-500">{errors.duracion.message}</p>
            )}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Controller
              name="objetivoPaso"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  label="Objetivo"
                  options={OBJETIVOS_OPTIONS}
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    setValue("focoPaso", "");
                  }}
                  placeholder="Seleccionar objetivo..."
                />
              )}
            />
            {errors.objetivoPaso && (
              <p className="text-xs text-red-500">
                {errors.objetivoPaso.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Controller
              name="focoPaso"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  label="Foco"
                  options={FOCOS_OPTIONS}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Seleccionar foco..."
                  disabled={!objetivoPaso}
                />
              )}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Recursos Musicales
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SearchableSelect
              options={RECURSOS_MUSICALES_OPTIONS}
              value=""
              onChange={(val) => {
                if (!val) return;
                setValue("recursosMusicales", agregarValor(recursosMusicales, val));
              }}
              placeholder="Añadir recurso..."
            />
            <input
              type="text"
              {...register("recursosMusicales")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
              placeholder="Ej. Guitarra, Pandereta, Voz..."
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Énfasis Musical
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SearchableSelect
              options={ENFASIS_MUSICAL_OPTIONS}
              value=""
              onChange={(val) => {
                if (!val) return;
                setValue("enfasisMusical", agregarValor(enfasisMusical, val));
              }}
              placeholder="Añadir énfasis..."
            />
            <input
              type="text"
              {...register("enfasisMusical")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
              placeholder="Ej. Encuadre Jazz, Escucha Activa..."
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Controller
              name="enfoque"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  label="Enfoque"
                  options={ENFOQUES_OPTIONS}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Seleccionar enfoque..."
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="mltEnfoque"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  label="MLT"
                  options={MLT_OPTIONS}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Seleccionar MLT..."
                />
              )}
            />
          </div>
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
            {editingStepId ? "Actualizar Paso" : "Añadir Paso"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
