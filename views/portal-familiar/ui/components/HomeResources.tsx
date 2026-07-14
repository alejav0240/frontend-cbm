'use client';

import React from 'react';
import { FileText, Music, Play, ChevronRight } from 'lucide-react';

export function HomeResources() {
  const resources = [
    { title: 'Guía de Relajación Nocturna', type: 'PDF', icon: <FileText size={16} /> },
    { title: 'Playlist: Canciones de Calma', type: 'Audio', icon: <Music size={16} /> },
    { title: 'Ejercicio de Respiración', type: 'Video', icon: <Play size={16} /> },
  ];

  return (
    <div className="bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm">
      <h3 className="text-lg font-bold dark:text-white mb-6">Recursos para Casa</h3>
      <div className="space-y-4">
        {resources.map((resource, i) => (
          <button key={i} className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-white/2 rounded-2xl hover:bg-[#008080]/5 group transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#008080] transition-colors">
                {resource.icon}
              </div>
              <span className="text-xs font-bold dark:text-white text-left">{resource.title}</span>
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-[#008080] transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
}
