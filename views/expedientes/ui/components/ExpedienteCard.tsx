"use client";

import { motion } from "motion/react";
import { Stethoscope, Calendar, Clock, DollarSign } from "lucide-react";
import type { ExpedienteResumen } from "@/entities/expediente";

const STATUS_STYLE: Record<string, { label: string; bg: string; dot: string }> =
  {
    ACTIVE: {
      label: "Activo",
      bg: "bg-emerald-500/10 text-emerald-600",
      dot: "bg-emerald-500",
    },
    DISCHARGED: {
      label: "Alta",
      bg: "bg-blue-500/10 text-blue-600",
      dot: "bg-blue-500",
    },
    INACTIVE: {
      label: "Inactivo",
      bg: "bg-gray-500/10 text-gray-500",
      dot: "bg-gray-400",
    },
    PENDING: {
      label: "Pendiente",
      bg: "bg-amber-500/10 text-amber-600",
      dot: "bg-amber-500",
    },
  };

interface ExpedienteCardProps {
  expediente: ExpedienteResumen;
  onClick: () => void;
  index: number;
}

export function ExpedienteCard({
  expediente,
  onClick,
  index,
}: ExpedienteCardProps) {
  const total = expediente.totalSessions || 1;
  const sessionProgress = Math.min(
    (expediente.completedSessions / total) * 100,
    100,
  );

  const paidAmount =
    (expediente.paymentSummary?.paid ?? 0) +
    (expediente.paymentSummary?.exempt ?? 0);
  const paymentProgress = Math.min((paidAmount / total) * 100, 100);

  const statusKey = expediente.status as keyof typeof STATUS_STYLE;
  const statusInfo = STATUS_STYLE[statusKey] ?? {
    label: expediente.status || "Desconocido",
    bg: "bg-gray-500/10 text-gray-500",
    dot: "bg-gray-400",
  };

  const initiales = expediente.patientName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="w-full text-left bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl hover:border-[#008080]/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080] text-sm font-bold">
            {initiales || <Stethoscope size={18} />}
          </div>
          <div>
            <h3 className="font-bold dark:text-white group-hover:text-[#008080] transition-colors">
              {expediente.patientName}
            </h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Ciclo #{expediente.cycleNumber}
            </span>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${statusInfo.bg}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
          {statusInfo.label}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-5 text-xs text-gray-500 font-medium">
        <span className="flex items-center gap-1.5">
          <Calendar size={14} />
          {expediente.startDate}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={14} />
          {expediente.completedSessions}/{expediente.totalSessions} Sesiones
        </span>
        <span
          className={`flex items-center gap-1.5 font-bold uppercase tracking-widest ${paymentProgress >= 100 ? "text-green-500" : "text-orange-500"}`}
        >
          <DollarSign size={14} />
          {paymentProgress >= 100 ? "Pagado" : "Pendiente"}
        </span>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${sessionProgress}%` }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
              className={`h-full rounded-full ${sessionProgress >= 100 ? "bg-green-500" : "bg-[#008080]"}`}
            />
          </div>
          <div className="flex justify-between items-center px-0.5">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              Sesiones
            </span>
            <span
              className={`text-[9px] font-bold uppercase tracking-widest ${sessionProgress >= 100 ? "text-green-500" : "text-[#008080]"}`}
            >
              {Math.round(sessionProgress)}%
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${paymentProgress}%` }}
              transition={{ duration: 0.8, delay: 0.5 + index * 0.05 }}
              className={`h-full rounded-full ${paymentProgress >= 100 ? "bg-green-500" : "bg-orange-500"}`}
            />
          </div>
          <div className="flex justify-between items-center px-0.5">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              Cobros
            </span>
            <span
              className={`text-[9px] font-bold uppercase tracking-widest ${paymentProgress >= 100 ? "text-green-500" : "text-orange-500"}`}
            >
              {Math.round(paymentProgress)}%
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
