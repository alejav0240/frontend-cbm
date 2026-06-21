"use client";

import React from "react";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { motion } from "motion/react";

interface MetricaCardProps {
  titulo: string;
  valor: string | number;
  subtitulo: string;
  icon: React.ReactNode;
  color: string;
  incremento?: number;
  esPositivo?: boolean;
}

const MetricaCard = ({
  titulo,
  valor,
  subtitulo,
  icon,
  color,
  incremento,
  esPositivo,
}: MetricaCardProps) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm"
  >
    <div className="flex justify-between items-start mb-6">
      <div
        className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}
      >
        {icon}
      </div>
      {incremento !== undefined && (
        <div
          className={`flex items-center gap-1 text-xs font-bold ${esPositivo ? "text-green-500" : "text-red-500"}`}
        >
          {esPositivo ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}
          <span>{incremento}%</span>
        </div>
      )}
    </div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
      {titulo}
    </p>
    <h3 className="text-3xl font-bold dark:text-white mb-1">{valor}</h3>
    <p className="text-xs text-gray-500 font-medium">{subtitulo}</p>
  </motion.div>
);

export const DashboardMetricas = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <MetricaCard
        titulo="Pacientes Activos"
        valor={124}
        subtitulo="12 nuevos este mes"
        icon={<Users size={28} />}
        color="bg-[#008080]"
        incremento={12}
        esPositivo={true}
      />
      <MetricaCard
        titulo="Sesiones Hoy"
        valor={18}
        subtitulo="6 pendientes por realizar"
        icon={<Calendar size={28} />}
        color="bg-blue-500"
        incremento={5}
        esPositivo={true}
      />
      <MetricaCard
        titulo="Ingresos (BOB)"
        valor="15,420"
        subtitulo="Total acumulado mensual"
        icon={<DollarSign size={28} />}
        color="bg-green-500"
        incremento={8}
        esPositivo={true}
      />
      <MetricaCard
        titulo="Gastos (BOB)"
        valor="4,250"
        subtitulo="Operación y materiales"
        icon={<TrendingDown size={28} />}
        color="bg-red-500"
        incremento={2}
        esPositivo={false}
      />
    </div>
  );
};
