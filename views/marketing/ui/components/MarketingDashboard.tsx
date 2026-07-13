"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";
import { formatBs } from "@/shared/lib/utils/formatoMoneda";

interface CampaignChartDatum {
  name: string;
  presupuesto: number;
  invertido: number;
}

interface SourceDatum {
  name: string;
  value: number;
}

interface TimelineDatum {
  date: string;
  leads: number;
}

interface StatusDatum {
  name: string;
  value: number;
}

interface MarketingDashboardProps {
  campaignData: CampaignChartDatum[];
  sourceData: SourceDatum[];
  timelineData: TimelineDatum[];
  statusData: StatusDatum[];
}

export function MarketingDashboard({
  campaignData,
  sourceData,
  timelineData,
  statusData,
}: MarketingDashboardProps) {
  const COLORS = [
    "#008080",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-light dark:text-white serif">
                Rendimiento de Campañas
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Presupuesto vs Inversión Real
              </p>
            </div>
            <BarChartIcon className="text-[#008080] opacity-20" size={24} />
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={campaignData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#333"
                  vertical={false}
                  opacity={0.1}
                />
                <XAxis
                  dataKey="name"
                  stroke="#888"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `Bs. ${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "none",
                    borderRadius: "16px",
                    color: "#fff",
                    fontSize: "12px",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ color: "#fff" }}
                  cursor={{ fill: "rgba(0, 128, 128, 0.05)" }}
                  formatter={(value) => formatBs(Number(value))}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    fontWeight: "bold",
                    paddingBottom: "20px",
                  }}
                />
                <Bar
                  dataKey="presupuesto"
                  name="Presupuesto"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="invertido"
                  name="Invertido"
                  fill="#008080"
                  radius={[6, 6, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-light dark:text-white serif">
                Origen de Leads
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Canales de Adquisición
              </p>
            </div>
            <PieChartIcon className="text-[#008080] opacity-20" size={24} />
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {sourceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "none",
                    borderRadius: "16px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    fontWeight: "bold",
                    paddingTop: "20px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-light dark:text-white serif">
              Crecimiento Temporal
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Tendencia de Captación
            </p>
          </div>
          <TrendingUp className="text-[#008080] opacity-20" size={24} />
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timelineData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#008080" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#008080" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                vertical={false}
                opacity={0.1}
              />
              <XAxis
                dataKey="date"
                stroke="#888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  border: "none",
                  borderRadius: "16px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#008080"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorLeads)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm">
        <h3 className="text-xl font-light dark:text-white serif mb-8">
          Estado de Prospectos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {statusData.map((status, idx) => (
            <div
              key={idx}
              className="p-6 bg-gray-50 dark:bg-white/2 rounded-3xl text-center border border-transparent hover:border-[#008080]/20 transition-all group"
            >
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 group-hover:text-[#008080] transition-colors">
                {status.name}
              </p>
              <p className="text-4xl font-light dark:text-white serif">
                {status.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
