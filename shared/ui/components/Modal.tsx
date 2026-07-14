"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    return Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
      window.addEventListener("keydown", handleTab);

      requestAnimationFrame(() => {
        const focusable = getFocusableElements();
        if (focusable.length > 0) {
          focusable[0].focus();
        }
      });
    } else {
      document.body.style.overflow = "unset";
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("keydown", handleTab);
    };
  }, [isOpen, onClose, getFocusableElements]);

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
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`relative w-full ${maxWidth} bg-white dark:bg-accent rounded-[40px] shadow-2xl overflow-hidden border border-white/20 dark:border-white/5 flex flex-col`}
          >
            <div className="flex items-center justify-between p-8 sm:p-10 border-b border-gray-100 dark:border-white/5 relative overflow-hidden shrink-0">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#008080] to-transparent opacity-50" />
              <h2 className="text-2xl font-bold dark:text-white serif tracking-tight">
                {title}
              </h2>
              <button
                onClick={onClose}
                aria-label="Cerrar modal"
                className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all hover:rotate-90 dark:text-white group"
              >
                <X
                  size={24}
                  className="group-hover:text-[#008080] transition-colors"
                />
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
