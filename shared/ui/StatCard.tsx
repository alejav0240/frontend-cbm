"use client";

import React from "react";
import { motion } from "motion/react";
import { TrendingUp, AlertCircle } from "lucide-react";

export function StatCard({
  icon,
  label,
  value,
  subtitle,
  trend = "",
  color = "teal",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  trend?: string;
  color?: string;
}) {
  const isPositive = trend?.startsWith("+") ?? false;

  const borderColors: Record<string, string> = {
    teal: "border-l-[#008080]",
    blue: "border-l-blue-500",
    red: "border-l-red-500",
    green: "border-l-green-500",
    purple: "border-l-purple-500",
    amber: "border-l-amber-500",
  };

  const iconColors: Record<string, string> = {
    teal: "text-[#008080]",
    blue: "text-blue-600",
    red: "text-red-500",
    green: "text-green-600",
    purple: "text-purple-600",
    amber: "text-amber-600",
  };

  const circleColors: Record<string, string> = {
    teal: "bg-[#008080]/20",
    blue: "bg-blue-500/20",
    red: "bg-red-500/20",
    green: "bg-green-500/20",
    purple: "bg-purple-500/20",
    amber: "bg-amber-500/20",
  };

  const cardShadows: Record<string, string> = {
    teal: "hover:shadow-[#008080]/10",
    blue: "hover:shadow-blue-500/10",
    red: "hover:shadow-red-500/10",
    green: "hover:shadow-green-500/10",
    purple: "hover:shadow-purple-500/10",
    amber: "hover:shadow-amber-500/10",
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/70 dark:bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-[32px] border border-l-[3px] border-white/40 dark:border-white/10 ${borderColors[color] || borderColors.teal} shadow-sm hover:shadow-xl ${cardShadows[color] || cardShadows.teal} transition-all duration-300 relative overflow-hidden group`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            {/* Círculo de color suave detrás del icono */}
            <div
              className={`absolute -inset-3 rounded-full ${circleColors[color] || circleColors.teal} blur-xl opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500`}
            />
            <div
              className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6 ${iconColors[color] || iconColors.teal}`}
            >
              {React.isValidElement(icon)
                ? React.cloneElement(icon as React.ReactElement<any>, {
                    size: 24,
                  })
                : icon}
            </div>
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${isPositive ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-500 dark:text-red-400"}`}
            >
              {isPositive ? (
                <TrendingUp size={10} />
              ) : (
                <AlertCircle size={10} />
              )}
              {trend}
            </div>
          )}
        </div>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
          {label}
        </p>
        <p className="text-2xl md:text-3xl font-bold dark:text-white serif tracking-tight tabular-nums">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
