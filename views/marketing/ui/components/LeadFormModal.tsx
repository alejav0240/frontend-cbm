"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import { MarketingLead } from "@/entities/marketing";
import {
  esquemaLead,
  type DatosFormularioLead,
} from "@/entities/marketing";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<MarketingLead>) => void;
  initialData?: Partial<MarketingLead> | null;
  openCampaigns: { label: string; value: string; color: string }[];
}

const DEFAULT_FORM: DatosFormularioLead = {
  name: "",
  phone: "",
  email: "",
  source: "",
  status: "Nuevo",
  notes: "",
};

export function LeadFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  openCampaigns,
}: LeadFormModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DatosFormularioLead>({
    resolver: zodResolver(esquemaLead),
    defaultValues: initialData
      ? {
          name: initialData.name ?? "",
          phone: initialData.phone ?? "",
          email: initialData.email ?? "",
          source: initialData.source ?? "",
          status: initialData.status ?? "Nuevo",
          notes: initialData.notes ?? "",
        }
      : DEFAULT_FORM,
  });

  const handleSubmitForm = (data: DatosFormularioLead) => {
    onSave({
      ...data,
      status: data.status as MarketingLead["status"],
    });
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? "Editar Lead" : "Registrar Nuevo Lead"}
    >
      <form className="space-y-6" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Nombre Completo
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Nombre del prospecto"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Teléfono / WhatsApp
            </label>
            <input
              type="text"
              {...register("phone")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
              placeholder="Ej: +591 70000000"
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Email (Opcional)
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
              placeholder="correo@ejemplo.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Origen / Campaña
            </label>
            <Controller
              name="source"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { label: "Directo / Orgánico", value: "Directo" },
                    ...openCampaigns,
                  ]}
                  placeholder="Seleccionar campaña..."
                  clearable={false}
                />
              )}
            />
            {errors.source && (
              <p className="text-xs text-red-500">{errors.source.message}</p>
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
                    { label: "Nuevo", value: "Nuevo", color: "bg-purple-500" },
                    {
                      label: "Contactado",
                      value: "Contactado",
                      color: "bg-blue-500",
                    },
                    {
                      label: "Interesado",
                      value: "Interesado",
                      color: "bg-blue-500",
                    },
                    {
                      label: "Convertido",
                      value: "Convertido",
                      color: "bg-green-500",
                    },
                    { label: "Perdido", value: "Perdido", color: "bg-gray-500" },
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
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Notas
          </label>
          <textarea
            {...register("notes")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
            rows={3}
            placeholder="Información adicional..."
          />
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
            {initialData?.id ? "Guardar Cambios" : "Registrar Lead"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
