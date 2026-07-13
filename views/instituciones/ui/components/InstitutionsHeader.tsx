"use client";

import React from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";

interface InstitutionsHeaderProps {
  onNewInstitution: () => void;
  onExportClick?: () => void;
}

export function InstitutionsHeader({
  onNewInstitution,
  onExportClick,
}: InstitutionsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold dark:text-white serif">
          Instituciones{" "}
          <span className="text-[#008080] italic">y Convenios</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Gestiona los centros y organizaciones con los que colaboras.
        </p>
      </motion.div>
      <div className="flex items-center gap-3">
        {onExportClick && (
          <button
            onClick={onExportClick}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-accent border border-gray-200 dark:border-white/5 rounded-2xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-all shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Exportar
          </button>
        )}
        <button
          onClick={onNewInstitution}
          className="bg-[#008080] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#006666] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#008080]/20 hover:scale-105"
        >
          <Plus size={20} />
          Nueva Institución
        </button>
      </div>
    </div>
  );
}
