"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/shared/ui/components/Modal";
import {
  esquemaGrupo,
  type DatosFormularioGrupo,
} from "@/entities/institucion";

export type GroupFormData = DatosFormularioGrupo;

interface GroupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: GroupFormData) => void;
}

export function GroupFormModal({
  isOpen,
  onClose,
  onSave,
}: GroupFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosFormularioGrupo>({
    resolver: zodResolver(esquemaGrupo),
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Grupo">
      <form
        className="space-y-6"
        onSubmit={handleSubmit((data) => onSave(data))}
      >
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Nombre del Grupo
          </label>
          <input
            type="text"
            {...register("nombre")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej: Grupo A - Primaria"
          />
          {errors.nombre && (
            <p className="text-xs text-red-500">{errors.nombre.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Descripción
          </label>
          <textarea
            {...register("descripcion")}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
            rows={3}
            placeholder="Describe el propósito del grupo..."
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
            Crear Grupo
          </button>
        </div>
      </form>
    </Modal>
  );
}
