"use client";

import React from "react";
import { Plus, Download } from "lucide-react";

interface ExpensesHeaderProps {
  onAddClick: () => void;
  onExportClick?: () => void;
}

export function ExpensesHeader({
  onAddClick,
  onExportClick,
}: ExpensesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold dark:text-white tracking-tight serif">
          Gestión de <span className="text-[#008080]">Gastos</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Control de egresos y facturación del centro
        </p>
      </div>
      <div className="flex items-center gap-3">
        {onExportClick && (
          <button
            onClick={onExportClick}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-accent border border-gray-200 dark:border-white/5 rounded-2xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download size={18} />
            Exportar
          </button>
        )}
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 bg-[#008080] hover:bg-[#006666] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#008080]/20 active:scale-95"
        >
          <Plus size={20} />
          <span>Registrar Gasto</span>
        </button>
      </div>
    </div>
  );
}
