'use client';

import { motion } from 'motion/react';

interface ReportsStatsProps {
  total: number;
  read: number;
  rate: number;
}

export function ReportsStats({ total, read, rate }: ReportsStatsProps) {
  return (
    <div className="bg-gradient-to-br from-[#008080] to-[#006666] p-8 rounded-[40px] text-white shadow-xl shadow-[#008080]/20">
      <h3 className="text-xl font-bold mb-2">Estadísticas de Envío</h3>
      <p className="text-white/70 text-sm mb-6">Resumen de comunicación con tutores este mes</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Enviados</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Leídos</p>
          <p className="text-2xl font-bold">{read}</p>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Tasa de Lectura</span>
          <span className="text-xs font-bold">{rate}%</span>
        </div>
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${rate}%` }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
