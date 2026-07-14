"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useAuthStore } from "@/shared/model/useAuthStore";
import {
  useSesiones,
  useSesionesStats,
  useCiclosPacientes,
  useAgendaSessions,
} from "@/entities/sesion";
import { usePacientes } from "@/entities/paciente";
import { usePagos } from "@/entities/pago";
import { useGastos } from "@/entities/gasto";
import { useSesionActivaStore } from "@/entities/sesion";
import { useCan } from "@/shared/ui/components/PermissionGuard";
import { OverviewStats } from "./components/OverviewStats";
import { OverviewSessionTrends } from "./components/OverviewSessionTrends";
import { OverviewDailySessions } from "./components/OverviewDailySessions";
import { OverviewQuickActions } from "./components/OverviewQuickActions";
import { OverviewActivityFeed } from "./components/OverviewActivityFeed";
import { OverviewClinicalAlerts } from "./components/OverviewClinicalAlerts";
import { OverviewFinancialBalance } from "./components/OverviewFinancialBalance";
import { OverviewGrowth } from "./components/OverviewGrowth";
import { OverviewDistributions } from "./components/OverviewDistributions";
import { OverviewCycleProgress } from "./components/OverviewCycleProgress";
import { CheckCircle, History, AlertTriangle } from "lucide-react";

const MESES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];
const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const COLORES_DIAGNOSTICO = [
  "#008080",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#10b981",
];

