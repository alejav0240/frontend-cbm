'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Trash2, Download } from 'lucide-react';
import { Payment } from '@/types';

interface PaymentsTableProps {
  payments: Payment[];
  onDelete: (id: number) => void;
  onExportReceipt: (payment: Payment) => void;
}

export function PaymentsTable({ payments, onDelete, onExportReceipt }: PaymentsTableProps) {
  return (
    <div className="bg-white dark:bg-[#111] rounded-[40px] border border-gray-200 dark:border-white/5 shadow-xl shadow-black/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Paciente</th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Tipo</th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Monto</th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Fecha</th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Estado</th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Método</th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Acciones</th>
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
                <td className="px-8 py-5 text-sm dark:text-white font-bold group-hover:text-[#008080] transition-colors">{payment.patientName}</td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 text-[10px] font-bold rounded-lg uppercase tracking-widest">
                    {payment.type}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm font-bold dark:text-white">
                  <div className="flex flex-col">
                    <span>Bs. {payment.amount}</span>
                    {payment.originalAmount && payment.originalAmount !== payment.amount && (
                      <span className="text-[10px] text-gray-400 line-through">Bs. {payment.originalAmount}</span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-gray-500 dark:text-gray-400">{payment.date}</td>
                <td className="px-8 py-5">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    payment.status === 'Pagado' ? 'bg-green-100 text-green-600 dark:bg-green-500/10' : 'bg-orange-100 text-orange-600 dark:bg-orange-500/10'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">{payment.method}</td>
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
