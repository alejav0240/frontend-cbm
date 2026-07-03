'use client';

import React from 'react';
import { Modal } from '@/shared/ui/components/Modal';
import type { FormTemplate } from '@/entities/formulario';

interface FormPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedForm: FormTemplate | null;
}

export function FormPreviewModal({ isOpen, onClose, selectedForm }: FormPreviewModalProps) {
  console.log('Selected Form for Preview:', selectedForm);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Vista Previa: ${selectedForm?.name}`}>
      <div className="space-y-8">
        <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[40px] border border-gray-100 dark:border-white/5">
          <h3 className="text-2xl font-bold mb-2 dark:text-white serif">{selectedForm?.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{selectedForm?.description}</p>
          <div className="space-y-6">
            {selectedForm?.questions.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  {field.question}
                  {field.isRequired && <span className="text-red-500">*</span>}
                </label>
                {field.questionType === 'text' && (
                  <input type="text" className="w-full px-4 py-3 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 outline-none focus:border-[#008080] transition-all text-sm dark:text-white" placeholder="..." />
                )}
                {field.questionType === 'text_long' && (
                  <textarea rows={3} className="w-full px-4 py-3 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 outline-none focus:border-[#008080] transition-all text-sm dark:text-white resize-none" placeholder="..." />
                )}
                {field.questionType === 'number' && (
                  <input type="number" className="w-full px-4 py-3 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 outline-none focus:border-[#008080] transition-all text-sm dark:text-white" placeholder="0" />
                )}
                {field.questionType === 'date' && (
                  <input type="date" className="w-full px-4 py-3 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 outline-none focus:border-[#008080] transition-all text-sm dark:text-white" />
                )}
                {field.questionType === 'boolean' && (
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#008080] focus:ring-[#008080]" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sí / No</span>
                  </div>
                )}
                {field.questionType === 'scale' && (
                  <input type="range" min={0} max={10} className="w-full accent-[#008080]" />
                )}
                {field.questionType === 'multiple_choice' && (
                  <input type="text" className="w-full px-4 py-3 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 outline-none focus:border-[#008080] transition-all text-sm dark:text-white" placeholder="Seleccionar..." />
                )}
              </div>
            ))}
            {selectedForm?.questions.length === 0 && (
              <p className="text-center py-12 text-gray-400 italic">Este formulario no tiene campos definidos.</p>
            )}
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button 
            onClick={onClose}
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
          >
            Cerrar Vista Previa
          </button>
        </div>
      </div>
    </Modal>
  );
}
