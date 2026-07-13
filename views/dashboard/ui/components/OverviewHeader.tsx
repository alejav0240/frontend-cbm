"use client";

import React from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";

interface NextSessionData {
  id: string;
  patientName: string;
}

interface OverviewHeaderProps {
  todaySessionsCount: number;
  onStartSession?: (session: NextSessionData) => void;
  nextSession?: NextSessionData;
  todayNotificationsCount: number;
}

export function OverviewHeader({
  todaySessionsCount,
  onStartSession,
  nextSession,
  todayNotificationsCount,
}: OverviewHeaderProps) {
  return (
    <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8 md:mb-12"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold dark:text-white serif tracking-tight mb-2">
          Hola, <span className="text-[#008080]">Terapeuta</span>
        </h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl">
          Aquí tienes un resumen de tu actividad hoy. Tienes{" "}
          <span className="font-bold text-[#008080]">
            {todaySessionsCount} sesiones
          </span>{" "}
          programadas y{" "}
          <span className="font-bold text-red-500">
            {todayNotificationsCount} notificaciones
          </span>{" "}
          que requieren tu atención.
        </p>
      </motion.div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right mr-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Fecha Actual
          </p>
          <p
            className="text-sm font-bold dark:text-white"
            suppressHydrationWarning
          >
            {new Date().toLocaleDateString("es-BO", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>
        <button
          onClick={() =>
            onStartSession?.(
              nextSession || {
                id: String(Date.now()),
                patientName: "Paciente Demo",
              },
            )
          }
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#008080] text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-[#006666] transition-all shadow-lg shadow-[#008080]/20 hover:scale-105"
        >
          <Play size={16} fill="currentColor" />
          <span className="whitespace-nowrap">Iniciar Siguiente Sesión</span>
        </button>
      </div>
    </div>
  );
}
