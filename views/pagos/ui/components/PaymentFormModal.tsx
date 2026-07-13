"use client";

import React, { useState } from "react";
import { Modal } from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import { Descuento } from "@/entities/pago";
import { toast } from "sonner";

export interface PaymentFormData {
  patientId: string;
  sessionsCount: number;
  pricePerSession: number;
  amountPaid: number;
  paymentMethod: string;
  discountId?: string | null;
}

interface PaymentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoadingPatients?: boolean;
  patientOptions: { label: string; value: string }[];
  onSearchPatient: (term: string) => void;
  discounts: Descuento[];
  onAdd: (paymentData: PaymentFormData) => void;
}

export function PaymentFormModal({
  isOpen,
  onClose,
  isLoadingPatients,
  patientOptions,
  onSearchPatient,
  discounts,
  onAdd,
}: PaymentFormModalProps) {
  const [newPayment, setNewPayment] = useState({
    patientId: "",
    sessionsCount: 4,
    pricePerSession: 150,
    amountPaid: 600,
    method: "efectivo",
    discountId: undefined as string | undefined,
  });

  const calculateTotal = (
    count: number,
    price: number,
    discountId?: string,
  ) => {
    const base = count * price;
    if (!discountId) return base;
    const discount = discounts.find((d) => d.id === discountId);
    if (!discount) return base;

    const valor = Number(discount.valor);
    if (discount.tipo === "PERCENTAGE") {
      return base * (1 - valor / 100);
    } else {
      return Math.max(0, base - valor);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.patientId) {
      toast.error("Selecciona un paciente");
      return;
    }

    onAdd({
      patientId: newPayment.patientId,
      sessionsCount: newPayment.sessionsCount,
      pricePerSession: newPayment.pricePerSession,
      amountPaid: newPayment.amountPaid,
      paymentMethod: newPayment.method,
      discountId: newPayment.discountId,
    });
  };

  const totalToPay = calculateTotal(
    newPayment.sessionsCount,
    newPayment.pricePerSession,
    newPayment.discountId,
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Pago">
      <form onSubmit={handleSubmit} className="space-y-6">
        <SearchableSelect
          label="Paciente"
          options={patientOptions}
          value={newPayment.patientId}
          onChange={(val) => setNewPayment({ ...newPayment, patientId: val })}
          onSearch={onSearchPatient}
          isLoading={isLoadingPatients}
          placeholder="Buscar paciente..."
        />

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Número de Sesiones
            </label>
            <input
              type="number"
              value={newPayment.sessionsCount}
              onChange={(e) =>
                setNewPayment({
                  ...newPayment,
                  sessionsCount: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Precio por Sesión (Bs.)
            </label>
            <input
              type="number"
              value={newPayment.pricePerSession}
              onChange={(e) =>
                setNewPayment({
                  ...newPayment,
                  pricePerSession: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <SearchableSelect
            label="Descuento Aplicado"
            options={[
              { label: "Ninguno", value: "" },
              ...discounts.map((d) => ({ label: d.nombre, value: d.id })),
            ]}
            value={newPayment.discountId || ""}
            onChange={(val) =>
              setNewPayment({ ...newPayment, discountId: val || undefined })
            }
          />
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#008080] uppercase tracking-widest">
              Total a Pagar (Con Descuento)
            </label>
            <div className="w-full px-4 py-3 bg-[#008080]/10 rounded-xl border-transparent font-bold text-[#008080]">
              Bs. {totalToPay}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Monto Pagado Hoy (Bs.)
            </label>
            <input
              type="number"
              value={newPayment.amountPaid}
              onChange={(e) =>
                setNewPayment({
                  ...newPayment,
                  amountPaid: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {newPayment.amountPaid < totalToPay && (
              <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">
                Deuda Restante: Bs. {totalToPay - newPayment.amountPaid}
              </p>
            )}
          </div>
          <SearchableSelect
            label="Método de Pago"
            options={[
              { label: "Efectivo", value: "efectivo" },
              { label: "Transferencia", value: "transferencia" },
              { label: "QR", value: "qr" },
              { label: "Tarjeta", value: "tarjeta" },
            ]}
            value={newPayment.method}
            onChange={(val) => setNewPayment({ ...newPayment, method: val })}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
          >
            Registrar Pago
          </button>
        </div>
      </form>
    </Modal>
  );
}
