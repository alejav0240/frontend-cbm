'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Plus, Download } from 'lucide-react';

interface CoursesHeaderProps {
  onAddClick: () => void;
  onExportClick: () => void;
}

export function CoursesHeader({ onAddClick, onExportClick }: CoursesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold dark:text-white serif">Gestión de <span className="text-[#008080] italic">Cursos</span></h1>
        <p className="text-gray-500 dark:text-gray-400">Administra los cursos y los ingresos generados.</p>
      </motion.div>
      <div className="flex items-center gap-3">
        <button
          onClick={onExportClick}
          className="flex items-center gap-2 px-5 py-4 rounded-2xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
        >
          <Download size={18} />
          Exportar
        </button>
        <button
          onClick={onAddClick}
          className="bg-[#008080] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#006666] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#008080]/20 hover:scale-105"
        >
          <Plus size={20} />
          Nuevo Curso
        </button>
      </div>
    </div>
  );
}
