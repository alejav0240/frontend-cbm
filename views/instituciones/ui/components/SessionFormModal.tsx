'use client';

import React, { useState } from 'react';
import { Modal } from '@/shared/ui/components/Modal';
import { SearchableSelect } from '@/shared/ui/components/SearchableSelect';

interface SessionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { therapistId: string; date: string; time: string; notes?: string }) => Promise<void>;
  therapistOptions: { label: string; value: string }[];
  isLoadingTherapists?: boolean;
  onSearchTherapist?: (term: string) => void;
}

export function SessionFormModal({ isOpen, onClose, onSave, therapistOptions, isLoadingTherapists, onSearchTherapist }: SessionFormModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [therapistId, setTherapistId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!therapistId) return;
    setIsSaving(true);
    try {
      await onSave({ therapistId, date, time, notes });
      setDate(new Date().toISOString().split('T')[0]);
      setTime('09:00');
      setTherapistId('');
      setNotes('');
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Programar Sesión Grupal">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fecha</label>
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hora</label>
            <input type="time" required value={time} onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white" />
          </div>
        </div>
        <SearchableSelect
          label="Terapeuta"
          options={therapistOptions}
          value={therapistId}
          onChange={setTherapistId}
          onSearch={onSearchTherapist}
          isLoading={isLoadingTherapists}
        />
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Notas Iniciales</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
            rows={3} />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancelar</button>
          <button type="submit" disabled={isSaving || !therapistId}
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving ? 'Programando...' : 'Programar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
