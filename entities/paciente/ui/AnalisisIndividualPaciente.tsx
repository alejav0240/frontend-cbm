"use client";

import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Activity,
  TrendingUp,
  Brain,
  Sparkles,
  Calendar,
  Layers,
  Award,
  BarChart3,
  CheckCircle2,
  LineChart as LineChartIcon,
  Radar as RadarIcon,
  SlidersHorizontal,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import type { ProgresoSubEscala } from "@/entities/paciente/api/useObtenerProgresoSubEscala";
import type { ProgresoEscala } from "@/entities/paciente/ui/GraficoEvolucion";
import type { PacienteDetalleSerializado } from "@/entities/paciente";
import { StatCard } from "@/shared/ui/StatCard";
import AnalisDemuca from "./AnalisDemuca";
import { GraficoEvolucion } from "./GraficoEvolucion";

type SubTabAnalisis = "comparativa" | "demuca" | "radar" | "escalas";

interface AnalisisIndividualPacienteProps {
  paciente: PacienteDetalleSerializado;
  dataDemuca: ProgresoSubEscala[];
  datosEscalas: ProgresoEscala[][]; // [eriData, cimData]
  sesionesCount?: number;
}

export function AnalisisIndividualPaciente({
  paciente,
  dataDemuca,
  datosEscalas,
  sesionesCount = 0,
}: AnalisisIndividualPacienteProps) {
  const [subTab, setSubTab] = useState<SubTabAnalisis>("comparativa");
  const [escalaSeleccionada, setEscalaSeleccionada] = useState<
    "todas" | "demuca" | "eri" | "cim"
  >("todas");

  const [eriData, cimData] = datosEscalas || [[], []];

  // 1. Estadísticas Consolidadas del Paciente
  const resumenEvaluaciones = useMemo(() => {
    const totalDemuca = dataDemuca?.length || 0;
    const totalEri = eriData?.length || 0;
    const totalCim = cimData?.length || 0;
    const totalEvaluaciones = totalDemuca + totalEri + totalCim;

    const avgEri =
      totalEri > 0
        ? (
            eriData.reduce((acc, curr) => acc + (curr.totalScore || 0), 0) /
            totalEri
          ).toFixed(1)
        : null;

    const avgCim =
      totalCim > 0
        ? (
            cimData.reduce((acc, curr) => acc + (curr.totalScore || 0), 0) /
            totalCim
          ).toFixed(1)
        : null;

    let tasaDemuca = null;
    if (totalDemuca >= 2) {
      const primero = dataDemuca[0]?.totalScore || 0;
      const ultimo = dataDemuca[totalDemuca - 1]?.totalScore || 0;
      if (primero > 0) {
        tasaDemuca = Math.round(((ultimo - primero) / primero) * 100);
      }
    }

    return {
      totalEvaluaciones,
      totalDemuca,
      totalEri,
      totalCim,
      avgEri,
      avgCim,
      tasaDemuca,
    };
  }, [dataDemuca, eriData, cimData]);

  // 2. Formatear datos comparativos longitudinales (DEMUCA vs ERI vs CIM)
  const evolucionComparativa = useMemo(() => {
    const maxPuntos = Math.max(
      dataDemuca.length,
      eriData.length,
      cimData.length,
    );

    if (maxPuntos === 0) return [];

    const puntos = [];
    for (let i = 0; i < maxPuntos; i++) {
      const dDemuca = dataDemuca[i];
      const dEri = eriData[i];
      const dCim = cimData[i];

      const fecha =
        dDemuca?.evaluatedAt ||
        dEri?.evaluatedAt ||
        dCim?.evaluatedAt ||
        `Sesión ${i + 1}`;

      const fechaFormatted = fecha.includes("-")
        ? new Date(fecha).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
          })
        : fecha;

      puntos.push({
        sesion: `S${i + 1}`,
        fecha: fechaFormatted,
        demuca: dDemuca?.totalScore ?? null,
        eri: dEri?.totalScore ?? null,
        cim: dCim?.totalScore ?? null,
      });
    }

    return puntos;
  }, [dataDemuca, eriData, cimData]);

  // 3. Radar de Competencias Actuales (Última evaluación DEMUCA)
  const competenciasRadar = useMemo(() => {
    if (!dataDemuca || dataDemuca.length === 0) return [];

    const ultima = dataDemuca[dataDemuca.length - 1];
    const agrupado: Record<string, { total: number; count: number }> = {};

    ultima.subscaleResponses.forEach((resp) => {
      const cat = resp.subscale?.category || resp.subscale?.name || "General";
      if (!agrupado[cat]) agrupado[cat] = { total: 0, count: 0 };
      agrupado[cat].total += resp.score;
      agrupado[cat].count += 1;
    });

    return Object.entries(agrupado).map(([area, val]) => ({
      area,
      puntaje: parseFloat((val.total / val.count).toFixed(1)),
      fullMark: 10,
    }));
  }, [dataDemuca]);

  // 4. Progreso por Categorías DEMUCA a lo largo del tiempo
  const categoriasEvolucion = useMemo(() => {
    if (!dataDemuca || dataDemuca.length === 0) return { data: [], keys: [] };

    const keysSet = new Set<string>();

    const data = dataDemuca.map((evaluacion, idx) => {
      const punto: Record<string, string | number> = {
        sesion: `S${idx + 1}`,
        fecha: evaluacion.evaluatedAt
          ? new Date(evaluacion.evaluatedAt).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
            })
          : `S${idx + 1}`,
      };

      evaluacion.subscaleResponses.forEach((resp) => {
        const cat = resp.subscale?.category || "General";
        keysSet.add(cat);
        if (!punto[cat]) punto[cat] = 0;
        (punto[cat] as number) += resp.score;
      });

      return punto;
    });

    return { data, keys: Array.from(keysSet) };
  }, [dataDemuca]);

  const CATEGORY_COLORS: Record<string, string> = {
    "Comportamientos Restrictivos": "#ef4444",
    "Exploración Vocal": "#3b82f6",
    "Interacción Social Cognitiva": "#8b5cf6",
    "Movimiento Corporal con Música": "#f59e0b",
    "Percepción Exploración Rítmica": "#008080",
    "Percepción Exploración Sonora": "#10b981",
  };

  const tabsConfig = [
    {
      id: "comparativa",
      label: "Comparativa Global",
      icon: LineChartIcon,
      badge: `${resumenEvaluaciones.totalEvaluaciones}`,
    },
    {
      id: "radar",
      label: "Perfil de Competencias (Radar)",
      icon: RadarIcon,
      badge: "Estado Actual",
    },
    {
      id: "demuca",
      label: "Desglose DEMUCA",
      icon: Layers,
      badge: `${resumenEvaluaciones.totalDemuca}`,
    },
    {
      id: "escalas",
      label: "Escalas ERI / CIM",
      icon: SlidersHorizontal,
      badge: `${resumenEvaluaciones.totalEri + resumenEvaluaciones.totalCim}`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Tarjetas KPIs del Paciente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={<Activity />}
          label="Sesiones Clínicas"
          value={sesionesCount.toString()}
          trend="Historial registrado"
          color="teal"
        />
        <StatCard
          icon={<Award />}
          label="Evaluaciones Totales"
          value={resumenEvaluaciones.totalEvaluaciones.toString()}
          trend={`${resumenEvaluaciones.totalDemuca} DEMUCA · ${resumenEvaluaciones.totalEri} ERI · ${resumenEvaluaciones.totalCim} CIM`}
          color="blue"
        />
        <StatCard
          icon={<TrendingUp />}
          label="Tendencia DEMUCA"
          value={
            resumenEvaluaciones.tasaDemuca !== null
              ? `${resumenEvaluaciones.tasaDemuca >= 0 ? "+" : ""}${resumenEvaluaciones.tasaDemuca}%`
              : "Estable"
          }
          trend={
            resumenEvaluaciones.tasaDemuca !== null &&
            resumenEvaluaciones.tasaDemuca > 0
              ? "Progresión terapéutica favorable"
              : "Evaluación continua"
          }
          color="purple"
        />
        <StatCard
          icon={<CheckCircle2 />}
          label="Promedios Escalas"
          value={
            resumenEvaluaciones.avgEri
              ? `ERI: ${resumenEvaluaciones.avgEri}`
              : "En evaluación"
          }
          trend={
            resumenEvaluaciones.avgCim
              ? `CIM: ${resumenEvaluaciones.avgCim} pts`
              : "Sin CIM previo"
          }
          color="green"
        />
      </div>

      {/* Sub-Pestañas para Segregar los Gráficos */}
      <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-200/50 dark:border-white/5">
        {tabsConfig.map((item) => {
          const Icon = item.icon;
          const isActive = subTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSubTab(item.id as SubTabAnalisis)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? "bg-white dark:bg-[#111] text-[#008080] shadow-sm scale-[1.02]"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? "bg-[#008080]/10 text-[#008080]"
                      : "bg-gray-200/60 dark:bg-white/10 text-gray-400"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Comparativa Global Longitudinal */}
      {subTab === "comparativa" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold dark:text-white serif">
                Evolución Comparativa Multidimensional
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Correlación sesión por sesión de las escalas DEMUCA, ERI y CIM
              </p>
            </div>

            <select
              value={escalaSeleccionada}
              onChange={(e) =>
                setEscalaSeleccionada(e.target.value as typeof escalaSeleccionada)
              }
              className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs md:text-sm font-medium outline-none focus:border-[#008080] dark:text-white cursor-pointer"
            >
              <option value="todas">Ver todas (DEMUCA + ERI + CIM)</option>
              <option value="demuca">Solo DEMUCA (Musicoterapia)</option>
              <option value="eri">Solo ERI (Regulación)</option>
              <option value="cim">Solo CIM (Identidad Musical)</option>
            </select>
          </div>

          <div className="h-80 w-full">
            {evolucionComparativa.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No hay evaluaciones clínicas registradas aún para este paciente.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={evolucionComparativa}>
                  <defs>
                    <linearGradient id="colorDemuca" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEri" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#008080" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#008080" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCim" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#88888815"
                  />
                  <XAxis
                    dataKey="fecha"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#888" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#888" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "14px",
                      color: "#f3f4f6",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: "16px", fontSize: "12px" }}
                  />
                  {(escalaSeleccionada === "todas" ||
                    escalaSeleccionada === "demuca") && (
                    <Area
                      type="monotone"
                      dataKey="demuca"
                      name="DEMUCA (Musicoterapia)"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorDemuca)"
                      connectNulls
                    />
                  )}
                  {(escalaSeleccionada === "todas" ||
                    escalaSeleccionada === "eri") && (
                    <Area
                      type="monotone"
                      dataKey="eri"
                      name="ERI (Regulación)"
                      stroke="#008080"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorEri)"
                      connectNulls
                    />
                  )}
                  {(escalaSeleccionada === "todas" ||
                    escalaSeleccionada === "cim") && (
                    <Area
                      type="monotone"
                      dataKey="cim"
                      name="CIM (Identidad Musical)"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorCim)"
                      connectNulls
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      )}

      {/* TAB 2: Radar de Competencias y Áreas de Desarrollo */}
      {subTab === "radar" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-6 bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold dark:text-white serif">
                    Mapa de Radar de Competencias
                  </h3>
                  <p className="text-xs text-gray-400">
                    Nivel alcanzado en la última evaluación registrada
                  </p>
                </div>
                <Sparkles size={20} className="text-purple-500" />
              </div>

              <div className="h-72 w-full flex items-center justify-center">
                {competenciasRadar.length === 0 ? (
                  <p className="text-gray-400 text-xs">
                    Sin datos suficientes para el mapa de radar.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      data={competenciasRadar}
                    >
                      <PolarGrid stroke="#88888815" />
                      <PolarAngleAxis
                        dataKey="area"
                        tick={{ fontSize: 10, fill: "#8b949e" }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, "auto"]}
                        tick={false}
                        axisLine={false}
                      />
                      <Radar
                        name="Puntaje"
                        dataKey="puntaje"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.25}
                        strokeWidth={2}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "none",
                          borderRadius: "12px",
                          color: "#f3f4f6",
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100 dark:border-white/5 text-xs">
              {competenciasRadar.map((c) => (
                <div
                  key={c.area}
                  className="flex justify-between items-center px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-xl"
                >
                  <span className="text-gray-500 truncate max-w-[130px]">
                    {c.area}
                  </span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {c.puntaje} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold dark:text-white serif">
                  Evolución por Área Terapéutica
                </h3>
                <p className="text-xs text-gray-400">
                  Puntaje acumulado por sesión
                </p>
              </div>
              <Layers size={20} className="text-teal-500" />
            </div>

            <div className="h-72 w-full">
              {categoriasEvolucion.data.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                  Sin datos de evolución por categoría.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoriasEvolucion.data}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#88888815"
                    />
                    <XAxis
                      dataKey="fecha"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#888" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#888" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        borderRadius: "12px",
                        color: "#f3f4f6",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                    />
                    {categoriasEvolucion.keys.slice(0, 4).map((key) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        name={key}
                        fill={CATEGORY_COLORS[key] || "#008080"}
                        radius={[4, 4, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-white/5 text-xs text-gray-400">
              Muestra el desglose de avance psicomotor, sonoro y comunicacional.
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: Desglose Detallado DEMUCA */}
      {subTab === "demuca" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <AnalisDemuca dataDemuca={dataDemuca ?? []} />
        </motion.div>
      )}

      {/* TAB 4: Filtros y Escalas ERI / CIM */}
      {subTab === "escalas" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <GraficoEvolucion progressData={datosEscalas} />
        </motion.div>
      )}
    </div>
  );
}
