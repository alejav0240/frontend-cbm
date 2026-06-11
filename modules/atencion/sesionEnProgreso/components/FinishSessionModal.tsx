'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';

interface FinishSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function FinishSessionModal({ isOpen, onClose, onConfirm }: FinishSessionModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="¿Finalizar Sesión?"
        >
            <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Se guardarán todas las notas, recursos seleccionados y grabaciones realizadas durante esta sesión. ¿Deseas proceder?
                </p>
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-8 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/25"
                    >
                        Finalizar y Guardar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
