"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Play,
  CheckCircle,
  Download,
  Trash2,
  Music,
  Video,
  Eye,
  CalendarCheck,
  RefreshCw,
  XCircle,
  MoreVertical,
  Clock,
  CalendarX,
  Plus,
} from "lucide-react";
import { Pagination } from "@/shared/ui/Pagination";
import type { SesionNormalizada } from "@/entities/sesion";

interface TablaSesionesProps {
  sesiones: SesionNormalizada[];
  totalRegistros: number;
  paginaActual: number;
  totalPaginas: number;
  onCambioPagina: (pagina: number) => void;
  onVerDetalles: (sesion: SesionNormalizada) => void;
  onExportarSesion: (sesion: SesionNormalizada) => void;
  onIniciarSesion: (sesion: SesionNormalizada) => void;
  onMarcarCompletada: (sesion: SesionNormalizada) => void;
  onConfirmar: (sesion: SesionNormalizada) => void;
  onReprogramar: (sesion: SesionNormalizada) => void;
  onCancelar: (sesion: SesionNormalizada) => void;
  onEliminar: (sesion: SesionNormalizada) => void;
  onNuevaSesion?: () => void;
}

export function TablaSesiones({
  sesiones,
  totalRegistros,
  paginaActual,
  totalPaginas,
  onCambioPagina,
  onVerDetalles,
  onExportarSesion,
  onIniciarSesion,
  onMarcarCompletada,
  onConfirmar,
  onReprogramar,
  onCancelar,
  onEliminar,
  onNuevaSesion,
}: TablaSesionesProps) {
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const cerrarMenu = useCallback(() => setMenuAbierto(null), []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        cerrarMenu();
      }
    };
    if (menuAbierto) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuAbierto, cerrarMenu]);

  if (sesiones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-[#008080]/5 flex items-center justify-center">
            <CalendarX size={36} className="text-[#008080]/30" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
            <span className="text-lg text-gray-300 dark:text-gray-600">~</span>
          </div>
        </div>
        <p className="text-sm font-bold uppercase tracking-widest mb-1 dark:text-gray-300">
          No hay sesiones
        </p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mb-6 text-center max-w-xs">
          Crea tu primera sesión para comenzar a registrar la intervención
          terapéutica
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
              <th className="pl-8 pr-6 md:pl-8 md:pr-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] w-1">
                <span className="sr-only">Estado color</span>
              </th>
              <th className="px-6 md:px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Sesión
              </th>
              <th className="px-6 md:px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Paciente
              </th>
              <th className="px-6 md:px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Terapeuta
              </th>
              <th className="px-6 md:px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Fecha / Hora
              </th>
              <th className="px-6 md:px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Estado
              </th>
              <th className="px-6 md:px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Pago
              </th>
              <th className="px-6 md:px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {sesiones.map((sesion, idx) => (
              <motion.tr
                key={sesion.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`hover:bg-gray-50/80 dark:hover:bg-white/2 transition-colors group ${CLASE_BORDE}`}
              >
                <td className="pl-8 pr-6 md:pl-8 md:pr-6 py-5 w-1">
                  <div
                    className={`w-[3px] h-8 rounded-full ${obtenerColorBordeEstado(sesion.estado)}`}
                  />
                </td>
                <td className="px-6 md:px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#008080]/10 flex items-center justify-center text-[#008080] font-bold text-sm">
                      #{sesion.numeroSesion}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {obtenerIconoEstadoMini(sesion.estado)}
                    </div>
                  </div>
                </td>
                <td className="px-6 md:px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#008080]/20 to-[#008080]/5 flex items-center justify-center text-[#008080] font-bold text-sm shadow-inner">
                      {sesion.pacienteNombre?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white group-hover:text-[#008080] transition-colors">
                        {sesion.pacienteNombre}
                      </p>
                      {sesion.institucionNombre &&
                        sesion.institucionNombre !== "Sin institución" && (
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                            {sesion.institucionNombre}
                          </p>
                        )}
                    </div>
                  </div>
                </td>
                <td className="px-6 md:px-6 py-5 text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {sesion.terapeuta}
                </td>
                <td className="px-6 md:px-6 py-5">
                  <p className="text-sm font-bold dark:text-white">
                    {sesion.fecha}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {sesion.hora}
                  </p>
                </td>
                <td className="px-6 md:px-6 py-5">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${obtenerClaseEstado(sesion.estado)}`}
                  >
                    {sesion.estadoMostrado}
                  </span>
                </td>
                <td className="px-6 md:px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${obtenerColorPago(sesion.pago)}`}
                    />
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${obtenerClaseTextoPago(sesion.pago)}`}
                    >
                      {sesion.pagoMostrado}
                    </span>
                  </div>
                </td>
                <td className="px-6 md:px-8 py-5">
                  <div
                    className="flex justify-end"
                    ref={menuAbierto === sesion.id ? menuRef : undefined}
                  >
                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenuAbierto(
                            menuAbierto === sesion.id ? null : sesion.id,
                          )
                        }
                        className="p-2 rounded-xl text-gray-400 hover:text-[#008080] hover:bg-[#008080]/10 transition-all md:opacity-0 md:group-hover:opacity-100"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {menuAbierto === sesion.id && (
                        <div className="absolute right-0 top-full mt-1 z-50 w-56 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl shadow-black/10 overflow-hidden">
                          <div className="p-1.5">
                            <MenuItem
                              icono={<Eye size={14} />}
                              label="Ver Detalles"
                              onClick={() => {
                                onVerDetalles(sesion);
                                cerrarMenu();
                              }}
                            />
                            <MenuItem
                              icono={<Download size={14} />}
                              label="Exportar PDF"
                              onClick={() => {
                                onExportarSesion(sesion);
                                cerrarMenu();
                              }}
                            />
                            {sesion.urlGrabacion && (
                              <MenuItem
                                icono={
                                  sesion.urlGrabacion.includes(".mp3") ? (
                                    <Music size={14} />
                                  ) : (
                                    <Video size={14} />
                                  )
                                }
                                label="Ver Grabación"
                                onClick={() => {
                                  onVerDetalles(sesion);
                                  cerrarMenu();
                                }}
                                variante="primario"
                              />
                            )}

                            {(sesion.estado === "AGENDADA" ||
                              sesion.estado === "CONFIRMA" ||
                              sesion.estado === "REPROGRAMA") && (
                              <>
                                <div className="h-px bg-gray-100 dark:bg-white/5 my-1" />
                                <MenuItem
                                  icono={<Play size={14} fill="currentColor" />}
                                  label="Iniciar Sesión"
                                  onClick={() => {
                                    onIniciarSesion(sesion);
                                    cerrarMenu();
                                  }}
                                  variante="primario"
                                />
                              </>
                            )}

                            {sesion.estado === "AGENDADA" && (
                              <MenuItem
                                icono={<CalendarCheck size={14} />}
                                label="Confirmar"
                                onClick={() => {
                                  onConfirmar(sesion);
                                  cerrarMenu();
                                }}
                                variante="info"
                              />
                            )}

                            {(sesion.estado === "AGENDADA" ||
                              sesion.estado === "CONFIRMA") && (
                              <MenuItem
                                icono={<RefreshCw size={14} />}
                                label="Reprogramar"
                                onClick={() => {
                                  onReprogramar(sesion);
                                  cerrarMenu();
                                }}
                                variante="advertencia"
                              />
                            )}

                            {sesion.estado !== "COMPLETA" &&
                              sesion.estado !== "CANCELADA" && (
                                <MenuItem
                                  icono={<CheckCircle size={14} />}
                                  label="Marcar Completada"
                                  onClick={() => {
                                    onMarcarCompletada(sesion);
                                    cerrarMenu();
                                  }}
                                  variante="exito"
                                />
                              )}

                            {sesion.estado !== "COMPLETA" &&
                              sesion.estado !== "CANCELADA" && (
                                <MenuItem
                                  icono={<XCircle size={14} />}
                                  label="Cancelar"
                                  onClick={() => {
                                    onCancelar(sesion);
                                    cerrarMenu();
                                  }}
                                  variante="peligro"
                                />
                              )}

                            <div className="h-px bg-gray-100 dark:bg-white/5 my-1" />
                            <MenuItem
                              icono={<Trash2 size={14} />}
                              label="Eliminar"
                              onClick={() => {
                                onEliminar(sesion);
                                cerrarMenu();
                              }}
                              variante="peligro"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 md:px-8 py-6 bg-gray-50/30 dark:bg-white/1 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Mostrando {sesiones.length} de {totalRegistros} sesiones
        </p>
        <Pagination
          currentPage={paginaActual}
          totalPages={totalPaginas}
          onPageChange={onCambioPagina}
        />
      </div>
    </motion.div>
  );
}

function MenuItem({
  icono,
  label,
  onClick,
  variante = "default",
}: {
  icono: React.ReactNode;
  label: string;
  onClick: () => void;
  variante?:
    | "default"
    | "primario"
    | "exito"
    | "peligro"
    | "info"
    | "advertencia";
}) {
  const colores = {
    default:
      "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5",
    primario: "text-[#008080] hover:bg-[#008080]/5",
    exito:
      "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/5",
    peligro: "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5",
    info: "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/5",
    advertencia:
      "text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/5",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${colores[variante]}`}
    >
      {icono}
      {label}
    </button>
  );
}

