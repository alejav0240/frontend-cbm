"use client";

import React from "react";
import { motion } from "motion/react";
import { Receipt, Calendar, Tag, CreditCard, AlertCircle } from "lucide-react";
import { Gasto } from "@/entities/gasto";

interface TablaGastosProps {
  gastos: Gasto[];
}

export const TablaGastos = ({ gastos }: TablaGastosProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Descripción
            </th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Categoría
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
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
          {gastos.map((gasto, idx) => (
            <motion.tr
              key={gasto.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="hover:bg-gray-50/80 dark:hover:bg-white/2 transition-colors group"
            >
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                    <Receipt size={18} />
                  </div>
                  <span className="text-sm font-bold dark:text-white">
                    {gasto.descripcion}
                  </span>
                </div>
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Tag size={12} />
                  <span>{gasto.categoria}</span>
                </div>
              </td>
              <td className="px-8 py-5 text-sm font-bold text-red-500">
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "BOB",
                }).format(Number(gasto.monto))}
              </td>
              <td className="px-8 py-5 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar size={12} />
                  <span>
                    {new Intl.DateTimeFormat("es-ES").format(
                      new Date(gasto.fechaGasto),
                    )}
                  </span>
                </div>
              </td>
              <td className="px-8 py-5">
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    gasto.estado === "PAID"
                      ? "bg-green-100 text-green-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {gasto.estado === "PAID" ? "Pagado" : "Pendiente"}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
