"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  esquemaGasto,
  type DatosFormularioGasto,
} from "@/entities/gasto";

interface ExpenseFormProps {
  categories: string[];
  onSubmit: (data: DatosFormularioGasto) => void;
  onCancel: () => void;
}

export function ExpenseForm({
  categories,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosFormularioGasto>({
    resolver: zodResolver(esquemaGasto),
    defaultValues: {
      descripcion: "",
      categoria: categories[0] ?? "",
      monto: 0,
      fechaGasto: new Date().toISOString().split("T")[0],
      estado: "PENDING",
    },
  });

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit((data) => onSubmit(data))}
    >
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Descripción
        </label>
        <input
          type="text"
          {...register("descripcion")}
          placeholder="Ej: Alquiler de local, Compra de materiales..."
          className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#008080]/20 transition-all"
        />
        {errors.descripcion && (
          <p className="text-xs text-red-500">{errors.descripcion.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Categoría
          </label>
          <select
            {...register("categoria")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#008080]/20 transition-all appearance-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.categoria && (
            <p className="text-xs text-red-500">{errors.categoria.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Monto (Bs)
          </label>
          <input
            type="number"
            {...register("monto", { valueAsNumber: true })}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#008080]/20 transition-all"
          />
          {errors.monto && (
            <p className="text-xs text-red-500">{errors.monto.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Fecha
          </label>
          <input
            type="date"
            {...register("fechaGasto")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#008080]/20 transition-all"
          />
          {errors.fechaGasto && (
            <p className="text-xs text-red-500">{errors.fechaGasto.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Estado
          </label>
          <select
            {...register("estado")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#008080]/20 transition-all appearance-none"
          >
            <option value="PENDING">Pendiente</option>
            <option value="PAID">Pagado</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 bg-[#008080] hover:bg-[#006666] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#008080]/20"
        >
          Guardar Gasto
        </button>
      </div>
    </form>
  );
}
