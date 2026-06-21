"use client";

import React, {useMemo, useState} from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import {SECTION_COLORS} from "@/shared/data/colors";
import {AreaChartData} from "@/entities/paciente/ui/AnalisDemuca";

interface PatientAITrendChartProps {
    data: AreaChartData[];
}

// Definimos el tipo de las llaves válidas basadas en tu objeto real
type SectionColorKey = keyof typeof SECTION_COLORS;

export function EvolucionCategoria({data}: PatientAITrendChartProps) {
    // Estado tipado correctamente para evitar records implícitos
    const [lineasOcultas, setLineasOcultas] = useState<Record<string, boolean>>({});

    // 1. Extraer dinámicamente todas las categorías presentes en los datos
    const keysCategorias = useMemo(() => {
        if (data.length === 0) return [];
        return Object.keys(data[0]).filter((key) => key !== "evaluationId");
    }, [data]);

    console.log(keysCategorias);

    // 2. Mapear nombres de categorías a los colores de tu archivo de configuración
    const obtenerColorCategoria = (categoria: string): string => {
        const claveAlineada = categoria
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Quita acentos
            .replace(/\s+/g, "_"); // Reemplaza espacios por guiones bajos

        // Mapeo seguro: tratamos SECTION_COLORS como un diccionario indexable por strings
        const colores: Record<string, string> = SECTION_COLORS;
        return colores[claveAlineada] || "#af52de";
    };

    // Solución al ESLint 'no-explicit-any': Tipamos usando una estructura genérica basada en Recharts
    const alternarVisibilidadLinea = (e: { dataKey?: string | number }) => {
        const {dataKey} = e;
        if (!dataKey) return;

        setLineasOcultas((prev) => ({
            ...prev,
            [dataKey]: !prev[dataKey],
        }));
    };

    return (
        <div
            className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col h-full w-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white serif">
                        Evolución por Categoría
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
                        Evolución del puntaje acumulado a lo largo de las sesiones.
                    </p>
                </div>
            </div>

            <div className="flex-1 min-h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{top: 10, right: 10, left: -20, bottom: 0}}
                    >
                        <CartesianGrid
                            strokeDasharray="4 4"
                            vertical={false}
                            stroke="#88888815"
                        />

                        <XAxis
                            dataKey="evaluationId"
                            axisLine={false}
                            tickLine={false}
                            tick={{fontSize: 11, fill: "#8b949e"}}
                            dy={10}
                            tickFormatter={(value, index) => `Sesión ${index + 1}`}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{fontSize: 11, fill: "#8b949e"}}
                            domain={[0, "auto"]}
                            dx={-5}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1f2937",
                                border: "none",
                                borderRadius: "14px",
                                color: "#f3f4f6",
                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                                padding: "10px 14px",
                            }}
                            // SOLUCIÓN CORREGIDA: Cambiado 'paddingVertical' obsoleto por estándar CSS padding
                            itemStyle={{fontSize: 13, padding: "2px 0"}}
                            labelStyle={{
                                color: "#9ca3af",
                                fontWeight: "bold",
                                fontSize: 11,
                                marginBottom: "4px",
                            }}
                            labelFormatter={(value, items) => {
                                return items && items[0]
                                    ? `Análisis: ${items[0].payload.evaluationId}`
                                    : `Sesión`;
                            }}
                        />

                        <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{
                                paddingTop: "24px",
                                fontSize: "12px",
                                fontWeight: 500,
                                cursor: "pointer",
                            }}
                            formatter={(value) => (
                                <span
                                    className={`transition-opacity duration-200 ${
                                        lineasOcultas[value]
                                            ? "opacity-30 line-through text-gray-400"
                                            : "text-gray-700 dark:text-neutral-300"
                                    }`}
                                >
                  {value}
                </span>
                            )}
                        />

                        {keysCategorias.map((categoria) => {
                            const esRestrictivo = categoria
                                .toLowerCase()
                                .includes("restrictiv");

                            return (
                                <Line
                                    key={categoria}
                                    type="monotone"
                                    dataKey={categoria}
                                    name={categoria}
                                    stroke={obtenerColorCategoria(categoria)}
                                    strokeWidth={2.5}
                                    strokeOpacity={lineasOcultas[categoria] ? 0 : 1}
                                    fillOpacity={lineasOcultas[categoria] ? 0 : 1}
                                    dot={
                                        lineasOcultas[categoria] ? false : {r: 3, strokeWidth: 1}
                                    }
                                    activeDot={
                                        lineasOcultas[categoria] ? false : {r: 5, strokeWidth: 0}
                                    }
                                    strokeDasharray={esRestrictivo ? "5 5" : undefined}
                                    connectNulls
                                />
                            );
                        })}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}