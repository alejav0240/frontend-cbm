"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity } from "lucide-react";

interface ProgresoEscala {
  evaluatedAt: string;
  totalScore: number;
  inSession: boolean;
  id: string;
}

interface EriCimTablasProps {
  eriData?: ProgresoEscala[];
  cimData?: ProgresoEscala[];
}

function EscalaSection({
  titulo,
  etiqueta,
  color,
  data,
}: {
  titulo: string;
  etiqueta: string;
  color: string;
  data: ProgresoEscala[];
}) {
  const ordenado = [...data].sort(
    (a, b) => new Date(a.evaluatedAt).getTime() - new Date(b.evaluatedAt).getTime(),
  );

  const chartData = ordenado.map((e) => ({
    fecha: new Date(e.evaluatedAt).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
    }),
    puntaje: e.totalScore,
  }));

  const promedio =
    ordenado.length > 0
      ? (ordenado.reduce((s, e) => s + e.totalScore, 0) / ordenado.length).toFixed(1)
      : "—";

  return (
    <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Activity size={20} />
        </div>
        <div>
          <h3 className="font-bold text-lg dark:text-white">{titulo}</h3>
          <p className="text-xs text-gray-400">{etiqueta}</p>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-500">
        Promedio: <span className="font-bold dark:text-white" style={{ color }}>{promedio}</span>
        {" | "}Registros: <span className="font-bold dark:text-white">{ordenado.length}</span>
      </div>

      <div className="h-48 mb-6">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Sin datos disponibles
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888815" />
              <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#888" }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#888" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "12px",
                  color: "#f3f4f6",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3)",
                }}
                itemStyle={{ color: "#f3f4f6" }}
                labelStyle={{ color: "#9ca3af", fontWeight: "bold" }}
              />
              <Line type="monotone" dataKey="puntaje" stroke={color} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5">
              <th className="text-left py-2 px-3 text-xs font-bold uppercase tracking-widest text-gray-400">Fecha</th>
              <th className="text-left py-2 px-3 text-xs font-bold uppercase tracking-widest text-gray-400">Puntaje</th>
              <th className="text-left py-2 px-3 text-xs font-bold uppercase tracking-widest text-gray-400">En sesión</th>
            </tr>
          </thead>
          <tbody>
            {ordenado.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-400">Sin evaluaciones registradas</td>
              </tr>
            ) : (
              ordenado.map((e) => (
                <tr key={e.id} className="border-b border-gray-50 dark:border-white/5">
                  <td className="py-2 px-3 dark:text-white">
                    {new Date(e.evaluatedAt).toLocaleDateString("es-ES")}
                  </td>
                  <td className="py-2 px-3">
                    <span className="font-semibold" style={{ color }}>{e.totalScore}</span>
                  </td>
                  <td className="py-2 px-3 text-gray-500">{e.inSession ? "Sí" : "No"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function EriCimTablas({ eriData, cimData }: EriCimTablasProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <EscalaSection
        titulo="ERI"
        etiqueta="Escala de Regulación Emocional"
        color="#008080"
        data={eriData ?? []}
      />
      <EscalaSection
        titulo="CIM"
        etiqueta="Cambio en la Identidad Musical"
        color="#3b82f6"
        data={cimData ?? []}
      />
    </div>
  );
}
