"use client";

import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Users,
  Calendar,
  Activity,
  TrendingUp,
  Download,
  FileSpreadsheet,
  PieChart as PieChartIcon,
  BarChart2,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  HeartPulse,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { toast } from "sonner";
import {
  usePacientes,
  usePacienteCrecimiento,
  generarPacientesPDF,
  generarPacientesExcel,
  PacienteExportarFila,
} from "@/entities/paciente";
import { useCiclosPacientes } from "@/entities/sesion";
import { StatCard } from "@/shared/ui/StatCard";

const PALETTE = [
  "#008080", // Teal corporativo
  "#3b82f6", // Azul
  "#8b5cf6", // Violeta
  "#f59e0b", // Ámbar
  "#10b981", // Esmeralda
  "#ec4899", // Rosa
  "#06b6d4", // Cyan
  "#6366f1", // Índigo
];

export const AnalisisPage = () => {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string>("Todos");
  const [exporting, setExporting] = useState<"pdf" | "excel" | null>(null);

  // Consultar pacientes para análisis detallado
  const { pacientes, total: totalPacientes, cargando: cargandoPacientes } =
    usePacientes({
      search: "",
      pageSize: 100,
    });

  // Datos históricos de crecimiento mensual de pacientes
  const { datosCrecimiento, cargando: cargandoCrecimiento } =
    usePacienteCrecimiento();

  // Ciclos terapéuticos para métricas de efectividad y fases
  const { ciclos, cargando: cargandoCiclos } = useCiclosPacientes({
    pageSize: 100,
  });

  // Cálculo de métricas principales de pacientes
  const metricas = useMemo(() => {
    let activos = 0;
    let inactivos = 0;
    let altas = 0;
    let pendientes = 0;
    let registroCompleto = 0;

    pacientes.forEach((p) => {
      const st = p.status?.toLowerCase();
      if (st === "activo" || st === "active") activos++;
      else if (st === "alta" || st === "discharged") altas++;
      else if (st === "inactivo" || st === "inactive") inactivos++;
      else pendientes++;

      if (p.registrationComplete) registroCompleto++;
    });

    const porcentajeCompletitud =
      pacientes.length > 0
        ? Math.round((registroCompleto / pacientes.length) * 100)
        : 0;

    return {
      activos,
      inactivos,
      altas,
      pendientes,
      registroCompleto,
      porcentajeCompletitud,
    };
  }, [pacientes]);

  // Distribución por Diagnóstico
  const distribucionDiagnosticos = useMemo(() => {
    const counts: Record<string, number> = {};
    pacientes.forEach((p) => {
      const diag = p.diagnosis?.trim() || "No especificado";
      counts[diag] = (counts[diag] || 0) + 1;
    });

    const list = Object.entries(counts).map(([name, value], idx) => ({
      name,
      value,
      color: PALETTE[idx % PALETTE.length],
    }));

    return list.sort((a, b) => b.value - a.value);
  }, [pacientes]);

  // Distribución por Rango Etario
  const distribucionEdades = useMemo(() => {
    const grupos = {
      "0 - 3 años": 0,
      "4 - 6 años": 0,
      "7 - 12 años": 0,
      "13 - 17 años": 0,
      "18+ años": 0,
      "Sin registrar": 0,
    };

    const hoy = new Date();
    pacientes.forEach((p) => {
      if (!p.birthDate) {
        grupos["Sin registrar"]++;
        return;
      }
      const fecha = new Date(p.birthDate);
      let edad = hoy.getFullYear() - fecha.getFullYear();
      const m = hoy.getMonth() - fecha.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
        edad--;
      }

      if (edad < 0) grupos["Sin registrar"]++;
      else if (edad <= 3) grupos["0 - 3 años"]++;
      else if (edad <= 6) grupos["4 - 6 años"]++;
      else if (edad <= 12) grupos["7 - 12 años"]++;
      else if (edad <= 17) grupos["13 - 17 años"]++;
      else grupos["18+ años"]++;
    });

    return Object.entries(grupos).map(([rango, cantidad]) => ({
      rango,
      cantidad,
    }));
  }, [pacientes]);

  // Distribución de Estados para Gráfica de Donut
  const distribucionEstados = useMemo(() => {
    return [
      { name: "Activos", value: metricas.activos, color: "#10b981" },
      { name: "En Alta", value: metricas.altas, color: "#3b82f6" },
      { name: "Pendientes", value: metricas.pendientes, color: "#f59e0b" },
      { name: "Inactivos", value: metricas.inactivos, color: "#9ca3af" },
    ].filter((item) => item.value > 0);
  }, [metricas]);

  // Distribución Geográfica / Residencia
  const distribucionResidencia = useMemo(() => {
    const counts: Record<string, number> = {};
    pacientes.forEach((p) => {
      const res = p.residence?.trim() || "No registrada";
      counts[res] = (counts[res] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([lugar, cantidad]) => ({ lugar, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);
  }, [pacientes]);

  // Tasa de Crecimiento del último mes
  const tasaCrecimiento = useMemo(() => {
    if (!datosCrecimiento || datosCrecimiento.length < 2) return null;
    const clean = datosCrecimiento.filter(
      (d): d is { month: string; total: number } =>
        Boolean(d && d.month !== null && d.total !== null),
    );
    if (clean.length < 2) return null;
    const anterior = clean[clean.length - 2]?.total ?? 0;
    const actual = clean[clean.length - 1]?.total ?? 0;
    if (anterior === 0) return null;
    return Math.round(((actual - anterior) / anterior) * 100);
  }, [datosCrecimiento]);

  // Pacientes filtrados para la tabla resumen de diagnóstico
  const pacientesFiltrados = useMemo(() => {
    if (selectedDiagnosis === "Todos") return pacientes;
    return pacientes.filter(
      (p) => (p.diagnosis?.trim() || "No especificado") === selectedDiagnosis,
    );
  }, [pacientes, selectedDiagnosis]);

  // Exportar a PDF
  const handleExportPDF = async () => {
    setExporting("pdf");
    try {
      const filas: PacienteExportarFila[] = pacientes.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        cedula: p.cedula,
        diagnostico: p.diagnosis || "Sin diagnóstico",
        tutor: p.tutor?.firstName || "Sin tutor",
        telefonoTutor: p.tutor?.celular || "—",
        emailTutor: p.tutor?.email || "—",
        fechaRegistro: p.createdAt
          ? new Date(p.createdAt).toLocaleDateString()
          : "—",
        edad: p.birthDate
          ? `${new Date().getFullYear() - new Date(p.birthDate).getFullYear()} años`
          : "—",
        residencia: p.residence || "—",
        status: p.status,
      }));

      const doc = await generarPacientesPDF(filas);
      doc.save(`analisis_pacientes_${Date.now()}.pdf`);
      toast.success("Reporte PDF generado exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al exportar el reporte PDF");
    } finally {
      setExporting(null);
    }
  };

  // Exportar a Excel
  const handleExportExcel = async () => {
    setExporting("excel");
    try {
      const filas: PacienteExportarFila[] = pacientes.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        cedula: p.cedula,
        diagnostico: p.diagnosis || "Sin diagnóstico",
        tutor: p.tutor?.firstName || "Sin tutor",
        telefonoTutor: p.tutor?.celular || "—",
        emailTutor: p.tutor?.email || "—",
        fechaRegistro: p.createdAt
          ? new Date(p.createdAt).toLocaleDateString()
          : "—",
        edad: p.birthDate
          ? `${new Date().getFullYear() - new Date(p.birthDate).getFullYear()} años`
          : "—",
        residencia: p.residence || "—",
        status: p.status,
      }));

      await generarPacientesExcel(filas);
      toast.success("Reporte Excel descargado exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al exportar a Excel");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Encabezado y Acciones de Exportación */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white serif">
            Análisis y <span className="text-[#008080] italic">Estadísticas</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Métricas demográficas, clínicas y evolución de pacientes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportExcel}
            disabled={exporting !== null}
            className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm disabled:opacity-50"
          >
            <FileSpreadsheet size={18} className="text-emerald-500" />
            <span>{exporting === "excel" ? "Exportando..." : "Exportar Excel"}</span>
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting !== null}
            className="flex items-center gap-2 px-5 py-3 bg-[#008080] hover:bg-[#006666] text-white rounded-2xl text-xs md:text-sm font-bold transition-all shadow-lg shadow-[#008080]/20 disabled:opacity-50"
          >
            <Download size={18} />
            <span>{exporting === "pdf" ? "Generando..." : "Exportar Reporte PDF"}</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Indicadores Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={<Users />}
          label="Total Pacientes"
          value={totalPacientes.toString()}
          trend={
            tasaCrecimiento !== null
              ? `${tasaCrecimiento >= 0 ? "+" : ""}${tasaCrecimiento}% mes anterior`
              : "Histórico consolidado"
          }
          color="teal"
        />
        <StatCard
          icon={<HeartPulse />}
          label="Pacientes Activos"
          value={metricas.activos.toString()}
          trend={`${Math.round((metricas.activos / (totalPacientes || 1)) * 100)}% de la población`}
          color="green"
        />
        <StatCard
          icon={<CheckCircle2 />}
          label="Altas Terapéuticas"
          value={metricas.altas.toString()}
          trend="Objetivos completados"
          color="blue"
        />
        <StatCard
          icon={<Activity />}
          label="Ficha Clínica Completa"
          value={`${metricas.porcentajeCompletitud}%`}
          trend={`${metricas.registroCompleto} de ${pacientes.length} fichas`}
          color="purple"
        />
      </div>

      {/* Gráficas: Crecimiento Temporal y Distribución por Estado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfica de Área: Evolución Histórica */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold dark:text-white">
                Evolución y Crecimiento de Pacientes
              </h2>
              <p className="text-xs text-gray-400">
                Tendencia histórica mensual de ingresos al centro
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-[#008080]">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={datosCrecimiento || []}>
                <defs>
                  <linearGradient id="colorCrecimiento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#008080" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#008080" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#88888822"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--accent)",
                    border: "none",
                    borderRadius: "12px",
                    color: "var(--foreground)",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Pacientes"
                  stroke="#008080"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCrecimiento)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Gráfica de Donut: Estados de Pacientes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm flex flex-col justify-between"
        >
          <div>
            <h2 className="text-lg font-bold mb-1 dark:text-white">
              Estado de Pacientes
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Distribución por condición clínica y permanencia
            </p>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribucionEstados}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {distribucionEstados.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--accent)",
                      border: "none",
                      borderRadius: "12px",
                      color: "var(--foreground)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
            {distribucionEstados.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium">
                    {item.name}
                  </span>
                  <span className="text-sm font-bold dark:text-white">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Gráficas Secundarias: Diagnósticos y Rangos Etarios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Distribución por Diagnóstico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-7 bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold dark:text-white">
                Distribución por Diagnóstico
              </h2>
              <p className="text-xs text-gray-400">
                Condiciones y motivos de derivación terapéutica
              </p>
            </div>
            <PieChartIcon size={20} className="text-teal-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={distribucionDiagnosticos.slice(0, 6)}
                layout="vertical"
                margin={{ left: 20, right: 20, top: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#88888822"
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={140}
                  tick={{ fontSize: 11, fill: "#888" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--accent)",
                    border: "none",
                    borderRadius: "12px",
                    color: "var(--foreground)",
                  }}
                />
                <Bar dataKey="value" name="Pacientes" radius={[0, 8, 8, 0]}>
                  {distribucionDiagnosticos.slice(0, 6).map((entry, idx) => (
                    <Cell key={`bar-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Rangos Etarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-5 bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold dark:text-white">
                Población por Edad
              </h2>
              <p className="text-xs text-gray-400">
                Agrupación por etapas de desarrollo
              </p>
            </div>
            <BarChart2 size={20} className="text-blue-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribucionEdades}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#88888822"
                />
                <XAxis
                  dataKey="rango"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#888" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#888" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--accent)",
                    border: "none",
                    borderRadius: "12px",
                    color: "var(--foreground)",
                  }}
                />
                <Bar
                  dataKey="cantidad"
                  name="Pacientes"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Sección Inferior: Filtro Interactivo por Diagnóstico y Fichas */}
      <div className="bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold dark:text-white">
              Exploración de Pacientes por Diagnóstico
            </h2>
            <p className="text-xs text-gray-400">
              Filtra y visualiza pacientes asociados a cada condición clínica
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={selectedDiagnosis}
              onChange={(e) => setSelectedDiagnosis(e.target.value)}
              className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs md:text-sm font-medium outline-none focus:border-[#008080] dark:text-white cursor-pointer"
            >
              <option value="Todos">Todos los diagnósticos</option>
              {distribucionDiagnosticos.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.value})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">Cédula</th>
                <th className="py-3 px-4">Diagnóstico</th>
                <th className="py-3 px-4">Tutor</th>
                <th className="py-3 px-4">Residencia</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
              {pacientesFiltrados.slice(0, 8).map((paciente) => (
                <tr
                  key={paciente.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-white/1 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#008080]/10 flex items-center justify-center text-[#008080] font-bold text-xs">
                      {paciente.nombre?.charAt(0) || "P"}
                    </div>
                    <span>{paciente.nombre}</span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 font-mono text-xs">
                    {paciente.cedula || "—"}
                  </td>
                  <td className="py-3.5 px-4 text-xs dark:text-gray-300">
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 font-medium">
                      {paciente.diagnosis || "No especificado"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-500">
                    {paciente.tutor?.firstName || "Sin tutor"}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-500 flex items-center gap-1 mt-3">
                    <MapPin size={12} className="text-gray-400" />
                    <span>{paciente.residence || "—"}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        paciente.status === "Activo"
                          ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                          : paciente.status === "Alta"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                            : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400"
                      }`}
                    >
                      {paciente.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pacientesFiltrados.length === 0 && (
            <div className="py-8 text-center text-gray-400 text-sm">
              No se encontraron pacientes para el diagnóstico seleccionado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
