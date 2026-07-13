"use client";

import React, { useState } from "react";
import Modal from "@/shared/ui/components/Modal";
import { toast } from "sonner";

interface ModalReprogramarSesionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (nuevaFecha: string, nuevaHora: string) => Promise<void>;
  numeroSesion: number;
  fechaActual?: string;
  horaActual?: string;
  cargando?: boolean;
}

export function ModalReprogramarSesion({
  isOpen,
  onClose,
  onConfirm,
  numeroSesion,
  fechaActual = "",
  horaActual = "",
  cargando,
}: ModalReprogramarSesionProps) {
  const [nuevaFecha, setNuevaFecha] = useState(fechaActual);
  const [nuevaHora, setNuevaHora] = useState(horaActual);

  const handleConfirm = async () => {
    if (!nuevaFecha || !nuevaHora) {
      toast.error("Selecciona fecha y hora");
      return;
    }
    await onConfirm(nuevaFecha, nuevaHora);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reprogramar Sesión #${numeroSesion}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Selecciona la nueva fecha y hora para esta sesión.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Nueva Fecha
            </label>
            <input
              type="date"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Nueva Hora
            </label>
            <input
              type="time"
              value={nuevaHora}
              onChange={(e) => setNuevaHora(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            disabled={cargando}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 disabled:opacity-50"
            disabled={cargando || !nuevaFecha || !nuevaHora}
          >
            {cargando && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Reprogramar
          </button>
        </div>
      </div>
    </Modal>
  );
}
