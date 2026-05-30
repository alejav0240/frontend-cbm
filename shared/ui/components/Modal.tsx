'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            role="dialog"
            aria-modal="true"
            className={`relative w-full ${maxWidth} bg-white dark:bg-accent rounded-[40px] shadow-2xl overflow-hidden border border-white/20 dark:border-white/5 flex flex-col`}
          >
            <div className="flex items-center justify-between p-8 sm:p-10 border-b border-gray-100 dark:border-white/5 relative overflow-hidden shrink-0">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#008080] to-transparent opacity-50" />
              <h2 className="text-2xl font-bold dark:text-white serif tracking-tight">{title}</h2>
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all hover:rotate-90 dark:text-white group"
              >
                <X size={24} className="group-hover:text-[#008080] transition-colors" />
              </button>
            </div>
            <div className="p-8 sm:p-10 max-h-[75vh] overflow-y-auto custom-scrollbar bg-white dark:bg-accent">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
