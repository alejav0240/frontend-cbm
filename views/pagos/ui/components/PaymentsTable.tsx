"use client";

import React from "react";
import { motion } from "motion/react";
import { Trash2, Download } from "lucide-react";
import { Pago } from "@/entities/pago";

interface PaymentsTableProps {
  payments: Pago[];
  onDelete: (id: string) => void;
  onExportReceipt: (payment: Pago) => void;
}

function formatStatus(status: string) {
  switch (status) {
    case "PAID":
      return "Pagado";
    case "PARTIAL":
      return "Parcial";
    case "PENDING":
      return "Pendiente";
    default:
      return status;
  }
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("es-ES").format(new Date(date));
}

export function PaymentsTable({
  payments,
  onDelete,
  onExportReceipt,
}: PaymentsTableProps) {
  return (
    <div className="bg-white dark:bg-[#111] rounded-[40px] border border-gray-200 dark:border-white/5 shadow-xl shadow-black/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Paciente
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Monto
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Fecha
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Estado
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Método
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {payments.map((payment, idx) => (
              <motion.tr
                key={payment.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-gray-50/80 dark:hover:bg-white/2 transition-colors group"
              >
                <td className="px-8 py-5 text-sm dark:text-white font-bold group-hover:text-[#008080] transition-colors">
                  {payment.paciente.fullName}
                </td>
                <td className="px-8 py-5 text-sm font-bold dark:text-white">
                  <div className="flex flex-col">
                    <span>Bs. {payment.montoTotal}</span>
                    {payment.deuda > 0 && (
                      <span className="text-[10px] text-red-400">
                        Deuda: Bs. {payment.deuda}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(payment.fechaPago)}
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      payment.estadoPago === "PAID"
                        ? "bg-green-100 text-green-600 dark:bg-green-500/10"
                        : payment.estadoPago === "PARTIAL"
                          ? "bg-amber-100 text-amber-600 dark:bg-amber-500/10"
                          : "bg-red-100 text-red-600 dark:bg-red-500/10"
                    }`}
                  >
                    {formatStatus(payment.estadoPago)}
                  </span>
                </td>
                <td className="px-8 py-5 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                  {payment.metodoPago}
                </td>
                <td className="px-8 py-5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onDelete(payment.id)}
                      className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => onExportReceipt(payment)}
                      className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-[#008080] hover:bg-[#008080]/10 transition-all"
                      title="Descargar Recibo"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
