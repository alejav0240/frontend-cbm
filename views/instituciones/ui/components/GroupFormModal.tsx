"use client";

import React from "react";
import { Modal } from "@/shared/ui/components/Modal";

interface GroupFormData {
  nombre: string;
  descripcion: string;
}

interface GroupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  data: GroupFormData;
  onChange: (data: GroupFormData) => void;
}

export function GroupFormModal({
  isOpen,
  onClose,
  onSave,
  data,
  onChange,
}: GroupFormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Grupo">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Nombre del Grupo
          </label>
          <input
            type="text"
            value={data.nombre}
            onChange={(e) => onChange({ ...data, nombre: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej: Grupo A - Primaria"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Descripción
          </label>
          <textarea
            value={data.descripcion}
            onChange={(e) => onChange({ ...data, descripcion: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
            rows={3}
            placeholder="Describe el propósito del grupo..."
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
            onClick={onSave}
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
          >
            Crear Grupo
          </button>
        </div>
      </div>
    </Modal>
  );
}
