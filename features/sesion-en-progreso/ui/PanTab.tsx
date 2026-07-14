"use client";

import React from "react";
import { motion } from "motion/react";
import { Target, CheckCircle2, Music, Layers } from "lucide-react";

interface PlanTabProps {
  patientPlan: {
    mainObjective: string;
    progressPercent: number;
    steps: Array<{
      id: string;
      moment: number;
      durationMinutes: number;
      objective: string;
      focus: string;
      musicalResources: string;
      musicalEmphasis: string;
      mltMethod: string;
    }> | null;
  } | null;
  completedSteps: string[];
  toggleStep: (id: string) => void;
}

export function PlanTab({
  patientPlan,
  completedSteps,
  toggleStep,
}: PlanTabProps) {
  if (!patientPlan) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12 md:p-20 bg-gray-50 dark:bg-white/2 rounded-[40px] border border-dashed border-gray-200 dark:border-white/10">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 mb-6">
          <Target size={40} />
        </div>
        <h3 className="text-xl font-bold dark:text-white mb-2">
          Sin Plan de Intervención
        </h3>
        <p className="text-sm text-gray-500 max-w-xs">
          No se ha detectado un plan activo para este paciente. Puedes crear uno
          desde la sección de Planes.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      <div className="sticky top-0 bg-white dark:bg-accent z-20 pb-4 -mx-4 md:-mx-8 px-4 md:px-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080]">
            <Target size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold dark:text-white serif">
              {patientPlan.mainObjective}
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
              Estrategia de Intervención Activa
            </p>
          </div>
        </div>
        <div className="h-1 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${patientPlan.progressPercent}%` }}
            className="h-full bg-[#008080]"
          />
        </div>
      </div>

      <div className="relative space-y-8 pt-4">
        {/* Vertical Line */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gray-200 dark:bg-white/10" />

        {patientPlan.steps?.map((step, idx) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <button
              type="button"
              onClick={() => toggleStep(step.id)}
              className={`relative pl-16 md:pl-24 group cursor-pointer text-left w-full`}
            >
            {/* Node */}
            <div
              className={`absolute left-4 md:left-6 top-0 w-4 h-4 md:w-5 md:h-5 rounded-full border-4 border-white dark:border-[#0a0a0a] z-10 transition-all duration-300 ${
                (completedSteps || []).includes(step.id)
                  ? "bg-green-500 scale-125"
                  : "bg-gray-200 dark:bg-gray-800 group-hover:bg-[#008080]"
              }`}
            />

            <div
              className={`p-6 md:p-8 rounded-[32px] border transition-all duration-500 ${
                (completedSteps || []).includes(step.id)
                  ? "bg-green-500/5 border-green-500/20 opacity-60"
                  : "bg-white dark:bg-white/2 border-gray-100 dark:border-white/5 hover:border-[#008080]/30 hover:shadow-xl hover:shadow-black/5"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-[#008080] uppercase tracking-widest bg-[#008080]/10 px-2 py-0.5 rounded">
                      Momento {step.moment}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {step.durationMinutes} MINUTOS
                    </span>
                  </div>
                  <h4
                    className={`text-lg md:text-xl font-bold serif ${(completedSteps || []).includes(step.id) ? "text-green-600 line-through" : "dark:text-white"}`}
                  >
                    {step.objective}
                  </h4>
                  <p
                    className={`text-sm font-medium text-[#008080] ${(completedSteps || []).includes(step.id) ? "line-through" : ""}`}
                  >
                    Foco: {step.focus}
                  </p>
                </div>
                {(completedSteps || []).includes(step.id) && (
                  <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-4 py-2 rounded-2xl self-start">
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Completado
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Recursos & Énfasis
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Music
                        size={14}
                        className="text-[#008080] mt-0.5 shrink-0"
                      />
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                        {step.musicalResources}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Layers
                        size={14}
                        className="text-[#008080] mt-0.5 shrink-0"
                      />
                      <p className="text-xs italic text-gray-500 leading-relaxed">
                        {step.musicalEmphasis}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Metodología (MLT)
                  </p>
                  <div className="p-4 bg-gray-50 dark:bg-white/2 rounded-2xl border border-gray-100 dark:border-white/5">
                    <p className="text-xs font-medium dark:text-gray-300 leading-relaxed">
                      {step.mltMethod}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
