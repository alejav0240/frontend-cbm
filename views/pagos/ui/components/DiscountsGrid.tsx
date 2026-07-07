'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Trash2, Percent, DollarSign } from 'lucide-react';
import { Descuento } from '@/entities/pago';

interface DiscountsGridProps {
  discounts: Descuento[];
  onDelete: (id: string) => void;
}

export function DiscountsGrid({ discounts, onDelete }: DiscountsGridProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {discounts.map((discount, idx) => (
        <motion.div
          key={discount.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm relative group"
        >
          <button 
            onClick={() => onDelete(discount.id)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={16} />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080] mb-4">
            {discount.tipo === 'PERCENTAGE' ? <Percent size={24} /> : <DollarSign size={24} />}
          </div>
          <h3 className="text-lg font-bold dark:text-white mb-1">{discount.nombre}</h3>
          <p className="text-2xl font-bold text-[#008080] mb-3">
            {discount.tipo === 'PERCENTAGE' ? `${discount.valor}%` : `Bs. ${discount.valor}`}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{discount.descripcion}</p>
        </motion.div>
      ))}
    </div>
  );
}
