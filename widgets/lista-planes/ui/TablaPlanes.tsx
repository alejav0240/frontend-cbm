"use client";

import React from "react";
import { motion } from "motion/react";
import { Target, Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import { PlanTratamiento } from "@/entities/plan-tratamiento";

interface TablaPlanesProps {
  planes: PlanTratamiento[];
  alSeleccionar: (id: string) => void;
}

export const TablaPlanes = ({ planes, alSeleccionar }: TablaPlanesProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Objetivo Principal</th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Paciente</th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Progreso</th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Periodo</th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Estado</th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
          {planes.map((plan, idx) => (
            <motion.tr
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="hover:bg-gray-50/80 dark:hover:bg-white/2 transition-colors group cursor-pointer"
              onClick={() => alSeleccionar(plan.id)}
            >
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Target size={18} />
                  </div>
                  <p className="text-sm font-bold dark:text-white line-clamp-1">{plan.objetivoPrincipal}</p>
                </div>
              </td>
              <td className="px-8 py-5 text-sm text-gray-600 dark:text-gray-400 font-medium">
                {plan.paciente.fullName}
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden min-w-[100px]">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-500" 
                      style={{ width: `${plan.porcentajeProgreso}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-400">{plan.porcentajeProgreso}%</span>
                </div>
              </td>
              <td className="px-8 py-5 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{new Intl.DateTimeFormat("es-ES").format(new Date(plan.fechaInicio))} - {plan.fechaFin ? new Intl.DateTimeFormat("es-ES").format(new Date(plan.fechaFin)) : "Actual"}</span>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  plan.estado === "ACTIVE" ? "bg-green-100 text-green-600 dark:bg-green-500/10" : "bg-gray-100 text-gray-600 dark:bg-white/5"
                }`}>
                  {plan.estado === "ACTIVE" ? "Activo" : "Finalizado"}
                </span>
              </td>
              <td className="px-8 py-5">
                <ChevronRight size={18} className="text-gray-300 group-hover:text-purple-500 transition-colors" />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
