'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Download, Eye, Music, Video, Play, CheckCircle, Trash2
} from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';
import { toast } from 'sonner';

interface SessionsTableProps {
  sessions: any[];
  totalFilteredCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  onExportSession: (session: any) => void;
  onViewDetails: (session: any) => void;
  onStartSession: (session: any) => void;
  onCompleteSession: (session: any) => void;
  onDeleteSession: (id: number) => void;
}

export function SessionsTable({
  sessions,
  totalFilteredCount,
  currentPage,
  onPageChange,
  totalPages,
  onExportSession,
  onViewDetails,
  onStartSession,
  onCompleteSession,
  onDeleteSession
}: SessionsTableProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#111] rounded-[24px] md:rounded-[40px] border border-gray-200 dark:border-white/5 shadow-xl shadow-black/5 overflow-hidden"
    >
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
              <th className="px-6 md:px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Sesión</th>
              <th className="px-6 md:px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Cliente</th>
              <th className="px-6 md:px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Rec.</th>
              <th className="px-6 md:px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Fecha / Hora</th>
              <th className="px-6 md:px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Estado</th>
              <th className="px-6 md:px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Pago</th>
              <th className="px-6 md:px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {sessions.map((session, idx) => (
              <motion.tr 
                key={session.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-gray-50/80 dark:hover:bg-white/2 transition-colors group"
              >
                <td className="px-6 md:px-8 py-5 text-sm font-mono font-bold text-[#008080]">#{session.sessionNum}</td>
                <td className="px-6 md:px-8 py-5 text-sm dark:text-white font-bold group-hover:text-[#008080] transition-colors">
                  {session.patientName}
                  {session.institutionName && (
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                      {session.institutionName}
                    </p>
                  )}
                </td>
                <td className="px-6 md:px-8 py-5">
                  {session.recordingUrl ? (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#008080]/10 text-[#008080]" title="Grabación disponible">
                      {session.recordingUrl.includes('.mp3') ? <Music size={14} /> : <Video size={14} />}
                    </div>
                  ) : (
                    <span className="text-gray-300 dark:text-gray-700">-</span>
                  )}
                </td>
                <td className="px-6 md:px-8 py-5">
                  <p className="text-sm font-bold dark:text-white">{session.date}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{session.time}</p>
                </td>
                <td className="px-6 md:px-8 py-5">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    session.status.toLowerCase() === 'completa' ? 'bg-green-100 text-green-600 dark:bg-green-500/10' : 
                    session.status.toLowerCase() === 'confirma' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10' : 
                    session.status.toLowerCase() === 'agendada' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/10' : 
                    session.status.toLowerCase() === 'reprograma' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/10' : 
                    'bg-red-100 text-red-600 dark:bg-red-500/10'
                  }`}>
                    {session.statusDisplay || session.status}
                  </span>
                </td>
                <td className="px-6 md:px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      session.payment.toLowerCase() === 'paid' ? 'bg-green-500' : 
                      session.payment.toLowerCase() === 'exempt' ? 'bg-purple-500' : 
                      'bg-red-500'
                    }`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      session.payment.toLowerCase() === 'paid' ? 'text-green-500' : 
                      session.payment.toLowerCase() === 'exempt' ? 'text-purple-500' : 
                      'text-red-500'
                    }`}>
                      {session.paymentDisplay || session.payment}
                    </span>
                  </div>
                </td>
                <td className="px-6 md:px-8 py-5">
                  <div className="flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all transform md:translate-x-2 md:group-hover:translate-x-0">
                    <button 
                      onClick={() => onExportSession(session)}
                      className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-[#008080] hover:bg-[#008080]/10 transition-all" 
                      title="Exportar PDF"
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      onClick={() => onViewDetails(session)}
                      className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-[#008080] hover:bg-[#008080]/10 transition-all" 
                      title="Ver Detalles"
                    >
                      <Eye size={16} />
                    </button>
                    {session.recordingUrl && (
                      <button 
                        onClick={() => onViewDetails(session)}
                        className="p-2.5 bg-[#008080]/10 text-[#008080] rounded-xl hover:bg-[#008080] hover:text-white transition-all shadow-sm"
                        title="Ver Grabación"
                      >
                        {session.recordingUrl.includes('.mp3') ? <Music size={16} /> : <Video size={16} />}
                      </button>
                    )}
                    <button 
                      onClick={() => onStartSession(session)}
                      className="p-2.5 bg-[#008080] text-white rounded-xl hover:bg-[#006666] transition-all shadow-lg shadow-[#008080]/20"
                      title="Iniciar Sesión"
                    >
                      <Play size={16} fill="currentColor" />
                    </button>
                    {session.status !== 'Completada' && (
                      <button 
                        onClick={() => {
                          const updatedSession = { ...session, status: 'Completada' as const };
                          onCompleteSession(updatedSession);
                          toast.success('Sesión marcada como completada');
                        }}
                        className="p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                        title="Marcar como Completada"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => onDeleteSession(session.id)}
                      className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all" 
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 md:px-8 py-6 bg-gray-50/30 dark:bg-white/1 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Mostrando {sessions.length} de {totalFilteredCount} sesiones
        </p>
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={onPageChange} 
        />
      </div>
    </motion.div>
  );
}
