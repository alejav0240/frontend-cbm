"use client";

import React from "react";
import { MiniCalendar } from "@/views/agenda/ui/components/MiniCalendar";

interface AgendaSidebarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export function AgendaSidebar({
  selectedDate,
  setSelectedDate,
}: AgendaSidebarProps) {
  return (
    <div className="lg:w-80 shrink-0 space-y-6">
      <MiniCalendar value={selectedDate} onChange={setSelectedDate} />
      <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
          Leyenda de Tipos
        </h4>
        <div className="space-y-3">
          {[
            { label: "Individual", color: "bg-blue-500" },
            { label: "Grupal", color: "bg-purple-500" },
            { label: "Evaluación", color: "bg-orange-500" },
            { label: "Rehabilitación", color: "bg-emerald-500" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
