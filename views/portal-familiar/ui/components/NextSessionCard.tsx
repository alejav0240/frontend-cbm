'use client';

import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface NextSessionCardProps {
  session?: any;
}

export function NextSessionCard({ session }: NextSessionCardProps) {
  if (!session) {
    return (
      <div className="bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm">
        <h3 className="text-lg font-bold dark:text-white mb-4">Próxima Sesión</h3>
        <p className="text-sm text-gray-400 italic">No hay sesiones próximas agendadas.</p>
      </div>
    );
  }

  const sessionDate = new Date(session.sessionDate);
  const now = new Date();
  const diffMs = sessionDate.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const timeLeft = diffDays > 0 ? `Faltan ${diffDays} día${diffDays > 1 ? 's' : ''}` : `Faltan ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;

  return (
    <div className="bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm">
      <h3 className="text-lg font-bold dark:text-white mb-6">Próxima Sesión</h3>
      <div className="bg-blue-50 dark:bg-blue-500/5 p-6 rounded-[32px] border border-blue-100 dark:border-blue-500/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-bold dark:text-white">
              {sessionDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <p className="text-xs text-gray-500">
              {sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {session.therapist?.fullName ? ` • ${session.therapist.fullName}` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold">
          <Clock size={14} />
          <span>{timeLeft}</span>
        </div>
      </div>
    </div>
  );
}
