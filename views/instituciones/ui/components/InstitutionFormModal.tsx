'use client';

import React from 'react';
import { Modal } from '@/shared/ui/components/Modal';

interface InstitutionFormData {
  nombre: string;
  direccion: string;
  nombreContacto: string;
  telefonoContacto: string;
  emailContacto: string;
}

interface InstitutionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  data: InstitutionFormData;
  onChange: (data: InstitutionFormData) => void;
}

export function InstitutionFormModal({
  isOpen,
  onClose,
  onSave,
  data,
  onChange,
}: InstitutionFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Institución"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre de la Institución</label>
          <input
            type="text"
            value={data.nombre}
            onChange={(e) => onChange({ ...data, nombre: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej: Colegio San Pepito"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dirección</label>
          <input
            type="text"
            value={data.direccion}
            onChange={(e) => onChange({ ...data, direccion: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej: Av. Principal 123"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Persona de Contacto</label>
          <input
            type="text"
            value={data.nombreContacto}
            onChange={(e) => onChange({ ...data, nombreContacto: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej: Lic. Juan Pérez"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Teléfono</label>
            <input
              type="text"
              value={data.telefonoContacto}
              onChange={(e) => onChange({ ...data, telefonoContacto: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
              placeholder="Ej: +591 70000001"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</label>
            <input
              type="email"
              value={data.emailContacto}
              onChange={(e) => onChange({ ...data, emailContacto: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
              placeholder="Ej: contacto@institucion.com"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button onClick={onClose} className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancelar</button>
          <button onClick={onSave} className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg">Guardar Institución</button>
        </div>
      </div>
    </Modal>
  );
}
