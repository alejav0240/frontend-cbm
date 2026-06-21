"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

interface PatientAIHistoryTableProps {
  data: any[];
}

export function AIHistorial({ data }: PatientAIHistoryTableProps) {
  return (
    <div className="bg-white dark:bg-[#111] rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-100 dark:border-white/5">
        <h3 className="text-lg font-bold dark:text-white serif">
          Historial de Análisis
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/[0.02]">
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Sesión
              </th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Fecha
              </th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Restrictivos
              </th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Vocal
              </th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Social
              </th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-all group"
              >
                <td className="px-8 py-5 text-sm font-bold dark:text-white">
                  {row.sessionNum}
                </td>
                <td className="px-8 py-5 text-sm text-gray-500">{row.date}</td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500"
                        style={{ width: `${(row.restrictivos / 2) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">
                      {row.restrictivos.toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${(row.vocal / 2) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">
                      {row.vocal.toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{ width: `${(row.social / 2) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">
                      {row.social.toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <button className="p-2 hover:bg-[#008080]/10 text-[#008080] rounded-full transition-all opacity-0 group-hover:opacity-100">
                    <ChevronRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
