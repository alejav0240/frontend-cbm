"use client";

import React from "react";
import { motion } from "motion/react";
import { Search, Filter, Download, Trash2, DollarSign } from "lucide-react";
import { Gasto } from "@/entities/gasto";

interface ExpensesTableProps {
  expenses: Gasto[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onToggleStatus: (id: string) => void;
  onDeleteRequest: (id: string) => void;
}

export function ExpensesTable({
  expenses,
  searchTerm,
  setSearchTerm,
  onToggleStatus,
  onDeleteRequest,
}: ExpensesTableProps) {
  return (
    <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por descripción o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-3 text-gray-400 hover:text-[#008080] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all">
            <Filter size={20} />
          </button>
          <button className="p-3 text-gray-400 hover:text-[#008080] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/2">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Descripción
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Categoría
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Monto
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Fecha
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Estado
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {expenses.map((expense) => (
              <motion.tr
                key={expense.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors group"
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-bold dark:text-white">
                    {expense.descripcion}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-full">
                    {expense.categoria}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-red-500">
                    -
                    {Number(expense.monto).toLocaleString("es-BO", {
                      style: "currency",
                      currency: "BOB",
                    })}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-500">
                    {new Intl.DateTimeFormat("es-ES").format(
                      new Date(expense.fechaGasto),
                    )}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onToggleStatus(expense.id)}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest transition-all ${
                      expense.estado === "PAID"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {expense.estado === "PAID" ? "Pagado" : "Pendiente"}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onDeleteRequest(expense.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400">
                      <DollarSign size={32} />
                    </div>
                    <p className="text-gray-500 italic">
                      No se encontraron gastos registrados
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
