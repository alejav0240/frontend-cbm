'use client';

import { motion } from 'motion/react';

export function ExpedientesHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold dark:text-white serif">
          Expedientes <span className="text-[#008080] italic">Clínicos</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Consulta la historia clínica completa y centralizada de tus pacientes.
        </p>
      </motion.div>
    </div>
  );
}
