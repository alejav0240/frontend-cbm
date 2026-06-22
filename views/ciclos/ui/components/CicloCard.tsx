"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RefreshCw,
  Calendar,
  Clock,
  DollarSign,
  MessageCircle,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { CycleSessionItem } from "./CycleSessionItem";

interface CycleCardProps {
  cycle: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete: () => void;
  onWhatsApp: () => void;
  idx: number;
}

export function CycleCard({
  cycle,
  isExpanded,
  onToggleExpand,
  onDelete,
  onWhatsApp,
  idx,
}: CycleCardProps) {
  const total = cycle.totalSessions || 4;
  const progress = (cycle.completedSessions / total) * 100;

  const paidSessions =
    (cycle.paymentSummary?.paid || 0) + (cycle.paymentSummary?.exempt || 0);
  const paymentProgress = (paidSessions / total) * 100;

  // Usamos la lista de sesiones que ya viene dentro del objeto cycle
  const cycleSessions = cycle.sessionsList || [];

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
            <RefreshCw size={18} className="text-[#008080]" />
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold dark:text-white group-hover:text-[#008080] transition-colors">
                {cycle.patientName}
              </h3>
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Ciclo #{cycle.cycleNumber}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <Calendar size={14} />
              Inicia: {cycle.startDate}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <Clock size={14} />
              {cycle.completedSessions} de {total} Sesiones
            </div>
            <div
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${
                cycle.paymentStatus === "Pagado"
                  ? "text-green-500"
                  : "text-orange-500"
              }`}
            >
              <DollarSign size={14} />
              {cycle.paymentStatus}
            </div>
          </div>

          <div className="space-y-4">
            {/* Barra de Sesiones */}
            <div className="space-y-1.5">
              <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full ${progress === 100 ? "bg-green-500" : "bg-[#008080]"}`}
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  Progreso Sesiones
                </span>
                <span
                  className={`text-[9px] font-bold uppercase tracking-widest ${progress === 100 ? "text-green-500" : "text-[#008080]"}`}
                >
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            {/* Barra de Pagos */}
            <div className="space-y-1.5">
              <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${paymentProgress}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className={`h-full ${paymentProgress === 100 ? "bg-green-500" : "bg-orange-500"}`}
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  Estado de Cobros
                </span>
                <span
                  className={`text-[9px] font-bold uppercase tracking-widest ${paymentProgress === 100 ? "text-green-500" : "text-orange-500"}`}
                >
                  {Math.round(paymentProgress)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
          <span
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              cycle.status === "Finalizado"
                ? "bg-green-100 text-green-600 dark:bg-green-500/10"
                : cycle.status === "Activo"
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-500/10"
                  : "bg-red-100 text-red-600 dark:bg-red-500/10"
            }`}
          >
            {cycle.status}
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={onWhatsApp}
              className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-xl transition-all"
              title="Contactar por WhatsApp"
            >
              <MessageCircle size={20} />
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
              {isExpanded ? "Ocultar Sesiones" : "Ver Sesiones"}
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-10 pt-10 border-t border-gray-100 dark:border-white/5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cycleSessions.map((session: any, sidx: number) => (
                <CycleSessionItem
                  key={session.id}
                  session={{
                    ...session,
                    date: new Date(session.sessionDate).toLocaleDateString(),
                    status:
                      session.sessionStatus === "completa"
                        ? "Completada"
                        : "Pendiente",
                    payment:
                      session.paymentStatusDisplay?.toLowerCase() === "paid"
                        ? "Pagado"
                        : "Pendiente",
                    sessionNum: session.sessionNumber ?? sidx + 1,
                  }}
                  sessionIdx={sidx}
                  onTogglePayment={() => {}} // Se implementará con mutación real
                  onComplete={() => {}} // Se implementará con mutación real
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
