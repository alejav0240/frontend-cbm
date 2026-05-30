'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Modal from './components/Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger'
}: ConfirmModalProps) {
  const variantColors = {
    danger: 'bg-red-500 hover:bg-red-600 shadow-red-500/20',
    warning: 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20',
    info: 'bg-[#008080] hover:bg-[#006666] shadow-[#008080]/20'
  };

  const iconColors = {
    danger: 'text-red-500 bg-red-50',
    warning: 'text-orange-500 bg-orange-50',
    info: 'text-[#008080] bg-[#008080]/10'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl ${iconColors[variant]}`}>
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`${variantColors[variant]} text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg hover:scale-105 active:scale-95`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
