"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  useSesiones,
  useSesionesStats,
  useCiclosPacientes,
  useEliminarSesion,
  useActualizarEstadoSesion,
  useActualizarSesion,
  type SesionNormalizada,
  type SesionExportarFila,
} from "@/entities/sesion";
import type { CicloPaciente } from "@/entities/sesion/api/useCiclosPacientes";
import { useBuscarPacientes } from "@/entities/paciente";
import { useBuscarTerapeutas } from "@/entities/usuario";
import {
  generarSesionesPDF,
  generarSesionesPDFPreview,
} from "@/entities/sesion/lib/exportar-pdf";
import { generarSesionesExcel } from "@/entities/sesion/lib/exportar-excel";
import { useSesionActivaStore } from "@/entities/sesion";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";
import { SessionsHeader, type ModoVista } from "./components/SessionsHeader";
import { SessionsStats } from "./components/SessionsStats";
import { SkeletonSesiones } from "./components/SkeletonSesiones";
import { TablaSesiones } from "@/widgets/tabla-sesiones";
import { Pagination } from "@/shared/ui/Pagination";
import {
  FiltrosSesiones,
  ModalCrearSesion,
  ModalDetalleSesion,
  ModalEliminarSesion,
  ModalReprogramarSesion,
} from "@/features/gestion-sesiones";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import GenericExportModal, {
  type ExportColumn,
  type Exporter,
} from "@/shared/ui/GenericExportModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "motion/react";
import {
  Layers,
  CheckCircle,
  Clock,
  Plus,
  XCircle,
  RefreshCw,
} from "lucide-react";

