"use client";

import React from "react";
import {CalendarIcon, Clock, User, Video, Play, Trash2, Check, Edit3, RefreshCw, ArrowRight} from "lucide-react";
import {SesionAgenda} from "@/entities/sesion/model/tipos-agenda";
import {useActualizarEstadoSesion} from "@/entities/sesion/api/useActualizarEstadoSesion";
import {toast} from "sonner";

interface DetalleSesionProps {
  session: SesionAgenda;
  onClose: () => void;
  onDeleted?: () => void;
  onEdit?: (session: SesionAgenda) => void;
  onReschedule?: (session: SesionAgenda) => void;
  onStartSession?: (session: SesionAgenda) => void;
}

export function DetalleSesion({session, onClose, onDeleted, onEdit, onReschedule, onStartSession}: DetalleSesionProps) {
  const {actualizarEstado, actualizando} = useActualizarEstadoSesion();

  const statusColor =
    session.status === "Completada"
      ? "text-green-600 bg-green-500/10"
      : session.status === "Cancelada"
        ? "text-red-600 bg-red-500/10"
        : session.status === "Confirmada"
          ? "text-blue-600 bg-blue-500/10"
          : "text-[#008080] bg-[#008080]/10";

  const handleConfirmar = async () => {
    try {
      await actualizarEstado(session.id, "CONFIRMADA");
      toast.success("Sesión confirmada");
      onDeleted?.();
      onClose();
    } catch {
      toast.error("Error al confirmar la sesión");
    }
  };

  const handleCompletar = async () => {
    try {
      await actualizarEstado(session.id, "COMPLETA");
      toast.success("Sesión completada");
      onDeleted?.();
      onClose();
    } catch {
      toast.error("Error al completar la sesión");
    }
  };

  const handleCancelar = async () => {
    try {
      await actualizarEstado(session.id, "CANCELADA");
      toast.success("Sesión cancelada");
      onDeleted?.();
      onClose();
    } catch {
      toast.error("Error al cancelar la sesión");
    }
  };

  const esPendiente = session.status === "Pendiente";
  const esConfirmada = session.status === "Confirmada";
  const esCompletada = session.status === "Completada";
  const esCancelada = session.status === "Cancelada";
  const esEditable = esPendiente || esConfirmada;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg ${statusColor}`}>
          {session.patientName.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-bold dark:text-white">{session.patientName}</h3>
          <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${statusColor}`}>
            {session.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fecha</p>
            <p className="text-sm font-semibold dark:text-white">{session.date || "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hora</p>
            <p className="text-sm font-semibold dark:text-white">{session.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Terapeuta</p>
            <p className="text-sm font-semibold dark:text-white">{session.therapist}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duración</p>
            <p className="text-sm font-semibold dark:text-white">{session.duration}</p>
          </div>
        </div>
      </div>

      {session.type && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tipo:</span>
          <span className="text-xs font-semibold dark:text-white">{session.type}</span>
        </div>
      )}

      {session.notes && (
        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Notas</p>
          <p className="text-sm dark:text-white">{session.notes}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
        {!esCompletada && !esCancelada && (
          <>
            {onStartSession && (
              <button
                onClick={() => onStartSession(session)}
                className="flex-1 min-w-[140px] bg-[#008080] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#006666] transition-all flex items-center justify-center gap-2"
              >
                <Play size={16} fill="currentColor" />
                Iniciar Sesión
              </button>
            )}

            {esPendiente && (
              <button
                onClick={handleConfirmar}
                disabled={actualizando}
                className="flex-1 min-w-[120px] bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Check size={16} />
                Confirmar
              </button>
            )}

            {esConfirmada && (
              <button
                onClick={handleCompletar}
                disabled={actualizando}
                className="flex-1 min-w-[120px] bg-green-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Play size={16} fill="currentColor" />
                Completar
              </button>
            )}

            {onEdit && esEditable && (
              <button
                onClick={() => onEdit(session)}
                className="flex-1 min-w-[100px] bg-amber-500/10 text-amber-600 py-3 rounded-xl font-bold text-sm hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Edit3 size={16} />
                Editar
              </button>
            )}

            {onReschedule && esEditable && (
              <button
                onClick={() => onReschedule(session)}
                className="flex-1 min-w-[120px] bg-purple-500/10 text-purple-600 py-3 rounded-xl font-bold text-sm hover:bg-purple-500/20 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Reagendar
              </button>
            )}

            {!esConfirmada && (
              <button
                onClick={handleCancelar}
                disabled={actualizando}
                className="flex-1 min-w-[100px] bg-red-500/10 text-red-600 py-3 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Cancelar
              </button>
            )}
          </>
        )}

        {esCompletada && session.recordingUrl && (
          <a
            href={session.recordingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#008080] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#006666] transition-all flex items-center justify-center gap-2"
          >
            <Video size={16} />
            Ver Grabación
          </a>
        )}

        {esCancelada && (
          <div className="w-full text-center py-3 text-sm text-gray-400">
            Sesión cancelada — no hay acciones disponibles
          </div>
        )}
      </div>
    </div>
  );
}
