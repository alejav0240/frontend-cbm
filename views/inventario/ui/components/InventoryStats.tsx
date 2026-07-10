'use client';

import React from 'react';
import { Package, CheckCircle2, Wrench, Clock } from 'lucide-react';
import { ArticuloInventario } from '@/entities/inventario';

interface InventoryStatsProps {
  inventory: ArticuloInventario[];
}

export function InventoryStats({ inventory }: InventoryStatsProps) {
  const totalItems = inventory.length;
  const availableItems = inventory.filter(i => i.estado === 'AVAILABLE').length;
  const maintenanceItems = inventory.filter(i => i.condicion === 'MAINTENANCE').length;
  const inUseItems = inventory.filter(i => i.estado === 'IN_USE').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 flex items-center gap-4">
        <div className="w-12 h-12 bg-[#008080]/10 rounded-2xl flex items-center justify-center text-[#008080]">
          <Package size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Items</p>
          <p className="text-2xl font-bold dark:text-white">{totalItems}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 flex items-center gap-4">
        <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
          <CheckCircle2 size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Disponibles</p>
          <p className="text-2xl font-bold dark:text-white">{availableItems}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
          <Wrench size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mantenimiento</p>
          <p className="text-2xl font-bold dark:text-white">{maintenanceItems}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
          <Clock size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">En Uso</p>
          <p className="text-2xl font-bold dark:text-white">{inUseItems}</p>
        </div>
      </div>
    </div>
  );
}
