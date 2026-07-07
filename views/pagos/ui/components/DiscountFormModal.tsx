'use client';

import React, { useState } from 'react';
import { Modal } from '@/shared/ui/components/Modal';
import { SearchableSelect } from '@/shared/ui/components/SearchableSelect';

export interface DiscountFormData {
  name: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  description?: string | null;
}

interface DiscountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: DiscountFormData) => void;
}

export function DiscountFormModal({ isOpen, onClose, onAdd }: DiscountFormModalProps) {
  const [newDiscount, setNewDiscount] = useState({
    name: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    value: 0,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newDiscount);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Descuento">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre del Descuento</label>
          <input 
            type="text"
            required
            value={newDiscount.name}
            onChange={(e) => setNewDiscount({...newDiscount, name: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            placeholder="Ej. Beca Estudiantil"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <SearchableSelect 
            label="Tipo"
            options={['Porcentaje', 'Monto Fijo']}
            value={newDiscount.type === 'PERCENTAGE' ? 'Porcentaje' : 'Monto Fijo'}
            onChange={(val) => setNewDiscount({...newDiscount, type: val === 'Porcentaje' ? 'PERCENTAGE' : 'FIXED'})}
          />
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Valor</label>
            <input 
              type="number"
              required
              value={newDiscount.value}
              onChange={(e) => setNewDiscount({...newDiscount, value: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Descripción</label>
          <textarea 
            value={newDiscount.description}
            onChange={(e) => setNewDiscount({...newDiscount, description: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white h-24 resize-none"
            placeholder="Detalles adicionales sobre el descuento..."
          />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancelar</button>
          <button type="submit" className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg">Crear Descuento</button>
        </div>
      </form>
    </Modal>
  );
}
