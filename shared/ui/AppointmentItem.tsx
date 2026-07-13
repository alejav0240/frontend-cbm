"use client";

import React from "react";
import { Play, Clock, CheckCircle, XCircle } from "lucide-react";

interface AppointmentItemProps {
  name: string;
  time: string;
  type: string;
  status: string;
  onStart?: () => void;
}

export function AppointmentItem({
  name,
  time,
  type,
  status,
  onStart,
}: AppointmentItemProps) {
  const statusConfig: Record<string, { icon: React.ReactNode; color: string }> =
    {
      Pendiente: {
        icon: <Clock size={12} />,
        color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
      },
      Confirmada: {
        icon: <CheckCircle size={12} />,
        color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
      },
      Completada: {
        icon: <CheckCircle size={12} />,
        color: "text-green-500 bg-green-50 dark:bg-green-500/10",
      },
      Cancelada: {
        icon: <XCircle size={12} />,
        color: "text-red-500 bg-red-50 dark:bg-red-500/10",
      },
    };

  const config = statusConfig[status] || statusConfig.Pendiente;
  const canStart = status === "Pendiente" || status === "Confirmada";

  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
      <div className="text-sm font-mono font-bold text-[#008080] w-14 shrink-0">
        {time}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold dark:text-white truncate">{name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {type}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${config.color}`}
          >
            {config.icon}
            {status}
          </span>
        </div>
      </div>
      {canStart && onStart && (
        <button
          onClick={onStart}
          className="p-2 bg-[#008080]/10 rounded-xl text-[#008080] hover:bg-[#008080] hover:text-white transition-all opacity-0 group-hover:opacity-100"
        >
          <Play size={14} fill="currentColor" />
        </button>
      )}
    </div>
  );
}
