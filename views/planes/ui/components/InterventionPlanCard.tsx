"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Target, Download, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { InterventionPlanDetails } from "./InterventionPlanDetails";

interface InterventionPlanCardProps {
  plan: any;
  idx: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onExport: () => void;
  onDelete: () => void;
  onAddStep: () => void;
  onEditStep: (step: any) => void;
  onDeleteStep: (stepId: number) => void;
  onToggleStepCompletion: (stepId: number) => void;
}

export function InterventionPlanCard({
  plan,
  idx,
  isExpanded,
  onToggleExpand,
  onExport,
  onDelete,
  onAddStep,
  onEditStep,
  onDeleteStep,
  onToggleStepCompletion,
}: InterventionPlanCardProps) {
  console.log("Rendering InterventionPlanCard for plan:", plan);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Target size={18} className="text-[#008080]" />
            <h3 className="text-xl font-bold dark:text-white group-hover:text-[#008080] transition-colors">
              {plan.patientName}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium mb-6">
            {plan.objective}
          </p>
          <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${plan.progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-[#008080]"
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Progreso del objetivo
            </span>
            <span className="text-[10px] font-bold text-[#008080] uppercase tracking-widest">
              {plan.progress}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
          <span
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              plan.status === "Finalizado"
                ? "bg-green-100 text-green-600 dark:bg-green-500/10"
                : "bg-blue-100 text-blue-600 dark:bg-blue-500/10"
            }`}
          >
            {plan.status}
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={onExport}
              className="p-2 text-gray-400 hover:text-[#008080] transition-colors"
              title="Exportar PDF"
            >
              <Download size={18} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Eliminar"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={onToggleExpand}
              className="flex items-center gap-2 text-sm font-bold text-[#008080] hover:underline uppercase tracking-widest"
            >
              {isExpanded ? "Ocultar Detalles" : "Ver Detalles"}
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <InterventionPlanDetails
            steps={plan.steps}
            onAddStep={onAddStep}
            onEditStep={onEditStep}
            onDeleteStep={onDeleteStep}
            onToggleStepCompletion={onToggleStepCompletion}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
