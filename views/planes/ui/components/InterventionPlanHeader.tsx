"use client";

import React from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";

interface InterventionPlanHeaderProps {
  onNewPlan: () => void;
}

export function InterventionPlanHeader({
  onNewPlan,
}: InterventionPlanHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold dark:text-white serif">
          Planes de <span className="text-[#008080] italic">Intervención</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Diseño y seguimiento de objetivos terapéuticos personalizados.
        </p>
      </motion.div>
      <button
        onClick={onNewPlan}
        className="bg-[#008080] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#006666] transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        <Plus size={20} />
        Nuevo Plan
      </button>
    </div>
  );
}
