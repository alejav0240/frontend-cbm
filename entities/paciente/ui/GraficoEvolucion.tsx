"use client";

import React, { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Activity, TrendingUp } from "lucide-react";

export interface ProgresoEscala {
  evaluatedAt: string;
  totalScore: number;
  inSession: boolean;
  id: string;
}

export type ClinicalEvolutionChartState = {
  dateString: string;
  eri: number;
  cim: number;
  formattedDate: string;
  inSession: boolean;
};

interface ClinicalEvolutionChartProps {
  progressData: ProgresoEscala[][];
}

type PeriodFilter = "all" | "7days" | "30days" | "90days";

type IndicatorFilter = "both" | "eri" | "cim";

type SessionFilter = "all" | "session" | "external";

function procesarEscalas(
  progressData: ProgresoEscala[][],
): ClinicalEvolutionChartState[] {
  const [eriData, cimData] = progressData;

  if (!eriData || !cimData) {
    return [];
  }

  return eriData.map((item, index) => {
    const fecha = new Date(item.evaluatedAt);

    return {
      dateString: item.evaluatedAt,
      eri: item.totalScore,
      cim: cimData[index]?.totalScore ?? 0,
      formattedDate: fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
      }),
      inSession: item.inSession,
    };
  });
}

function filtrarPorFecha(
  data: ClinicalEvolutionChartState[],
  period: PeriodFilter,
) {
  if (period === "all") return data;

  const now = new Date();

  const days = period === "7days" ? 7 : period === "30days" ? 30 : 90;

  return data.filter((item) => {
    const date = new Date(item.dateString);

    const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

    return diff <= days;
  });
}

export function GraficoEvolucion({
  progressData,
}: ClinicalEvolutionChartProps) {
  const [period, setPeriod] = useState<PeriodFilter>("all");

  const [indicator, setIndicator] = useState<IndicatorFilter>("both");

  const [session, setSession] = useState<SessionFilter>("all");

  const processedData = useMemo(
    () => procesarEscalas(progressData),
    [progressData],
  );

  const data = useMemo(() => {
    let result = filtrarPorFecha(processedData, period);

    if (session !== "all") {
      result = result.filter((item) =>
        session === "session" ? item.inSession : !item.inSession,
      );
    }

    return result;
  }, [processedData, period, session]);

  const stats = useMemo(() => {
    const total = data.length;

    const eri = total
      ? (data.reduce((a, b) => a + b.eri, 0) / total).toFixed(1)
      : 0;

    const cim = total
      ? (data.reduce((a, b) => a + b.cim, 0) / total).toFixed(1)
      : 0;

    return {
      total,
      eri,
      cim,
    };
  }, [data]);

  return (
    <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm">
      <div className="flex flex-wrap justify-between gap-4 mb-6">
        <h2 className="font-bold text-lg">Evolución clínica ERI / CIM</h2>

        <div className="flex gap-2 flex-wrap">
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={period}
            onChange={(e) => setPeriod(e.target.value as PeriodFilter)}
          >
            <option value="all">Todo</option>
            <option value="7days">Últimos 7 días</option>
            <option value="30days">Último mes</option>
            <option value="90days">Últimos 3 meses</option>
          </select>

          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={indicator}
            onChange={(e) => setIndicator(e.target.value as IndicatorFilter)}
          >
            <option value="both">ERI + CIM</option>
            <option value="eri">ERI</option>
            <option value="cim">CIM</option>
          </select>

          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={session}
            onChange={(e) => setSession(e.target.value as SessionFilter)}
          >
            <option value="all">Todas</option>
            <option value="session">En sesión</option>
            <option value="external">Externas</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Activity size={20} />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Sesiones
            </h4>
          </div>
          <p className="text-3xl font-bold dark:text-white">{stats.total}</p>
        </div>

        <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500">
              <TrendingUp size={20} />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Promedio de ERI
            </h4>
          </div>
          <p className="text-3xl font-bold dark:text-white">{stats.eri}</p>
        </div>

        <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500">
              <TrendingUp size={20} />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Promedio de CIM
            </h4>
          </div>
          <p className="text-3xl font-bold dark:text-white">{stats.cim}</p>
        </div>
      </div>

      <div className="h-72">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            No existen evaluaciones
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorEri" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#008080" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#008080" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCim" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#88888815"
              />

              {/* Se cambió "session" por "formattedDate" */}
              <XAxis
                dataKey="formattedDate"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#888" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#888" }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937", // Fondo gris oscuro para legibilidad universal
                  border: "none",
                  borderRadius: "12px",
                  color: "#f3f4f6",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                }}
                itemStyle={{ color: "#f3f4f6" }}
                labelStyle={{ color: "#9ca3af", fontWeight: "bold" }}
              />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: "20px" }}
              />
              {indicator !== "cim" && (
                <Area
                  type="monotone"
                  dataKey="eri"
                  name="ERI"
                  stroke="#008080"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorEri)"
                />
              )}
              {indicator !== "eri" && (
                <Area
                  type="monotone"
                  dataKey="cim"
                  name="CIM"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCim)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
