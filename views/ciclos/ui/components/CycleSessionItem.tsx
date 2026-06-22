"use client";

import React from "react";
import { CheckCircle, Clock, CreditCard } from "lucide-react";

interface CycleSessionItemProps {
  session: any;
  sessionIdx: number;
  onTogglePayment: () => void;
  onComplete: () => void;
}

export function CycleSessionItem({
  session,
  sessionIdx,
  onTogglePayment,
  onComplete,
}: CycleSessionItemProps) {
  return (
    <div
      className={`p-5 rounded-3xl border transition-all ${
        session.status === "Completada"
          ? "bg-green-50/50 dark:bg-green-500/5 border-green-100 dark:border-green-500/10"
          : "bg-gray-50/50 dark:bg-white/2 border-gray-100 dark:border-white/5"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Sesión {sessionIdx + 1}
        </span>
        {session.status === "Completada" ? (
          <CheckCircle className="text-green-500" size={16} />
        ) : (
          <Clock className="text-gray-300" size={16} />
        )}
      </div>
      <p className="text-sm font-bold dark:text-white mb-1">{session.date}</p>
      <p className="text-[10px] text-gray-500 font-medium uppercase mb-3">
        {session.time}
      </p>

      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
            session.payment === "Pagado"
              ? "bg-green-100 text-green-600 dark:bg-green-500/10"
              : "bg-orange-100 text-orange-600 dark:bg-orange-500/10"
          }`}
        >
          {session.payment}
        </span>
        <button
          onClick={onTogglePayment}
          className="p-1.5 text-gray-400 hover:text-[#008080] transition-colors"
          title="Cambiar estado de pago"
        >
          <CreditCard size={14} />
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
        <span
          className={`text-[9px] font-bold uppercase tracking-widest ${
            session.status === "Completada"
              ? "text-green-500"
              : "text-orange-500"
          }`}
        >
          {session.status}
        </span>
        {session.status !== "Completada" && (
          <button
            onClick={onComplete}
            className="text-[9px] font-bold text-[#008080] hover:underline uppercase tracking-widest"
          >
            Completar
          </button>
        )}
      </div>
    </div>
  );
}
