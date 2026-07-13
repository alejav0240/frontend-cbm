"use client";

import React from "react";
import { motion } from "motion/react";
import { AppointmentItem } from "@/shared/ui/AppointmentItem";

interface DailySession {
  id: string;
  patientName: string;
  time: string;
  duration: string;
  status: string;
}

interface OverviewDailySessionsProps {
  sessions: DailySession[];
  onStartSession?: (session: DailySession) => void;
  onViewAll: () => void;
}

export function OverviewDailySessions({
  sessions,
  onStartSession,
  onViewAll,
}: OverviewDailySessionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="lg:col-span-1"
    >
      <div className="bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm h-full flex flex-col">
        <h2 className="text-base md:text-lg font-bold mb-4 md:mb-6 dark:text-white">
          Sesiones de Hoy
        </h2>
        <div className="space-y-3 md:space-y-4 flex-1 overflow-y-auto custom-scrollbar max-h-[350px] pr-2">
          {sessions.length > 0 ? (
            sessions.map((s) => (
              <AppointmentItem
                key={s.id}
                name={s.patientName}
                time={s.time}
                type={s.duration}
                status={s.status}
                onStart={() => onStartSession?.(s)}
              />
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-xs text-gray-400 italic">
                No hay sesiones programadas para hoy.
              </p>
            </div>
          )}
        </div>
        <button
          onClick={onViewAll}
          className="w-full mt-6 py-3 rounded-2xl bg-gray-50 dark:bg-white/5 text-sm font-bold text-[#008080] hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
        >
          Ver Agenda Completa
        </button>
      </div>
    </motion.div>
  );
}
