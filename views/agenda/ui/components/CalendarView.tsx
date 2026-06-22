"use client";

import React from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";

interface CalendarViewProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: "calendar" | "hourly" | "therapist") => void;
  getSessionsForDay: (day: number) => any[];
  onSessionClick: (session: any) => void;
  onStartSession: (session: any) => void;
}

export function CalendarView({
  selectedDate,
  setSelectedDate,
  setViewMode,
  getSessionsForDay,
  onSessionClick,
  onStartSession,
}: CalendarViewProps) {
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1,
  ).getDay();

  return (
    <motion.div
      key="calendar"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="grid grid-cols-7 gap-4"
    >
      {days.map((day) => (
        <div
          key={day}
          className="text-center py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]"
        >
          {day}
        </div>
      ))}
      {/* Empty slots for previous month */}
      {Array.from({ length: firstDayOfMonth }).map((_, i) => (
        <div key={`empty-${i}`} className="min-h-[140px]" />
      ))}
      {Array.from({ length: daysInMonth }).map((_, i) => {
        const day = i + 1;
        const today = new Date();
        const isToday =
          day === today.getDate() &&
          selectedDate.getMonth() === today.getMonth() &&
          selectedDate.getFullYear() === today.getFullYear();

        const daySessions = getSessionsForDay(day);

        return (
          <motion.div
            key={i}
            whileHover={{ y: -2 }}
            onClick={() => {
              setSelectedDate(
                new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  day,
                ),
              );
              setViewMode("hourly");
            }}
            className={`min-h-[140px] p-3 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-[24px] transition-all hover:shadow-xl hover:shadow-black/5 group relative cursor-pointer ${isToday ? "ring-2 ring-[#008080] bg-[#008080]/2" : ""}`}
          >
            <span
              className={`text-xs font-bold ${isToday ? "text-[#008080] bg-[#008080]/10 px-2 py-1 rounded-lg" : "text-gray-400"}`}
            >
              {day}
            </span>
            <div className="mt-3 space-y-2">
              {daySessions.map((s) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSessionClick(s);
                  }}
                  className={`p-2 rounded-xl border group/item transition-colors cursor-pointer ${
                    s.status === "Completada"
                      ? "bg-green-500/5 dark:bg-green-500/10 border-green-500/10 hover:bg-green-500/10"
                      : "bg-[#008080]/5 dark:bg-[#008080]/10 border-[#008080]/10 hover:bg-[#008080]/10"
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold truncate leading-tight ${s.status === "Completada" ? "text-green-600" : "text-[#008080]"}`}
                  >
                    {s.patientName}
                  </p>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                      {s.time}
                    </span>
                    <div className="flex gap-1">
                      {s.status !== "Completada" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartSession(s);
                          }}
                          className="p-1.5 bg-[#008080] text-white rounded-lg opacity-0 group-hover/item:opacity-100 transition-all hover:scale-110"
                          title="Iniciar Sesión"
                        >
                          <Play size={8} fill="currentColor" />
                        </button>
                      )}
                      {s.status === "Completada" && s.recordingUrl && (
                        <div
                          className="w-2 h-2 bg-green-500 rounded-full"
                          title="Grabación disponible"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
