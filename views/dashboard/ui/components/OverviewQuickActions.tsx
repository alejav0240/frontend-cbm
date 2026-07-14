"use client";

import React from "react";
import { motion } from "motion/react";
import { Users, Calendar, DollarSign, Activity } from "lucide-react";
import { QuickAction } from "@/shared/ui/QuickAction";

interface OverviewQuickActionsProps {
  onAction: (view: string) => void;
  showPatients?: boolean;
  showSessions?: boolean;
  showPayments?: boolean;
  showEvaluations?: boolean;
}

export function OverviewQuickActions({
  onAction,
  showPatients = true,
  showSessions = true,
  showPayments = true,
  showEvaluations = true,
}: OverviewQuickActionsProps) {
  const actions = [
    showPatients && {
      icon: <Users size={20} />,
      label: "Nuevo Cliente",
      color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600",
      onClick: () => onAction("patients"),
    },
    showSessions && {
      icon: <Calendar size={20} />,
      label: "Nueva Sesión",
      color: "bg-teal-50 dark:bg-teal-500/10 text-teal-600",
      onClick: () => onAction("sessions"),
    },
    showPayments && {
      icon: <DollarSign size={20} />,
      label: "Registrar Pago",
      color: "bg-green-50 dark:bg-green-500/10 text-green-600",
      onClick: () => onAction("payments"),
    },
    showEvaluations && {
      icon: <Activity size={20} />,
      label: "Evaluación",
      color: "bg-purple-50 dark:bg-purple-500/10 text-purple-600",
      onClick: () => onAction("evaluations"),
    },
  ].filter(Boolean) as Array<{
    icon: React.ReactNode;
    label: string;
    color: string;
    onClick: () => void;
  }>;

  if (actions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="lg:col-span-1"
    >
      <div className="bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm h-full">
        <h2 className="text-base md:text-lg font-bold mb-4 md:mb-6 dark:text-white">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {actions.map((action) => (
            <QuickAction
              key={action.label}
              icon={action.icon}
              label={action.label}
              color={action.color}
              onClick={action.onClick}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
