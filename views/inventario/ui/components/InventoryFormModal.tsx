"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/shared/ui/components/Modal";
import { ArticuloInventario } from "@/entities/inventario";
import {
  esquemaInventario,
  type DatosFormularioInventario,
} from "@/entities/inventario";

const TIPOS = [
  { value: "INSTRUMENT", label: "Instrumento" },
  { value: "EQUIPMENT", label: "Equipo" },
  { value: "MATERIAL", label: "Material" },
] as const;

const CONDICIONES = [
  { value: "GOOD", label: "Bueno" },
  { value: "FAIR", label: "Regular" },
  { value: "DAMAGED", label: "Dañado" },
] as const;

const ESTADOS = [
  { value: "AVAILABLE", label: "Disponible" },
  { value: "IN_USE", label: "En uso" },
  { value: "MAINTENANCE", label: "Mantenimiento" },
] as const;

export type FormData = DatosFormularioInventario;

interface InventoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
  initialData?: ArticuloInventario | null;
}

export function InventoryFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: InventoryFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosFormularioInventario>({
    resolver: zodResolver(esquemaInventario),
    defaultValues: {
      name: initialData?.nombre ?? "",
      type: initialData?.tipo ?? "INSTRUMENT",
      condition: initialData?.condicion ?? "GOOD",
      room: initialData?.aula ?? "",
      status: initialData?.estado ?? "AVAILABLE",
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Editar Artículo" : "Añadir Artículo al Inventario"}
    >
      <form
        className="space-y-6"
        onSubmit={handleSubmit((data) => onSave(data))}
      >
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Nombre del Instrumento / Material
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="Ej: Piano Yamaha, Set de Maracas..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#008080]/20 transition-all"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Tipo
            </label>
            <select
              {...register("type")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#008080]/20 transition-all appearance-none"
            >
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-xs text-red-500">{errors.type.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Condición
            </label>
            <select
              {...register("condition")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#008080]/20 transition-all appearance-none"
            >
              {CONDICIONES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {errors.condition && (
              <p className="text-xs text-red-500">{errors.condition.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Estado
            </label>
            <select
              {...register("status")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#008080]/20 transition-all appearance-none"
            >
              {ESTADOS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-xs text-red-500">{errors.status.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Aula / Sala
            </label>
            <input
              type="text"
              {...register("room")}
              placeholder="Ej: Sala 1, Aula 3..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#008080]/20 transition-all"
            />
            {errors.room && (
              <p className="text-xs text-red-500">{errors.room.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#008080] hover:bg-[#006666] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#008080]/20"
          >
            Guardar Artículo
          </button>
        </div>
      </form>
    </Modal>
  );
}
