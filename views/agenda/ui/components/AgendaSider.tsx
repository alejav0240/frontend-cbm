"use client";

import React from "react";
import { MiniCalendar } from "@/views/agenda/ui/components/MiniCalendar";
import { SesionAgenda } from "@/entities/sesion/model/tipos-agenda";
import { CalendarOff, User, Clock } from "lucide-react";

interface AgendaSidebarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  sesionesSinFecha?: SesionAgenda[];
  onSessionClick?: (session: SesionAgenda) => void;
}

export function AgendaSidebar({
  selectedDate,
  setSelectedDate,
  sesionesSinFecha = [],
  onSessionClick,
}: AgendaSidebarProps) {
  return (
    <div className="lg:w-80 shrink-0 space-y-6">
      <MiniCalendar value={selectedDate} onChange={setSelectedDate} />

      {/* Sesiones sin fecha programada */}
      <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <CalendarOff size={14} className="text-orange-400" />
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Sin programar
          </h4>
          {sesionesSinFecha.length > 0 && (
            <span className="ml-auto px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold">
              {sesionesSinFecha.length}
            </span>
          )}
        </div>

        {sesionesSinFecha.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-gray-600 text-center py-4">
            No hay sesiones pendientes de programar
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
            {sesionesSinFecha.map((sesion) => (
              <button
                key={sesion.id}
                onClick={() => onSessionClick?.(sesion)}
                className="w-full text-left p-3 rounded-2xl bg-orange-50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/10 hover:border-orange-300 dark:hover:border-orange-500/30 transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <User
                    size={11}
                    className="text-orange-400 shrink-0"
                  />
                  <p className="text-xs font-bold text-gray-700 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {sesion.patientName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={10} className="text-gray-400 shrink-0" />
                  <p className="text-[10px] text-gray-400 truncate">
                    {sesion.therapist}
                  </p>
                  {sesion.status && (
                    <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-orange-500 dark:text-orange-400 shrink-0">
                      {sesion.status}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Leyenda de tipos */}
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