export const SesionesPage = () => {
  const router = useRouter();

  const [modoVista, setModoVista] = useState<ModoVista>("lista");
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("all");
  const [filtroTipo, setFiltroTipo] = useState("all");
  const [filtroTerapeuta, setFiltroTerapeuta] = useState("");

  const busquedaDebounced = useDebounce(busqueda, 400);

  const filtros = useMemo(
    () => ({
      page: paginaActual,
      pageSize: 10,
      estadoSesion: filtroEstado === "all" ? "" : filtroEstado,
      tipoSesion: filtroTipo === "all" ? "" : filtroTipo,
    }),
    [paginaActual, filtroEstado, filtroTipo],
  );

  const {
    sesiones,
    total: totalSesiones,
    totalPages: totalPaginasSesiones,
    cargando,
    refetch: refetchSesiones,
  } = useSesiones(filtros);

  const {
    ciclos,
    total: totalCiclos,
    totalPages: totalPaginasCiclos,
    currentPage: paginaCiclos,
    cargando: cargandoCiclos,
    refetch: refetchCiclos,
  } = useCiclosPacientes({ page: paginaActual, pageSize: 10 });

  const sesionesFiltradas = useMemo(() => {
    let resultado = sesiones;
    if (busquedaDebounced) {
      const termino = busquedaDebounced.toLowerCase();
      resultado = resultado.filter(
        (s) =>
          s.pacienteNombre.toLowerCase().includes(termino) ||
          s.terapeuta.toLowerCase().includes(termino),
      );
    }
    if (filtroTerapeuta) {
      resultado = resultado.filter((s) => s.terapeuta === filtroTerapeuta);
    }
    return resultado;
  }, [sesiones, busquedaDebounced, filtroTerapeuta]);

  const terapeutas = useBuscarTerapeutas();
  const terapeutasDisponibles = terapeutas.options.map((t) => t.label);

  const stats = useSesionesStats();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [mostrarExportar, setMostrarExportar] = useState(false);
  const [mostrarReprogramar, setMostrarReprogramar] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [mostrarCancelar, setMostrarCancelar] = useState(false);
  const [sesionSeleccionada, setSesionSeleccionada] =
    useState<SesionNormalizada | null>(null);

  const { eliminarSesion, eliminando } = useEliminarSesion();
  const { actualizarEstado } = useActualizarEstadoSesion();
  const { actualizarSesion } = useActualizarSesion();
  const { setSesion: setSesionActiva } = useSesionActivaStore();

  const {
    options: opcionesPacientes,
    onSearch: onBuscarPaciente,
    buscando: cargandoPacientes,
  } = useBuscarPacientes();

  const refetch = useCallback(() => {
    refetchSesiones();
    refetchCiclos();
  }, [refetchSesiones, refetchCiclos]);

  const datosExportacion = useMemo<SesionExportarFila[]>(
    () =>
      sesionesFiltradas.map((s) => ({
        id: s.id,
        numeroSesion: s.numeroSesion,
        pacienteNombre: s.pacienteNombre,
        institucionNombre: s.institucionNombre,
        fecha: s.fecha,
        hora: s.hora,
        terapeuta: s.terapeuta,
        tipo: s.tipo,
        estado: s.estadoMostrado,
        pago: s.pagoMostrado,
        duracion: s.duracion,
        notas: s.notas,
        videoUrl: s.urlGrabacion,
      })),
    [sesionesFiltradas],
  );

  const columnasExportacion: ExportColumn<SesionExportarFila>[] = useMemo(
    () => [
      { key: "numeroSesion", label: "#" },
      { key: "pacienteNombre", label: "Paciente" },
      { key: "institucionNombre", label: "Institución" },
      { key: "fecha", label: "Fecha" },
      { key: "hora", label: "Hora" },
      { key: "terapeuta", label: "Terapeuta" },
      { key: "tipo", label: "Tipo" },
      { key: "estado", label: "Estado" },
      { key: "pago", label: "Pago" },
      { key: "duracion", label: "Duración" },
    ],
    [],
  );

  const exporters: Exporter<SesionExportarFila>[] = useMemo(
    () => [
      {
        id: "pdf",
        label: "Exportar PDF",
        execute: async (data) => {
          const doc = await generarSesionesPDF(data);
          doc.save(`reporte_sesiones_${Date.now()}.pdf`);
        },
        preview: async (data) => {
          return generarSesionesPDFPreview(data);
        },
      },
      {
        id: "excel",
        label: "Exportar Excel",
        execute: async (data) => {
          await generarSesionesExcel(data);
        },
      },
    ],
    [],
  );

  const verDetalles = useCallback((sesion: SesionNormalizada) => {
    setSesionSeleccionada(sesion);
    setMostrarDetalle(true);
  }, []);

  const exportarSesionIndividual = useCallback(
    async (sesion: SesionNormalizada) => {
      try {
        const fila: SesionExportarFila = {
          id: sesion.id,
          numeroSesion: sesion.numeroSesion,
          pacienteNombre: sesion.pacienteNombre,
          institucionNombre: sesion.institucionNombre,
          fecha: sesion.fecha,
          hora: sesion.hora,
          terapeuta: sesion.terapeuta,
          tipo: sesion.tipo,
          estado: sesion.estadoMostrado,
          pago: sesion.pagoMostrado,
          duracion: sesion.duracion,
          notas: sesion.notas,
        };
        const doc = await generarSesionesPDF([fila]);
        doc.save(`sesion_${sesion.numeroSesion}_${Date.now()}.pdf`);
        toast.success("PDF generado");
      } catch {
        toast.error("Error al exportar");
      }
    },
    [],
  );

  const iniciarSesion = useCallback(
    (sesion: SesionNormalizada) => {
      setSesionActiva({
        id: sesion.id,
        pacienteId: sesion.pacienteId || "",
        pacienteNombre: sesion.pacienteNombre,
        inicio: new Date(),
      });
      router.push("/dashboard/sesion-en-progreso");
    },
    [router, setSesionActiva],
  );

  const marcarCompletada = useCallback(
    async (sesion: SesionNormalizada) => {
      try {
        await actualizarEstado(sesion.id, "COMPLETA");
        await refetch();
      } catch {
        toast.error("Error al actualizar estado");
      }
    },
    [actualizarEstado, refetch],
  );

  const confirmarSesion = useCallback((sesion: SesionNormalizada) => {
    setSesionSeleccionada(sesion);
    setMostrarConfirmar(true);
  }, []);

  const ejecutarConfirmar = useCallback(async () => {
    if (!sesionSeleccionada) return;
    try {
      await actualizarEstado(sesionSeleccionada.id, "CONFIRMA");
      setMostrarConfirmar(false);
      setSesionSeleccionada(null);
      await refetch();
    } catch {
      toast.error("Error al confirmar sesión");
    }
  }, [sesionSeleccionada, actualizarEstado, refetch]);

  const reprogramarSesion = useCallback((sesion: SesionNormalizada) => {
    setSesionSeleccionada(sesion);
    setMostrarReprogramar(true);
  }, []);

  const ejecutarReprogramar = useCallback(
    async (nuevaFecha: string, nuevaHora: string) => {
      if (!sesionSeleccionada) return;
      try {
        const fechaCompleta = `${nuevaFecha}T${nuevaHora}:00`;
        await actualizarSesion(sesionSeleccionada.id, {
          sessionDate: fechaCompleta,
        });
        await actualizarEstado(sesionSeleccionada.id, "REPROGRAMA");
        setMostrarReprogramar(false);
        setSesionSeleccionada(null);
        await refetch();
      } catch {
        toast.error("Error al reprogramar sesión");
      }
    },
    [sesionSeleccionada, actualizarSesion, actualizarEstado, refetch],
  );

  const cancelarSesion = useCallback((sesion: SesionNormalizada) => {
    setSesionSeleccionada(sesion);
    setMostrarCancelar(true);
  }, []);

  const ejecutarCancelar = useCallback(async () => {
    if (!sesionSeleccionada) return;
    try {
      await actualizarEstado(sesionSeleccionada.id, "CANCELADA");
      setMostrarCancelar(false);
      setSesionSeleccionada(null);
      await refetch();
    } catch {
      toast.error("Error al cancelar sesión");
    }
  }, [sesionSeleccionada, actualizarEstado, refetch]);

  const confirmarEliminar = useCallback(async () => {
    if (!sesionSeleccionada) return;
    try {
      await eliminarSesion(sesionSeleccionada.id);
      setMostrarEliminar(false);
      setSesionSeleccionada(null);
      await refetch();
    } catch {
      toast.error("Error al eliminar");
    }
  }, [sesionSeleccionada, eliminarSesion, refetch]);

  const guardarNotas = useCallback(
    async (notas: string) => {
      if (!sesionSeleccionada) return;
      try {
        await actualizarSesion(sesionSeleccionada.id, { notes: notas });
        await refetch();
      } catch {
        toast.error("Error al guardar notas");
      }
    },
    [sesionSeleccionada, actualizarSesion, refetch],
  );

  const handleCambioModo = useCallback((modo: ModoVista) => {
    setModoVista(modo);
    setPaginaActual(1);
  }, []);

  return (
    <div className="space-y-8">
      <SessionsHeader
        modoVista={modoVista}
        onCambioModo={handleCambioModo}
        onExportar={() => setMostrarExportar(true)}
        onNuevaSesion={() => setMostrarFormulario(true)}
        totalSesiones={stats.total}
      />

      <SessionsStats
        total={stats.total}
        completadas={stats.completadas}
        pendientes={stats.pendientes}
        canceladas={stats.canceladas}
      />

      {modoVista === "lista" && (
        <>
          <FiltrosSesiones
            busqueda={busqueda}
            onBusquedaChange={setBusqueda}
            filtroEstado={filtroEstado}
            onEstadoChange={(v) => {
              setFiltroEstado(v);
              setPaginaActual(1);
            }}
            filtroTipo={filtroTipo}
            onTipoChange={(v) => {
              setFiltroTipo(v);
              setPaginaActual(1);
            }}
            filtroTerapeuta={filtroTerapeuta}
            onTerapeutaChange={(v) => {
              setFiltroTerapeuta(v);
              setPaginaActual(1);
            }}
            terapeutasDisponibles={terapeutasDisponibles}
          />

          {cargando ? (
            <SkeletonSesiones />
          ) : (
            <TablaSesiones
              sesiones={sesionesFiltradas}
              totalRegistros={totalSesiones}
              paginaActual={paginaActual}
              totalPaginas={totalPaginasSesiones}
              onCambioPagina={setPaginaActual}
              onVerDetalles={verDetalles}
              onExportarSesion={exportarSesionIndividual}
              onIniciarSesion={iniciarSesion}
              onMarcarCompletada={marcarCompletada}
              onConfirmar={confirmarSesion}
              onReprogramar={reprogramarSesion}
              onCancelar={cancelarSesion}
              onEliminar={(s) => {
                setSesionSeleccionada(s);
                setMostrarEliminar(true);
              }}
              onNuevaSesion={() => setMostrarFormulario(true)}
            />
          )}
        </>
      )}

      {modoVista === "ciclos" && (
        <VistaCiclos
          ciclos={ciclos}
          cargando={cargandoCiclos}
          total={totalCiclos}
          totalPaginas={totalPaginasCiclos}
          paginaActual={paginaCiclos}
          onCambioPagina={setPaginaActual}
          onNuevaSesion={() => setMostrarFormulario(true)}
        />
      )}

      <ModalCrearSesion
        isOpen={mostrarFormulario}
        onClose={() => setMostrarFormulario(false)}
        onCreada={refetch}
        opcionesPacientes={opcionesPacientes}
        onBuscarPaciente={onBuscarPaciente}
        cargandoPacientes={cargandoPacientes}
      />

      <ModalDetalleSesion
        isOpen={mostrarDetalle}
        onClose={() => {
          setMostrarDetalle(false);
          setSesionSeleccionada(null);
        }}
        sesionId={sesionSeleccionada?.id ?? null}
        numeroSesion={sesionSeleccionada?.numeroSesion ?? 0}
        pacienteNombre={sesionSeleccionada?.pacienteNombre ?? ""}
        onExportar={
          sesionSeleccionada
            ? () => exportarSesionIndividual(sesionSeleccionada)
            : undefined
        }
        onGuardarNotas={guardarNotas}
      />

      <ModalEliminarSesion
        isOpen={mostrarEliminar}
        onClose={() => {
          setMostrarEliminar(false);
          setSesionSeleccionada(null);
        }}
        onConfirm={confirmarEliminar}
        numeroSesion={sesionSeleccionada?.numeroSesion ?? 0}
        cargando={eliminando}
      />

      <GenericExportModal<SesionExportarFila>
        isOpen={mostrarExportar}
        onClose={() => setMostrarExportar(false)}
        title="Exportar Sesiones"
        data={datosExportacion}
        columns={columnasExportacion}
        fileName="reporte_sesiones"
        exporters={exporters}
      />

      <ModalReprogramarSesion
        isOpen={mostrarReprogramar}
        onClose={() => {
          setMostrarReprogramar(false);
          setSesionSeleccionada(null);
        }}
        onConfirm={ejecutarReprogramar}
        numeroSesion={sesionSeleccionada?.numeroSesion ?? 0}
      />

      <ConfirmModal
        isOpen={mostrarConfirmar}
        onClose={() => {
          setMostrarConfirmar(false);
          setSesionSeleccionada(null);
        }}
        onConfirm={ejecutarConfirmar}
        title="Confirmar Sesión"
        message={`¿Confirmar la Sesión #${sesionSeleccionada?.numeroSesion ?? ""} del paciente ${sesionSeleccionada?.pacienteNombre ?? ""}?`}
        confirmLabel="Confirmar"
        variant="info"
      />

      <ConfirmModal
        isOpen={mostrarCancelar}
        onClose={() => {
          setMostrarCancelar(false);
          setSesionSeleccionada(null);
        }}
        onConfirm={ejecutarCancelar}
        title="Cancelar Sesión"
        message={`¿Estás seguro de cancelar la Sesión #${sesionSeleccionada?.numeroSesion ?? ""}? Esta acción no se puede deshacer.`}
        confirmLabel="Cancelar Sesión"
        variant="danger"
      />
    </div>
  );
};

