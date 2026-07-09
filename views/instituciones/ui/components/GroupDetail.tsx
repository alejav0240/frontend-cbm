'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Plus,
  Calendar,
  Trash2,
  Clock,
  User,
  ArrowLeft,
} from 'lucide-react';
import { DetalleGrupo, SesionGrupo } from '@/entities/institucion';

interface GroupDetailProps {
  group: DetalleGrupo;
  onBack: () => void;
  onNewSession: () => void;
  onDeleteGroup: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('es-ES');
  } catch {
    return dateStr;
  }
}

function formatEstadoSesion(estado: string): string {
  const map: Record<string, string> = {
    COMPLETED: 'Completada',
    PENDING: 'Pendiente',
    CANCELLED: 'Cancelada',
    IN_PROGRESS: 'En Progreso',
  };
  return map[estado] || estado;
}

export function GroupDetail({
  group,
  onBack,
  onNewSession,
  onDeleteGroup,
  onDeleteSession,
}: GroupDetailProps) {
  return (
    <div className="space-y-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-[#008080] transition-colors font-bold text-xs uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        Volver a Grupos
      </button>

      <div className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-[#008080]/10 flex items-center justify-center text-[#008080]">
              <Users size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold dark:text-white serif">{group.nombre}</h2>
              {group.descripcion && (
                <p className="text-gray-500 dark:text-gray-400 mt-1">{group.descripcion}</p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onDeleteGroup(group.id)}
              className="p-4 bg-red-50 dark:bg-red-500/5 text-red-500 rounded-2xl hover:bg-red-500/10 transition-all"
              title="Eliminar Grupo"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={onNewSession}
              className="bg-[#008080] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#006666] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#008080]/20 hover:scale-105"
            >
              <Plus size={20} />
              Nueva Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-[40px] border border-gray-200 dark:border-white/5 shadow-xl shadow-black/5 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/1 flex items-center justify-between">
          <h3 className="font-bold dark:text-white flex items-center gap-3">
            <Calendar className="text-[#008080]" size={20} />
            Historial de Sesiones
          </h3>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-white/5">
          {group.sesiones.length === 0 ? (
            <div className="p-12 text-center text-gray-400 italic">No hay sesiones registradas para este grupo.</div>
          ) : (
            group.sesiones.map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 hover:bg-gray-50/80 dark:hover:bg-white/2 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#008080]/20 to-[#008080]/5 flex items-center justify-center text-[#008080] font-bold text-lg shadow-inner">
                      {session.numeroSesion}
                    </div>
                    <div>
                      <div className="font-bold dark:text-white group-hover:text-[#008080] transition-colors">
                        {formatDate(session.fechaSesion)}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1">
                          <User size={12} /> {session.terapeuta?.fullName || 'Sin terapeuta'}
                        </span>
                        {session.duracionMinutos && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {session.duracionMinutos} min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      session.estadoSesion === 'COMPLETED'
                        ? 'bg-green-100 text-green-600 dark:bg-green-500/10'
                        : 'bg-[#008080]/10 text-[#008080]'
                    }`}>
                      {formatEstadoSesion(session.estadoSesion)}
                    </span>
                    <button
                      onClick={() => onDeleteSession(session.id)}
                      className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                {session.notas && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-white/2 rounded-2xl text-sm text-gray-600 dark:text-gray-400 italic border border-gray-100 dark:border-white/5">
                    &quot;{session.notas}&quot;
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
