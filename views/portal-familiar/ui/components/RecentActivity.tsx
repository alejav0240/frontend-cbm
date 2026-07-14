'use client';

import React from 'react';
import { Video, Mic, Play, Download } from 'lucide-react';

interface RecentActivityProps {
  sessions: any[];
}

export function RecentActivity({ sessions }: RecentActivityProps) {
  return (
    <div className="bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold dark:text-white">Actividad Reciente</h3>
        <button className="text-xs font-bold text-[#008080] hover:underline">Ver Historial</button>
      </div>
      <div className="space-y-6">
        {sessions.slice(0, 3).map((session) => (
          <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/2 rounded-[24px] group hover:bg-white dark:hover:bg-white/5 transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#008080]/10 rounded-2xl flex items-center justify-center text-[#008080] group-hover:scale-110 transition-transform">
                {session.recordingUrl ? <Video size={20} /> : <Mic size={20} />}
              </div>
              <div>
                <p className="text-sm font-bold dark:text-white">Sesión #{session.sessionNum}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{session.date} • {session.therapist}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {session.recordingUrl && (
                <button className="p-3 bg-[#008080] text-white rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#008080]/20">
                  <Play size={16} fill="currentColor" />
                </button>
              )}
              <button className="p-3 text-gray-400 hover:text-[#008080] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all">
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
