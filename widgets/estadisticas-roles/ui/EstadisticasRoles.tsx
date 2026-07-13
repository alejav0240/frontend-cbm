"use client";

import React, { useMemo } from "react";
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
} from "recharts";
import {
  Shield,
  Users,
  Lock,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
} from "lucide-react";
import { StatCard } from "@/shared/ui/StatCard";
import { Rol } from "@/entities/rol";
import { PERMISSION_MODULES } from "@/shared/data/permissions";

interface EstadisticasRolesProps {
  roles: Rol[];
}

const COLORS = [
  "#008080",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

export function EstadisticasRoles({ roles }: EstadisticasRolesProps) {
  const totalUsuarios = useMemo(
    () => roles.reduce((acc, r) => acc + r.conteoUsuarios, 0),
    [roles],
  );

  const promedioPermisos = useMemo(() => {
    if (roles.length === 0) return 0;
    const total = roles.reduce((acc, r) => acc + r.permisos.length, 0);
    return Math.round(total / roles.length);
  }, [roles]);

  const distribucionUsuarios = useMemo(
    () =>
      roles.map((r) => ({
        name: r.nombre,
        usuarios: r.conteoUsuarios,
      })),
    [roles],
  );

  const distribucionPermisos = useMemo(() => {
    const moduleCounts: Record<string, number> = {};
    roles.forEach((r) => {
      r.permisos.forEach((p) => {
        const moduleId = p.split(":")[0];
        moduleCounts[moduleId] = (moduleCounts[moduleId] || 0) + 1;
      });
    });

    return Object.entries(moduleCounts)
      .map(([moduleId, count]) => {
        const mod = PERMISSION_MODULES.find((m) => m.id === moduleId);
        return {
          name: mod?.name || moduleId,
          value: count,
          icon: mod?.icon || "📋",
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [roles]);

  if (roles.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Shield />}
          label="Total Roles"
          value={String(roles.length)}
          color="teal"
        />
        <StatCard
          icon={<Users />}
          label="Usuarios Asignados"
          value={String(totalUsuarios)}
          color="blue"
        />
        <StatCard
          icon={<Lock />}
          label="Promedio Permisos"
          value={String(promedioPermisos)}
          color="purple"
        />
        <StatCard
          icon={<BarChartIcon />}
          label="Módulos Activos"
          value={String(distribucionPermisos.length)}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-light dark:text-white serif">
                Usuarios por Rol
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Distribución del personal
              </p>
            </div>
            <BarChartIcon className="text-[#008080] opacity-20" size={24} />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={distribucionUsuarios}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "none",
                    borderRadius: "16px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  cursor={{ fill: "rgba(0, 128, 128, 0.05)" }}
                />
                <Bar dataKey="usuarios" radius={[6, 6, 0, 0]} barSize={40}>
                  {distribucionUsuarios.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-light dark:text-white serif">
                Permisos por Módulo
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Cobertura de acceso
              </p>
            </div>
            <PieChartIcon className="text-[#008080] opacity-20" size={24} />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribucionPermisos}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {distribucionPermisos.map((_, index) => (
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
                    paddingTop: "10px",
                  }}
                  formatter={(value: string) => value}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
