'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface InventoryHeaderProps {
  onAdd: () => void;
}

export function InventoryHeader({ onAdd }: InventoryHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold dark:text-white tracking-tight serif">Inventario de <span className="text-[#008080]">Instrumentos</span></h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Gestión de activos y materiales terapéuticos</p>
      </div>
      <button 
        onClick={onAdd}
        className="flex items-center gap-2 bg-[#008080] hover:bg-[#006666] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#008080]/20 active:scale-95"
      >
        <Plus size={20} />
        <span>Añadir Item</span>
      </button>
    </div>
  );
}
