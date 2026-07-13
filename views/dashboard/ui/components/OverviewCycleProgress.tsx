"use client";

import React from "react";
import { motion } from "motion/react";

interface CycleProgressItem {
  id: string;
  patientName: string;
  completedSessions: number;
  totalSessions: number;
}

interface OverviewCycleProgressProps {
  activeCycles: CycleProgressItem[];
  onViewAll: () => void;
}

export function OverviewCycleProgress({
  activeCycles,
  onViewAll,
}: OverviewCycleProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className="lg:col-span-1"
    >
      <div className="bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base md:text-lg font-bold dark:text-white">
            Progreso de Ciclos
          </h2>
          <button
            onClick={onViewAll}
            className="text-[10px] font-bold text-[#008080] hover:underline uppercase tracking-widest"
          >
            Ver todos
          </button>
        </div>
        <div className="space-y-4">
          {activeCycles.length > 0 ? (
            activeCycles.map((cycle) => (
              <div key={cycle.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold dark:text-white truncate max-w-[120px]">
                    {cycle.patientName}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">
                    {cycle.completedSessions}/{cycle.totalSessions}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#008080]"
                    style={{
                      width: `${cycle.totalSessions > 0 ? (cycle.completedSessions / cycle.totalSessions) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic text-center py-4">
              No hay ciclos activos.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
