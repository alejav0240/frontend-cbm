"use client";

import React from "react";
import { motion } from "motion/react";
import { AlertCircle, Clock } from "lucide-react";

export interface ClinicalAlert {
  title: string;
  description: string;
  tone: "danger" | "warning";
}

export function OverviewClinicalAlerts({
  alerts,
}: {
  alerts: ClinicalAlert[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="lg:col-span-1"
    >
      <div className="bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm h-full">
        <h2 className="text-base md:text-lg font-bold mb-4 md:mb-6 dark:text-white">
          Alertas
        </h2>
        <div className="space-y-3 md:space-y-4">
          {alerts.length === 0 ? (
            <p className="py-8 text-center text-xs italic text-gray-400">
              No hay alertas registradas.
            </p>
          ) : (
            alerts.map((alert) => {
              const danger = alert.tone === "danger";
              const Icon = danger ? AlertCircle : Clock;
              return (
                <div
                  key={`${alert.title}-${alert.description}`}
                  className={`flex gap-4 rounded-2xl p-4 ${
                    danger
                      ? "border border-red-100 bg-red-50 dark:border-red-500/10 dark:bg-red-500/5"
                      : "border border-orange-100 bg-orange-50 dark:border-orange-500/10 dark:bg-orange-500/5"
                  }`}
                >
                  <Icon
                    className={danger ? "text-red-500" : "text-orange-500"}
                    size={20}
                  />
                  <div>
                    <p
                      className={`text-sm font-bold ${
                        danger
                          ? "text-red-700 dark:text-red-400"
                          : "text-orange-700 dark:text-orange-400"
                      }`}
                    >
                      {alert.title}
                    </p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400">
                      {alert.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
}
