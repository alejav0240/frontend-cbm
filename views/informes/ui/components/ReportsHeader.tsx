'use client';

import { Plus } from 'lucide-react';

interface ReportsHeaderProps {
  onNewReport: () => void;
}

export function ReportsHeader({ onNewReport }: ReportsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold dark:text-white tracking-tight serif">Informes <span className="text-[#008080]">Terapéuticos</span></h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Envío y seguimiento de reportes para tutores</p>
      </div>
      <button 
        onClick={onNewReport}
        className="flex items-center gap-2 bg-[#008080] hover:bg-[#006666] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#008080]/20 group"
      >
        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
        Nuevo Informe
      </button>
    </div>
  );
}
