"use client";

import React from "react";
import { User, CreditCard, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/shared/ui/components/Modal";
import { Curso } from "@/entities/curso";
import {
  esquemaInscripcion,
  type DatosFormularioInscripcion,
} from "@/entities/curso";

type EnrollFormData = DatosFormularioInscripcion;

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosFormularioInscripcion>({
    resolver: zodResolver(esquemaInscripcion),
    defaultValues: {
      fullName: "",
      carnet: "",
      paymentMethod: "EFECTIVO",
      amount: course?.precio ?? 0,
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Inscribir Estudiante — ${course?.nombre ?? ""}`}
    >
      <form
        className="space-y-6"
        onSubmit={handleSubmit((data) => onSave(data))}
      >
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
              {...register("fullName")}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
              placeholder="Nombre del estudiante"
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-500">{errors.fullName.message}</p>
          )}
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
              {...register("carnet")}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
              placeholder="Número de carnet"
            />
          </div>
          {errors.carnet && (
            <p className="text-xs text-red-500">{errors.carnet.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Método de Pago
            </label>
            <select
              {...register("paymentMethod")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white appearance-none"
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="QR">QR</option>
            </select>
            {errors.paymentMethod && (
              <p className="text-xs text-red-500">
                {errors.paymentMethod.message}
              </p>
            )}
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
                {...register("amount", { valueAsNumber: true })}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-red-500">{errors.amount.message}</p>
            )}
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
            type="submit"
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
          >
            Confirmar Inscripción
          </button>
        </div>
      </form>
    </Modal>
  );
}
