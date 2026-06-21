"use client";

import React, { useState, useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { RadarChartData } from "@/entities/paciente/ui/AnalisDemuca";

interface PatientAIRadarChartProps {
  data: RadarChartData[]; // Recibe la lista de subescalas individuales de la función formateadora
}

const formatearEtiquetaEje = (value: string) => {
  if (value.length > 16) {
    return `${value.substring(0, 14)}...`;
  }
  return value;
};

export function GraficoRadar({ data }: PatientAIRadarChartProps) {
  // Estado para controlar el filtro por nivel / categoría
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("General");

  // 1. Obtener la lista única de categorías para renderizar los botones de filtro
  const categoriasDisponibles = useMemo(() => {
    const categorias = data.map((item) => item.category);
    return ["General", ...Array.from(new Set(categorias))];
  }, [data]);

  // 2. Procesar y filtrar los datos dinámicamente según el nivel seleccionado
  const datosFiltrados = useMemo(() => {
    if (categoriaSeleccionada === "General") {
      // NIVEL 1: Agrupar y promediar (o sumar) los puntajes por Macro Categoría
      const agrupado: { [key: string]: { total: number; cantidad: number } } =
        {};

      data.forEach((item) => {
        if (!agrupado[item.category]) {
          agrupado[item.category] = { total: 0, cantidad: 0 };
        }
        agrupado[item.category].total += item.score;
        agrupado[item.category].cantidad += 1;
      });

      return Object.keys(agrupado).map((cat) => ({
        item: cat, // El eje mostrará el nombre de la categoría macro
        score: parseFloat(
          (agrupado[cat].total / agrupado[cat].cantidad).toFixed(1),
        ), // Promedio lógico
        category: cat,
      }));
    }

    // NIVEL 2: Desglose. Filtrar solo los ítems individuales pertenecientes a la categoría activa
    return data.filter((item) => item.category === categoriaSeleccionada);
  }, [data, categoriaSeleccionada]);

  return (
    <div className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col h-full w-full transition-all duration-300">
      {/* Encabezado del gráfico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white serif">
            {categoriaSeleccionada === "General"
              ? "Perfil Terapéutico Global"
              : `Desglose: ${categoriaSeleccionada}`}
          </h3>
          <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
            {categoriaSeleccionada === "General"
              ? "Vista macro basada en los promedios de cada área."
              : `Métricas individuales de ${categoriaSeleccionada.toLowerCase()}.`}
          </p>
        </div>
      </div>

      {/* Control de Filtros / Pestañas de Navegación */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
        {categoriasDisponibles.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaSeleccionada(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all duration-200 ${
              categoriaSeleccionada === cat
                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                : "bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 border border-transparent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Contenedor del Gráfico de Radar */}
      <div className="flex-1 min-h-[340px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={datosFiltrados}>
            <PolarGrid stroke="#88888815" />

            <PolarAngleAxis
              dataKey="item"
              tickFormatter={formatearEtiquetaEje}
              tick={{ fontSize: 10, fill: "#8b949e", fontWeight: 500 }}
            />

            <PolarRadiusAxis
              angle={90}
              domain={[0, "auto"]}
              tick={false}
              axisLine={false}
            />

            <Radar
              name="Puntaje"
              dataKey="score"
              stroke="#af52de" /* Cambiado a un tono púrpura elegante alineado con tu dashboard */
              fill="#af52de"
              fillOpacity={0.2}
              strokeWidth={2.5}
              activeDot={{
                r: 5,
                stroke: "#af52de",
                strokeWidth: 2,
                fill: "#fff",
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "14px",
                color: "#f3f4f6",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                padding: "8px 12px",
              }}
              itemStyle={{ color: "#f3f4f6", fontSize: 13 }}
              labelStyle={{
                color: "#9ca3af",
                fontWeight: "bold",
                fontSize: 11,
                marginBottom: "2px",
              }}
              labelFormatter={(value) => `${value}`}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