const CLASE_BORDE = "border-l-[3px]";

function obtenerColorBordeEstado(estado: string): string {
  switch (estado) {
    case "COMPLETA":
      return "bg-green-400";
    case "CONFIRMA":
      return "bg-emerald-400";
    case "AGENDADA":
      return "bg-blue-400";
    case "REPROGRAMA":
      return "bg-orange-400";
    case "CANCELADA":
      return "bg-red-400";
    default:
      return "bg-gray-300";
  }
}

function obtenerIconoEstadoMini(estado: string) {
  switch (estado) {
    case "COMPLETA":
      return <CheckCircle size={12} className="text-green-400" />;
    case "CONFIRMA":
      return <CalendarCheck size={12} className="text-emerald-400" />;
    case "AGENDADA":
      return <Clock size={12} className="text-blue-400" />;
    case "REPROGRAMA":
      return <RefreshCw size={12} className="text-orange-400" />;
    case "CANCELADA":
      return <XCircle size={12} className="text-red-400" />;
    default:
      return null;
  }
}

function obtenerClaseEstado(estado: string): string {
  switch (estado) {
    case "COMPLETA":
      return "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400";
    case "CONFIRMA":
      return "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400";
    case "AGENDADA":
      return "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
    case "REPROGRAMA":
      return "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400";
    case "CANCELADA":
      return "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400";
  }
}

function obtenerColorPago(pago: string): string {
  switch (pago) {
    case "PAID":
      return "bg-green-500";
    case "EXEMPT":
      return "bg-purple-500";
    default:
      return "bg-red-500";
  }
}

function obtenerClaseTextoPago(pago: string): string {
  switch (pago) {
    case "PAID":
      return "text-green-500";
    case "EXEMPT":
      return "text-purple-500";
    default:
      return "text-red-500";
  }
}
