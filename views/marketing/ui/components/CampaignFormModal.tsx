"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import { MarketingCampaign } from "@/entities/marketing";
import {
  esquemaCampana,
  type DatosFormularioCampana,
} from "@/entities/marketing";

interface CampaignFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Partial<MarketingCampaign>) => void;
  initialData?: Partial<MarketingCampaign> | null;
}

const DEFAULT_FORM: DatosFormularioCampana = {
  name: "",
  platform: "Facebook",
  budget: 0,
  spent: 0,
  status: "Activo",
  startDate: new Date().toISOString().split("T")[0],
};

export function CampaignFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CampaignFormModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DatosFormularioCampana>({
    resolver: zodResolver(esquemaCampana),
    defaultValues: initialData
      ? {
          name: initialData.name ?? "",
          platform: initialData.platform ?? "Facebook",
          budget: initialData.budget ?? 0,
          spent: initialData.spent ?? 0,
          status: initialData.status ?? "Activo",
          startDate: initialData.startDate ?? DEFAULT_FORM.startDate,
        }
      : DEFAULT_FORM,
  });

  const handleSubmitForm = (data: DatosFormularioCampana) => {
    onSave({
      ...data,
      status: data.status as MarketingCampaign["status"],
    });
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? "Editar Campaña" : "Crear Nueva Campaña"}
    >
      <form className="space-y-6" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Nombre de la Campaña
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej: Promo Verano 2026"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Plataforma
            </label>
            <Controller
              name="platform"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { label: "Facebook", value: "Facebook", color: "bg-blue-600" },
                    {
                      label: "Instagram",
                      value: "Instagram",
                      color: "bg-pink-600",
                    },
                    { label: "WhatsApp", value: "WhatsApp", color: "bg-green-600" },
                    { label: "TikTok", value: "TikTok", color: "bg-black" },
                    { label: "Google", value: "Google", color: "bg-red-500" },
                    { label: "Otro", value: "Otro", color: "bg-gray-400" },
                  ]}
                  clearable={false}
                />
              )}
            />
            {errors.platform && (
              <p className="text-xs text-red-500">{errors.platform.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Estado
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { label: "Activo", value: "Activo", color: "bg-green-500" },
                    { label: "Pausado", value: "Pausado", color: "bg-blue-500" },
                    {
                      label: "Finalizado",
                      value: "Finalizado",
                      color: "bg-gray-500",
                    },
                  ]}
                  clearable={false}
                />
              )}
            />
            {errors.status && (
              <p className="text-xs text-red-500">{errors.status.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Presupuesto (Bs.)
            </label>
            <input
              type="number"
              {...register("budget", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.budget && (
              <p className="text-xs text-red-500">{errors.budget.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Invertido (Bs.)
            </label>
            <input
              type="number"
              {...register("spent", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.spent && (
              <p className="text-xs text-red-500">{errors.spent.message}</p>
            )}
          </div>
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
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
          >
            {initialData?.id ? "Guardar Cambios" : "Crear Campaña"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
