'use client';

import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Music } from 'lucide-react';

export function ProgressCard() {
  return (
    <div className="bg-gradient-to-br from-[#008080] to-[#006666] p-8 rounded-[40px] text-white shadow-2xl shadow-[#008080]/30 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Resumen de Progreso</h3>
          <div className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold">
            Ciclo Actual: 12/20
          </div>
        </div>
        <div className="flex items-end gap-4 mb-8">
          <span className="text-6xl font-bold">75%</span>
          <div className="flex flex-col mb-2">
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Objetivos Alcanzados</span>
            <div className="flex items-center gap-1 text-green-300 font-bold">
              <TrendingUp size={14} />
              <span>+15% este mes</span>
            </div>
          </div>
        </div>
        <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '75%' }}
            className="h-full bg-white rounded-full"
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <p className="text-2xl font-bold">12</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Sesiones</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">8</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Logros</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">4</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Recursos</p>
          </div>
        </div>
      </div>
      <Music className="absolute -right-8 -bottom-8 text-white/10 w-64 h-64 rotate-12" />
    </div>
  );
}