function SkeletonCicloCard({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-[#111] rounded-[24px] p-6 border border-gray-200 dark:border-white/5 overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="w-32 h-4 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
          <div className="w-20 h-2.5 rounded bg-gray-100 dark:bg-white/5 animate-pulse" />
        </div>
        <div className="w-16 h-6 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center space-y-1.5">
            <div className="w-10 h-6 rounded bg-gray-200 dark:bg-white/10 animate-pulse mx-auto" />
            <div className="w-14 h-2 rounded bg-gray-100 dark:bg-white/5 animate-pulse mx-auto" />
          </div>
        ))}
      </div>
      <div className="h-px bg-gray-100 dark:bg-white/5 my-3" />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between py-1.5">
            <div className="w-20 h-3 rounded bg-gray-100 dark:bg-white/5 animate-pulse" />
            <div className="w-12 h-3 rounded bg-gray-100 dark:bg-white/5 animate-pulse" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function VistaCiclos({
  ciclos,
  cargando,
  total,
  totalPaginas,
  paginaActual,
  onCambioPagina,
  onNuevaSesion,
}: {
  ciclos: CicloPaciente[];
  cargando: boolean;
  total: number;
  totalPaginas: number;
  paginaActual: number;
  onCambioPagina: (pagina: number) => void;
  onNuevaSesion?: () => void;
}) {
  if (cargando) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCicloCard key={i} delay={i * 0.05} />
        ))}
      </div>
    );
  }

  if (ciclos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-[#008080]/5 flex items-center justify-center">
            <Layers size={36} className="text-[#008080]/30" />
          </div>
        </div>
        <p className="text-sm font-bold uppercase tracking-widest mb-1 dark:text-gray-300">
          No hay ciclos registrados
        </p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mb-6 text-center max-w-xs">
          Los ciclos se agrupan automáticamente por paciente cuando creas
          sesiones
        </p>
        {onNuevaSesion && (
          <button
            onClick={onNuevaSesion}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#008080] text-white rounded-2xl text-sm font-bold hover:bg-[#006666] transition-all shadow-lg shadow-[#008080]/20 hover:scale-105"
          >
            <Plus size={16} />
            Crear primera sesión
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {ciclos.map((ciclo, idx) => {
          const totalSessions = ciclo.totalSessions || 0;
          const completedSessions = ciclo.completedSessions || 0;
          const progreso =
            totalSessions > 0
              ? Math.round((completedSessions / totalSessions) * 100)
              : 0;
          const esActivo = ciclo.status === "active";

          return (
            <motion.div
              key={ciclo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white dark:bg-[#111] rounded-[24px] p-6 border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                esActivo
                  ? "border-l-[3px] border-l-green-400 border-t border-r border-b border-gray-200 dark:border-t-white/5 dark:border-r-white/5 dark:border-b-white/5"
                  : "border border-gray-200 dark:border-white/5"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold dark:text-white">
                    {ciclo.patientName}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Ciclo #{ciclo.cycleNumber}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    esActivo
                      ? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                      : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400"
                  }`}
                >
                  {esActivo ? "Activo" : "Cerrado"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold dark:text-white">
                    {totalSessions}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Sesiones
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-500">
                    {completedSessions}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Completadas
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold dark:text-white">
                    {ciclo.startDate}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Inicio
                  </p>
                </div>
              </div>

              {totalSessions > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Progreso
                    </span>
                    <span className="text-[10px] font-bold text-[#008080]">
                      {progreso}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progreso}%` }}
                      transition={{
                        duration: 0.8,
                        delay: idx * 0.1,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-[#008080] to-[#00b2b2]"
                    />
                  </div>
                </div>
              )}

              {ciclo.paymentSummary && (
                <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-white/5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Pagos
                  </span>
                  <div className="flex items-center gap-3">
                    {(ciclo.paymentSummary.paid ?? 0) > 0 && (
                      <span className="text-[10px] font-bold text-green-500">
                        {ciclo.paymentSummary.paid} pagados
                      </span>
                    )}
                    {(ciclo.paymentSummary.pending ?? 0) > 0 && (
                      <span className="text-[10px] font-bold text-orange-500">
                        {ciclo.paymentSummary.pending} pendientes
                      </span>
                    )}
                    {(ciclo.paymentSummary.exempt ?? 0) > 0 && (
                      <span className="text-[10px] font-bold text-purple-500">
                        {ciclo.paymentSummary.exempt} exentos
                      </span>
                    )}
                  </div>
                </div>
              )}

              {ciclo.sessionsList && ciclo.sessionsList.length > 0 && (
                <div className="pt-3 border-t border-gray-100 dark:border-white/5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Últimas sesiones
                  </p>
                  <div className="relative pl-3">
                    <div className="absolute left-[5px] top-1 bottom-1 w-px bg-gray-200 dark:bg-white/10" />
                    <div className="space-y-3">
                      {ciclo.sessionsList
                        .slice(0, 3)
                        .map((sesionSimplificada) => {
                          const esCompleta =
                            sesionSimplificada.sessionStatus === "COMPLETA";
                          const esAgendada =
                            sesionSimplificada.sessionStatus === "AGENDADA";
                          const esCancelada =
                            sesionSimplificada.sessionStatus === "CANCELADA";

                          return (
                            <div
                              key={sesionSimplificada.id}
                              className="relative flex items-center justify-between"
                            >
                              <div
                                className={`absolute -left-3 w-[11px] h-[11px] rounded-full border-2 border-white dark:border-[#111] z-10 ${
                                  esCompleta
                                    ? "bg-green-400"
                                    : esAgendada
                                      ? "bg-blue-400"
                                      : esCancelada
                                        ? "bg-red-400"
                                        : "bg-gray-300"
                                }`}
                              />
                              <div className="flex items-center gap-2 pl-2">
                                <span className="text-xs dark:text-gray-300">
                                  {sesionSimplificada.sessionDate
                                    ? new Intl.DateTimeFormat("es-ES", {
                                        day: "2-digit",
                                        month: "short",
                                      }).format(
                                        new Date(
                                          sesionSimplificada.sessionDate as string,
                                        ),
                                      )
                                    : "—"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {esCompleta ? (
                                  <CheckCircle
                                    size={10}
                                    className="text-green-400"
                                  />
                                ) : esAgendada ? (
                                  <Clock size={10} className="text-blue-400" />
                                ) : esCancelada ? (
                                  <XCircle size={10} className="text-red-400" />
                                ) : (
                                  <RefreshCw
                                    size={10}
                                    className="text-gray-400"
                                  />
                                )}
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                  {sesionSimplificada.sessionStatus}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {totalPaginas > 1 && (
        <Pagination
          currentPage={paginaActual}
          totalPages={totalPaginas}
          onPageChange={onCambioPagina}
        />
      )}
    </div>
  );
}
