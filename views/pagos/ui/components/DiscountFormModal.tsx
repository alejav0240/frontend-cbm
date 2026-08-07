"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import {
  esquemaCrearDescuento,
  type DatosFormularioDescuento,
} from "@/entities/pago";

export type DiscountFormData = DatosFormularioDescuento;

interface DiscountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: DiscountFormData) => void;
}

export function DiscountFormModal({
  isOpen,
  onClose,
  onAdd,
}: DiscountFormModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DatosFormularioDescuento>({
    resolver: zodResolver(esquemaCrearDescuento),
    defaultValues: {
      name: "",
      type: "percentage",
      value: 0,
      description: "",
    },
  });

  const handleSubmitForm = (data: DatosFormularioDescuento) => {
    onAdd({
      ...data,
      description: data.description || null,
    });
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Descuento">
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Nombre del Descuento
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej. Beca Estudiantil"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Tipo"
                options={["Porcentaje", "Monto Fijo"]}
                value={field.value === "percentage" ? "Porcentaje" : "Monto Fijo"}
                onChange={(val) =>
                  field.onChange(val === "Porcentaje" ? "percentage" : "fixed")
                }
              />
            )}
          />
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Valor
            </label>
            <input
              type="number"
              {...register("value", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.value && (
              <p className="text-xs text-red-500">{errors.value.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Descripción
          </label>
          <textarea
            {...register("description")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white h-24 resize-none"
            placeholder="Detalles adicionales sobre el descuento..."
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
            Crear Descuento
          </button>
        </div>
      </form>
    </Modal>
  );
}
