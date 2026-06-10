"use client";

import React from "react";
import { motion } from "motion/react";
import { Download, Plus } from "lucide-react";

interface SessionsHeaderProps {
  onExport: () => void;
  onNewSession: () => void;
}

export function SessionsHeader({
  onExport,
  onNewSession,
}: SessionsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold dark:text-white serif">
          Ciclos y <span className="text-[#008080] italic">Sesiones</span>
        </h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
          Registro cronológico de la intervención terapéutica.
        </p>
      </motion.div>
      <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
        <button
          onClick={onExport}
          className="flex-1 sm:flex-none p-4 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          title="Exportar Historial"
        >
          <Download size={20} />
          <span>Exportar</span>
        </button>
        <button
          onClick={onNewSession}
          className="flex-[2] sm:flex-none bg-[#008080] text-white px-6 md:px-8 py-4 rounded-2xl font-bold hover:bg-[#006666] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#008080]/20 hover:scale-105"
        >
          <Plus size={20} />
          <span className="whitespace-nowrap">Nueva Sesión</span>
        </button>
      </div>
    </div>
  );
}
