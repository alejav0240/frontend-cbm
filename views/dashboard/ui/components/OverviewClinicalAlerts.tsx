"use client";

import React from "react";
import { motion } from "motion/react";
import { AlertCircle, Clock } from "lucide-react";

export function OverviewClinicalAlerts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="lg:col-span-1"
    >
      <div className="bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm h-full">
        <h2 className="text-base md:text-lg font-bold mb-4 md:mb-6 dark:text-white">
          Alertas Clínicas
        </h2>
        <div className="space-y-3 md:space-y-4">
          <div className="flex gap-4 p-4 bg-red-50 dark:bg-red-500/5 rounded-2xl border border-red-100 dark:border-red-500/10">
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <div>
              <p className="text-sm font-bold text-red-700 dark:text-red-400">
                Revisión Pendiente
              </p>
              <p className="text-[10px] text-red-600/80 dark:text-red-400/60">
                Elena Gómez (TEA) requiere actualización de objetivos.
              </p>
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-orange-50 dark:bg-orange-500/5 rounded-2xl border border-orange-100 dark:border-orange-500/10">
            <Clock className="text-orange-500 shrink-0" size={20} />
            <div>
              <p className="text-sm font-bold text-orange-700 dark:text-orange-400">
                Evaluación Próxima
              </p>
              <p className="text-[10px] text-orange-600/80 dark:text-orange-400/60">
                Juan Pérez cumple 3 meses de tratamiento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
