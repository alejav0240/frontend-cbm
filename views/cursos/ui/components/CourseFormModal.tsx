"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/shared/ui/components/Modal";
import { Curso } from "@/entities/curso";
import { esquemaCurso, type DatosFormularioCurso } from "@/entities/curso";

export type CursoFormData = DatosFormularioCurso;

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CursoFormData) => void;
  initialData?: Curso | null;
}

export function CourseFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CourseFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosFormularioCurso>({
    resolver: zodResolver(esquemaCurso),
    defaultValues: {
      name: initialData?.nombre ?? "",
      description: initialData?.descripcion ?? "",
      price: initialData?.precio ?? 0,
      state: initialData?.estado ?? "ACTIVE",
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Editar Curso" : "Nuevo Curso"}
    >
      <form
        className="space-y-6"
        onSubmit={handleSubmit((data) => onSave(data))}
      >
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Nombre del Curso
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej: Piano para principiantes"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Descripción
          </label>
          <textarea
            {...register("description")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
            rows={3}
            placeholder="Breve descripción del curso..."
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Precio (Bs.)
            </label>
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.price && (
              <p className="text-xs text-red-500">{errors.price.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Estado
            </label>
            <select
              {...register("state")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white appearance-none"
            >
              <option value="ACTIVE">Activo</option>
              <option value="ARCHIVED">Cerrado</option>
              <option value="DRAFT">Borrador</option>
            </select>
            {errors.state && (
              <p className="text-xs text-red-500">{errors.state.message}</p>
            )}
          </div>
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
            {initialData ? "Guardar Cambios" : "Crear Curso"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
