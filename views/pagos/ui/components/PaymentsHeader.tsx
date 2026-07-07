'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Plus, Download } from 'lucide-react';

interface PaymentsHeaderProps {
  activeTab: 'payments' | 'discounts';
  onExport: () => void;
  onAction: () => void;
}

export function PaymentsHeader({ activeTab, onExport, onAction }: PaymentsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold dark:text-white serif">Gestión de <span className="text-[#008080] italic">Pagos</span></h1>
        <p className="text-gray-500 dark:text-gray-400">Control de ingresos, facturación y descuentos.</p>
      </motion.div>
      <div className="flex gap-4">
        <button 
          onClick={onExport}
          className="p-4 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center gap-2"
          title="Exportar Reporte"
        >
          <Download size={20} />
          <span className="hidden sm:inline">Exportar</span>
        </button>
        <button 
          onClick={onAction}
          className="bg-[#008080] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#006666] transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus size={20} />
          {activeTab === 'payments' ? 'Registrar Pago' : 'Nuevo Descuento'}
        </button>
      </div>
    </div>
  );
}
