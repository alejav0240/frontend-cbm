"use client";

import React, { useState } from "react";
import { User, CreditCard, DollarSign } from "lucide-react";
import { Modal } from "@/shared/ui/components/Modal";
import { Curso } from "@/entities/curso";

interface EnrollFormData {
  fullName: string;
  carnet: string;
  paymentMethod: string;
  amount: number;
}

interface EnrollStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Curso | null;
  onSave: (data: EnrollFormData) => void;
}

export function EnrollStudentModal({
  isOpen,
  onClose,
  course,
  onSave,
}: EnrollStudentModalProps) {
  const [formData, setFormData] = useState<EnrollFormData>({
    fullName: "",
    carnet: "",
    paymentMethod: "EFECTIVO",
    amount: course?.precio ?? 0,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Inscribir Estudiante — ${course?.nombre ?? ""}`}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Nombre Completo
          </label>
          <div className="relative">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
              placeholder="Nombre del estudiante"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Carnet de Identidad
          </label>
          <div className="relative">
            <CreditCard
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={formData.carnet}
              onChange={(e) =>
                setFormData({ ...formData, carnet: e.target.value })
              }
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
              placeholder="Número de carnet"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Método de Pago
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white appearance-none"
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="QR">QR</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Monto a Pagar
            </label>
            <div className="relative">
              <DollarSign
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: Number(e.target.value) })
                }
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(formData)}
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
          >
            Confirmar Inscripción
          </button>
        </div>
      </div>
    </Modal>
  );
}
