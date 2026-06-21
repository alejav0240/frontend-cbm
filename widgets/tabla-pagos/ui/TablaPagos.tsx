"use client";

import React from "react";
import { motion } from "motion/react";
import { DollarSign, Calendar, User, Tag, Receipt } from "lucide-react";
import { Pago } from "@/entities/pago";

interface TablaPagosProps {
  pagos: Pago[];
  alEditar?: (pago: Pago) => void;
  alEliminar?: (id: string) => void;
}

export const TablaPagos = ({
  pagos,
  alEditar,
  alEliminar,
}: TablaPagosProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Paciente
            </th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Detalle Sesiones
            </th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Monto Total
            </th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Pagado
            </th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Deuda
            </th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
          {pagos.map((pago, idx) => (
            <motion.tr
              key={pago.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="hover:bg-gray-50/80 dark:hover:bg-white/2 transition-colors group"
            >
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold dark:text-white">
                      {pago.paciente.fullName}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {new Intl.DateTimeFormat("es-ES").format(
                        new Date(pago.fechaPago),
                      )}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex flex-col">
                  <span className="font-bold">
                    {pago.cantidadSesiones} sesiones
                  </span>
                  <span className="text-xs text-gray-400">
                    {pago.precioPorSesion} / sesión
                  </span>
                </div>
              </td>
              <td className="px-8 py-5 text-sm font-bold dark:text-white">
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "BOB",
                }).format(pago.montoTotal)}
              </td>
              <td className="px-8 py-5 text-sm text-green-600 font-bold">
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "BOB",
                }).format(Number(pago.montoPagado))}
              </td>
              <td className="px-8 py-5 text-sm text-red-500 font-bold">
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "BOB",
                }).format(pago.deuda)}
              </td>
              <td className="px-8 py-5">
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    pago.estadoPago === "PAID"
                      ? "bg-green-100 text-green-600 dark:bg-green-500/10"
                      : pago.estadoPago === "PARTIAL"
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-500/10"
                        : "bg-red-100 text-red-600 dark:bg-red-500/10"
                  }`}
                >
                  {pago.estadoPago === "PAID"
                    ? "Pagado"
                    : pago.estadoPago === "PARTIAL"
                      ? "Parcial"
                      : "Pendiente"}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
