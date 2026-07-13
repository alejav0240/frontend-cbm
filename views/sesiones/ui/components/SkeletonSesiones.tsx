"use client";

import React from "react";
import { motion } from "motion/react";

function SkeletonRow({ delay }: { delay: number }) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="border-b border-gray-50 dark:border-white/5"
    >
      <td className="px-6 md:px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/10 animate-pulse" />
          <div className="w-12 h-4 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
        </div>
      </td>
      <td className="px-6 md:px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/10 animate-pulse" />
          <div className="space-y-1.5">
            <div className="w-28 h-3.5 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
            <div className="w-20 h-2.5 rounded bg-gray-100 dark:bg-white/5 animate-pulse" />
          </div>
        </div>
      </td>
      <td className="px-6 md:px-8 py-5">
        <div className="w-24 h-3.5 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
      </td>
      <td className="px-6 md:px-8 py-5">
        <div className="space-y-1.5">
          <div className="w-20 h-3.5 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
          <div className="w-12 h-2.5 rounded bg-gray-100 dark:bg-white/5 animate-pulse" />
        </div>
      </td>
      <td className="px-6 md:px-8 py-5">
        <div className="w-20 h-6 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
      </td>
      <td className="px-6 md:px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
          <div className="w-14 h-3 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
        </div>
      </td>
      <td className="px-6 md:px-8 py-5">
        <div className="flex justify-end">
          <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-white/10 animate-pulse" />
        </div>
      </td>
    </motion.tr>
  );
}

export function SkeletonSesiones() {
  return (
    <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
              {[
                "Sesión",
                "Paciente",
                "Terapeuta",
                "Fecha / Hora",
                "Estado",
                "Pago",
                "Acciones",
              ].map((label) => (
                <th
                  key={label}
                  className="px-6 md:px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]"
                >
                  <div className="w-16 h-3 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} delay={i * 0.05} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 md:px-8 py-6 bg-gray-50/30 dark:bg-white/1 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
        <div className="w-32 h-3 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/10 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
