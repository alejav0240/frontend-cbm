"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import {
  esquemaCrearPago,
  type DatosFormularioPago,
} from "@/entities/pago";
import { Descuento } from "@/entities/pago";

export type PaymentFormData = DatosFormularioPago;

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
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<DatosFormularioPago>({
    resolver: zodResolver(esquemaCrearPago),
    defaultValues: {
      patientId: "",
      sessionsCount: 4,
      pricePerSession: 150,
      amountPaid: 600,
      paymentMethod: "efectivo",
      discountId: undefined,
    },
  });

  const sessionsCount = watch("sessionsCount");
  const pricePerSession = watch("pricePerSession");
  const discountId = watch("discountId");

  const calculateTotal = (
    count: number,
    price: number,
    discountId?: string | null,
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

  const handleSubmitForm = (data: DatosFormularioPago) => {
    onAdd({
      ...data,
      discountId: data.discountId || null,
    });
    reset();
  };

  const amountPaid = watch("amountPaid");
  const totalToPay = calculateTotal(
    sessionsCount,
    pricePerSession,
    discountId,
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Pago">
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
        <Controller
          name="patientId"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              label="Paciente"
              options={patientOptions}
              value={field.value}
              onChange={field.onChange}
              onSearch={onSearchPatient}
              isLoading={isLoadingPatients}
              placeholder="Buscar paciente..."
              className={errors.patientId ? "border-red-500" : ""}
            />
          )}
        />
        {errors.patientId && (
          <p className="text-xs text-red-500">{errors.patientId.message}</p>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Número de Sesiones
            </label>
            <input
              type="number"
              {...register("sessionsCount", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.sessionsCount && (
              <p className="text-xs text-red-500">
                {errors.sessionsCount.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Precio por Sesión (Bs.)
            </label>
            <input
              type="number"
              {...register("pricePerSession", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.pricePerSession && (
              <p className="text-xs text-red-500">
                {errors.pricePerSession.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Controller
            name="discountId"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Descuento Aplicado"
                options={[
                  { label: "Ninguno", value: "" },
                  ...discounts.map((d) => ({ label: d.nombre, value: d.id })),
                ]}
                value={field.value || ""}
                onChange={(val) => field.onChange(val || null)}
              />
            )}
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
              {...register("amountPaid", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] outline-none transition-all text-sm dark:text-white"
            />
            {errors.amountPaid && (
              <p className="text-xs text-red-500">
                {errors.amountPaid.message}
              </p>
            )}
            {amountPaid < totalToPay && (
              <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">
                Deuda Restante: Bs. {totalToPay - amountPaid}
              </p>
            )}
          </div>
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Método de Pago"
                options={[
                  { label: "Efectivo", value: "efectivo" },
                  { label: "Transferencia", value: "transferencia" },
                  { label: "QR", value: "qr" },
                  { label: "Tarjeta", value: "tarjeta" },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
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
