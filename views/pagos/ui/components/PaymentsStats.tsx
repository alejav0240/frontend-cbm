"use client";

import React from "react";
import { Pago } from "@/entities/pago";

interface PaymentsStatsProps {
  payments: Pago[];
}

export function PaymentsStats({ payments }: PaymentsStatsProps) {
  const totalIncome = payments.reduce(
    (acc, curr) =>
      curr.estadoPago === "PAID" ? acc + (curr.montoTotal || 0) : acc,
    0,
  );
  const pendingIncome = payments.reduce(
    (acc, curr) =>
      curr.estadoPago === "PENDING" ? acc + (curr.montoTotal || 0) : acc,
    0,
  );
  const pendingCount = payments.filter(
    (p) => p.estadoPago === "PENDING",
  ).length;

  return (
    <div className="grid sm:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">
          Ingresos del Mes
        </p>
        <p className="text-3xl font-bold dark:text-white">Bs. {totalIncome}</p>
        <p className="text-[10px] font-bold text-green-500 mt-2">
          +12% vs mes anterior
        </p>
      </div>
      <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">
          Pendientes de Cobro
        </p>
        <p className="text-3xl font-bold dark:text-white">
          Bs. {pendingIncome}
        </p>
        <p className="text-[10px] font-bold text-orange-500 mt-2">
          {pendingCount} pacientes pendientes
        </p>
      </div>
      <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">
          Total Anual
        </p>
        <p className="text-3xl font-bold dark:text-white">
          Bs. {totalIncome * 12}
        </p>
        <p className="text-[10px] font-bold text-blue-500 mt-2">
          Proyección Bs. {totalIncome * 15}
        </p>
      </div>
    </div>
  );
}