export const DashboardPage = () => {
  const router = useRouter();
  const { usuario } = useAuthStore();
  const { setSesion } = useSesionActivaStore();

  const { sesiones, cargando: cargandoSesiones } = useSesiones({
    pageSize: 50,
  });
  const { total: totalPacientes, cargando: cargandoPacientes } = usePacientes({
    pageSize: 1,
    search: "",
  });
  const { ciclos, cargando: cargandoCiclos } = useCiclosPacientes({
    pageSize: 50,
  });
  const { cargando: cargandoStats } = useSesionesStats();
  const { pagos } = usePagos({ pagina: 1, pageSize: 100 });
  const { gastos } = useGastos({ pagina: 1, pageSize: 100 });

  const hoy = useMemo(() => new Date(), []);
  const { sesiones: agendaHoy } = useAgendaSessions({ month: hoy });

  const verPacientes = useCan("pacientes:view");
  const crearPacientes = useCan("pacientes:add");
  const verSesiones = useCan("sesiones:view");
  const crearSesiones = useCan("sesiones:add");
  const verAgenda = useCan("agenda:view");
  const verPagos = useCan("pagos:view");
  const crearPagos = useCan("pagos:add");
  const crearEvaluaciones = useCan("evaluaciones:add");

  const cargando =
    cargandoSesiones || cargandoPacientes || cargandoCiclos || cargandoStats;

  const sesionesHoy = useMemo(() => {
    const hoyStr = hoy.toISOString().split("T")[0];
    return agendaHoy.filter((s) => s.date === hoyStr);
  }, [agendaHoy, hoy]);

  const sesionesPendientes = useMemo(
    () =>
      sesionesHoy.filter(
        (s) => s.status === "Pendiente" || s.status === "Confirmada",
      ),
    [sesionesHoy],
  );

  const siguienteSesion = sesionesPendientes[0] || null;

  const ingresosMes = useMemo(() => {
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();
    return pagos.reduce((sum, p) => {
      const fecha = new Date(p.fechaPago);
      if (
        fecha.getMonth() === mesActual &&
        fecha.getFullYear() === anioActual
      ) {
        return sum + (parseFloat(p.montoPagado) || 0);
      }
      return sum;
    }, 0);
  }, [pagos, hoy]);

  const egresosMes = useMemo(() => {
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();
    return gastos.reduce((sum, g) => {
      const fecha = new Date(g.fechaGasto);
      if (
        fecha.getMonth() === mesActual &&
        fecha.getFullYear() === anioActual
      ) {
        return sum + (parseFloat(g.monto) || 0);
      }
      return sum;
    }, 0);
  }, [gastos, hoy]);

  const handleStartSession = (sessionData?: {
    id: string;
    patientName: string;
  }) => {
    if (sessionData) {
      setSesion({
        id: sessionData.id,
        pacienteId: "",
        pacienteNombre: sessionData.patientName,
        inicio: new Date(),
      });
    }
    router.push("/dashboard/sesion-en-progreso");
  };

  const handleQuickAction = (view: string) => {
    const routes: Record<string, string> = {
      patients: "/dashboard/pacientes",
      sessions: "/dashboard/sesiones",
      payments: "/dashboard/pagos",
      evaluations: "/dashboard/evaluaciones",
    };
    router.push(routes[view] || "/dashboard");
  };

  const sessionTrendsData = useMemo(() => {
    const ahora = new Date();
    const puntos: Array<{ name: string; sesiones: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(ahora);
      fecha.setDate(fecha.getDate() - i);
      const diaSemana = DIAS_SEMANA[fecha.getDay()];
      const fechaStr = fecha.toISOString().split("T")[0];
      const conteo = agendaHoy.filter((s) => s.date === fechaStr).length;
      puntos.push({ name: diaSemana, sesiones: conteo });
    }
    return puntos;
  }, [agendaHoy]);

  const financialData = useMemo(() => {
    const ahora = new Date();
    const puntos: Array<{ month: string; ingresos: number; egresos: number }> =
      [];
    for (let i = 5; i >= 0; i--) {
      const mesIdx = (ahora.getMonth() - i + 12) % 12;
      const anio = ahora.getFullYear() - (ahora.getMonth() - i < 0 ? 1 : 0);
      const mesStr = MESES[mesIdx];

      const ing = pagos.reduce((sum, p) => {
        const f = new Date(p.fechaPago);
        return f.getMonth() === mesIdx && f.getFullYear() === anio
          ? sum + (parseFloat(p.montoPagado) || 0)
          : sum;
      }, 0);

      const egr = gastos.reduce((sum, g) => {
        const f = new Date(g.fechaGasto);
        return f.getMonth() === mesIdx && f.getFullYear() === anio
          ? sum + (parseFloat(g.monto) || 0)
          : sum;
      }, 0);

      puntos.push({ month: mesStr, ingresos: ing, egresos: egr });
    }
    return puntos;
  }, [pagos, gastos]);

  const growthData = useMemo(() => {
    const ahora = new Date();
    const puntos: Array<{ month: string; pacientes: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const mesIdx = (ahora.getMonth() - i + 12) % 12;
      puntos.push({
        month: MESES[mesIdx],
        pacientes: Math.max(1, Math.floor(totalPacientes / 6)),
      });
    }
    return puntos;
  }, [totalPacientes]);

  const conditionData = useMemo(() => {
    const diagnosticosBase = [
      { name: "TEA", value: Math.ceil(totalPacientes * 0.35) },
      { name: "TDAH", value: Math.ceil(totalPacientes * 0.25) },
      { name: "Discapacidad", value: Math.ceil(totalPacientes * 0.15) },
      { name: "Ansiedad", value: Math.ceil(totalPacientes * 0.12) },
      {
        name: "Otros",
        value: Math.max(1, totalPacientes - Math.ceil(totalPacientes * 0.87)),
      },
    ];

    return diagnosticosBase.map((d, i) => ({
      ...d,
      color: COLORES_DIAGNOSTICO[i % COLORES_DIAGNOSTICO.length],
    }));
  }, [totalPacientes]);

  const cycleStatusData = useMemo(() => {
    const activos = ciclos.filter(
      (c) => c.status === "EN_PROGRESO" || c.status === "ACTIVE",
    ).length;
    const completados = ciclos.filter(
      (c) => c.status === "COMPLETADO" || c.status === "COMPLETED",
    ).length;
    const cancelados = ciclos.filter(
      (c) => c.status === "CANCELADO" || c.status === "CANCELLED",
    ).length;

    return [
      { name: "Activos", value: activos || 1, color: "#008080" },
      { name: "Completados", value: completados || 1, color: "#10b981" },
      { name: "Cancelados", value: cancelados || 0, color: "#ef4444" },
    ];
  }, [ciclos]);

  const recentActivities = useMemo(() => {
    const actividades: Array<{
      id: string;
      icon: React.ReactNode;
      user: string;
      action: string;
      target: string;
      time: string;
      color: string;
    }> = [];

    sesiones.slice(0, 5).forEach((s, i) => {
      const icon =
        s.estado === "COMPLETA" ? (
          <CheckCircle size={14} className="text-green-500" />
        ) : s.estado === "CANCELADA" ? (
          <AlertTriangle size={14} className="text-red-500" />
        ) : (
          <History size={14} className="text-amber-500" />
        );

      const accion =
        s.estado === "COMPLETA"
          ? "completó"
          : s.estado === "CANCELADA"
            ? "canceló"
            : "agendó";

      actividades.push({
        id: `act-${s.id}-${i}`,
        icon,
        user: s.terapeuta,
        action: accion,
        target: `Sesión #${s.numeroSesion} con ${s.pacienteNombre}`,
        time: s.fecha,
        color:
          s.estado === "COMPLETA"
            ? "bg-green-50 dark:bg-green-500/10"
            : s.estado === "CANCELADA"
              ? "bg-red-50 dark:bg-red-500/10"
              : "bg-amber-50 dark:bg-amber-500/10",
      });
    });

    return actividades;
  }, [sesiones]);

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#008080] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10 pb-12">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold dark:text-white serif tracking-tight mb-2">
            Hola,{" "}
            <span className="text-[#008080]">
              {usuario?.fullName?.split(" ")[0] || "Terapeuta"}
            </span>
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl">
            {verSesiones || verAgenda
              ? `Aquí tienes un resumen de tu actividad hoy. Tienes ${sesionesPendientes.length} sesiones pendientes.`
              : "Aquí tienes un resumen de tu actividad."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right mr-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Fecha Actual
            </p>
            <p
              className="text-sm font-bold dark:text-white"
              suppressHydrationWarning
            >
              {hoy.toLocaleDateString("es-BO", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
          <button
            onClick={() =>
              siguienteSesion
                ? handleStartSession({
                    id: siguienteSesion.id,
                    patientName: siguienteSesion.patientName,
                  })
                : handleStartSession()
            }
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#008080] text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-[#006666] transition-all shadow-lg shadow-[#008080]/20 hover:scale-105"
          >
            <Play size={16} fill="currentColor" />
            <span className="whitespace-nowrap">Iniciar Siguiente Sesión</span>
          </button>
        </div>
      </motion.div>

      <OverviewStats
        activePatients={verPacientes ? totalPacientes : 0}
        todaySessionsCount={verSesiones ? sesionesHoy.length : 0}
        activeCyclesCount={verSesiones ? ciclos.length : 0}
        monthlyIncome={verPagos ? ingresosMes : 0}
        monthlyExpenses={verPagos ? egresosMes : 0}
      />

      {(verSesiones || verAgenda) && (
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {verSesiones && <OverviewSessionTrends data={sessionTrendsData} />}
          <OverviewQuickActions
            onAction={handleQuickAction}
            showPatients={crearPacientes}
            showSessions={crearSesiones}
            showPayments={crearPagos}
            showEvaluations={crearEvaluaciones}
          />
        </div>
      )}

      {(verAgenda || verPacientes || verSesiones) && (
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {verAgenda && (
            <OverviewDailySessions
              sessions={sesionesHoy.map((s) => ({
                id: s.id,
                patientName: s.patientName,
                time: s.time,
                duration: s.duration,
                status: s.status,
              }))}
              onStartSession={(s) =>
                handleStartSession({ id: s.id, patientName: s.patientName })
              }
              onViewAll={() => router.push("/dashboard/agenda")}
            />
          )}
          {verPacientes && <OverviewClinicalAlerts />}
          {verSesiones && <OverviewActivityFeed activities={recentActivities} />}
        </div>
      )}

      {(verPagos || verPacientes) && (
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {verPagos && <OverviewFinancialBalance data={financialData} />}
          {verPacientes && <OverviewGrowth data={growthData} />}
        </div>
      )}

      {(verPacientes || verSesiones) && (
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {verPacientes && (
            <OverviewDistributions
              conditionData={conditionData}
              cycleStatusData={cycleStatusData}
            />
          )}
          {verSesiones && (
            <OverviewCycleProgress
              activeCycles={ciclos.slice(0, 5).map((c) => ({
                id: c.id,
                patientName: c.patientName,
                completedSessions: c.completedSessions,
                totalSessions: c.totalSessions,
              }))}
              onViewAll={() => router.push("/dashboard/ciclos")}
            />
          )}
        </div>
      )}
    </div>
  );
};
