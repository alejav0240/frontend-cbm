"use client";

import React, { useState } from "react";
import { Modal } from "@/shared/ui/components/Modal";
import { Curso } from "@/entities/curso";

export interface CursoFormData {
  name: string;
  description: string;
  price: number;
  state: string;
}

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
  const [formData, setFormData] = useState<CursoFormData>(() => ({
    name: initialData?.nombre ?? "",
    description: initialData?.descripcion ?? "",
    price: initialData?.precio ?? 0,
    state: initialData?.estado ?? "ACTIVE",
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Editar Curso" : "Nuevo Curso"}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Nombre del Curso
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej: Piano para principiantes"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
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
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Estado
            </label>
            <select
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white appearance-none"
            >
              <option value="ACTIVE">Activo</option>
              <option value="ARCHIVED">Cerrado</option>
              <option value="DRAFT">Borrador</option>
            </select>
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
            onClick={() => onSave(formData)}
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
          >
            {initialData ? "Guardar Cambios" : "Crear Curso"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
