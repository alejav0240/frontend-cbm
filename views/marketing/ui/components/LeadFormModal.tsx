'use client';

import React, { useState } from 'react';
import { Modal } from '@/shared/ui/components/Modal';
import { SearchableSelect } from '@/shared/ui/components/SearchableSelect';
import { MarketingLead } from '@/entities/marketing';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<MarketingLead>) => void;
  initialData?: Partial<MarketingLead> | null;
  openCampaigns: { label: string, value: string, color: string }[];
}

const DEFAULT_FORM: Partial<MarketingLead> = {
  name: '',
  phone: '',
  email: '',
  source: '',
  status: 'Nuevo',
  notes: ''
};

export function LeadFormModal({ isOpen, onClose, onSave, initialData, openCampaigns }: LeadFormModalProps) {
  const [formData, setFormData] = useState<Partial<MarketingLead>>(initialData || DEFAULT_FORM);

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? "Editar Lead" : "Registrar Nuevo Lead"}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre Completo</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Nombre del prospecto"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Teléfono / WhatsApp</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
              placeholder="Ej: +591 70000000"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email (Opcional)</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Origen / Campaña</label>
            <SearchableSelect
              value={formData.source || ''}
              onChange={(val) => setFormData({ ...formData, source: val })}
              options={[
                { label: 'Directo / Orgánico', value: 'Directo' },
                ...openCampaigns
              ]}
              placeholder="Seleccionar campaña..."
              clearable={false}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</label>
            <SearchableSelect
              value={formData.status || ''}
              onChange={(val) => setFormData({ ...formData, status: val as MarketingLead['status'] })}
              options={[
                { label: 'Nuevo', value: 'Nuevo', color: 'bg-purple-500' },
                { label: 'Contactado', value: 'Contactado', color: 'bg-blue-500' },
                { label: 'Interesado', value: 'Interesado', color: 'bg-blue-500' },
                { label: 'Convertido', value: 'Convertido', color: 'bg-green-500' },
                { label: 'Perdido', value: 'Perdido', color: 'bg-gray-500' }
              ]}
              clearable={false}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Notas</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
            rows={3}
            placeholder="Información adicional..."
          />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button onClick={onClose} className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancelar</button>
          <button onClick={handleSubmit} className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg">
            {initialData?.id ? "Guardar Cambios" : "Registrar Lead"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
