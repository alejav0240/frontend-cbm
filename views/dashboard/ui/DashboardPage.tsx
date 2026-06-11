"use client";

import React from "react";
import { DashboardMetricas } from "@/widgets/dashboard-metricas";
import { TablaSesiones } from "@/widgets/lista-sesiones";
import { useSesiones } from "@/entities/sesion";
import { useAuthStore } from "@/shared/model/useAuthStore";
import { Sparkles, Calendar, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";

export const DashboardPage = () => {
  const { usuario } = useAuthStore();
  const { sesiones } = useSesiones();
  console.log("---------");

  return (
    <div className="space-y-12 pb-12">
      {/* Bienvenida */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#008080] to-[#006666] rounded-[40px] p-10 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest">
              Panel de Control
            </div>
            <Sparkles size={16} className="text-yellow-300" />
          </div>
          <h1 className="text-4xl font-bold mb-2">¡Hola, {usuario?.fullName.split(' ')[0]}!</h1>
          <p className="text-teal-100 max-w-md">Bienvenido de nuevo. Aquí tienes un resumen de la actividad del centro para hoy.</p>
        </div>
        
        {/* Decoración abstracta */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl" />
      </div>

      {/* Métricas Principales */}
      <DashboardMetricas />

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Próximas Sesiones */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#008080]/10 flex items-center justify-center text-[#008080]">
                <Activity size={20} />
              </div>
              <h2 className="text-xl font-bold dark:text-white">Actividad Reciente</h2>
            </div>
            <Link href="/dashboard/sesiones" className="text-sm font-bold text-[#008080] flex items-center gap-1 hover:underline">
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
            <TablaSesiones 
              sesiones={sesiones.slice(0, 5)} 
              alVerDetalles={() => {}} 
            />
          </div>
        </div>

        {/* Recordatorios o Calendario rápido */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Calendar size={20} />
            </div>
            <h2 className="text-xl font-bold dark:text-white">Agenda Hoy</h2>
          </div>

          <div className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm">
            <div className="space-y-6">
              {[
                { time: "09:00", event: "Sesión MLT - Juan Pérez", type: "Individual" },
                { time: "11:30", event: "Evaluación Inicial - María G.", type: "Clínica" },
                { time: "15:00", event: "Taller Grupal - Coro Infantil", type: "Grupal" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 group cursor-pointer">
                  <div className="text-sm font-mono font-bold text-[#008080] w-12 pt-1">{item.time}</div>
                  <div className="flex-1 pb-6 border-b border-gray-50 dark:border-white/5 group-last:border-0">
                    <p className="text-sm font-bold dark:text-white group-hover:text-[#008080] transition-colors">{item.event}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{item.type}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-xs font-bold text-gray-500 hover:text-[#008080] transition-all">
              Abrir Agenda Completa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
