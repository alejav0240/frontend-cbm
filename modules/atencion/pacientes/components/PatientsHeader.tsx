"use client";

import React from "react";
import { motion } from "motion/react";
import { Download, Plus } from "lucide-react";
import { PermissionGuard } from "@/shared/ui/components/PermissionGuard";

interface PatientsHeaderProps {
  onExport: () => void;
  onNewPatient: () => void;
}

export function PatientsHeader({
  onExport,
  onNewPatient,
}: PatientsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold dark:text-white serif">
          Módulo de <span className="text-[#008080] italic">Clientes</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Gestión integral de pacientes y responsables.
        </p>
      </motion.div>
      <div className="flex gap-3">
        <button
          onClick={onExport}
          className="p-4 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <Download size={20} />
          <span className="hidden sm:inline">Exportar</span>
        </button>
        <PermissionGuard permission="pacientes:add">
          <button
            onClick={onNewPatient}
            className="bg-[#008080] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#006666] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#008080]/20 hover:scale-105"
          >
            <Plus size={20} />
            Nuevo Cliente
          </button>
        </PermissionGuard>
      </div>
    </div>
  );
}
