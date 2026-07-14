'use client';

import React from 'react';
import Image from 'next/image';
import { MessageSquare } from 'lucide-react';

interface FamilyHeaderProps {
  patient: any;
}

export function FamilyHeader({ patient }: FamilyHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white dark:border-white/10 shadow-xl relative">
          <Image 
            src="/galeria/imagen1.jpg" 
            alt={patient.name} 
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold dark:text-white tracking-tight serif">Portal <span className="text-[#008080]">Familiar</span></h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Bienvenido, familia de <span className="font-bold text-[#008080]">{patient.name}</span></p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 px-6 py-3 rounded-2xl font-bold text-gray-600 dark:text-gray-300 transition-all hover:bg-gray-50">
          <MessageSquare size={20} />
          <span>Contactar Terapeuta</span>
        </button>
      </div>
    </div>
  );
}
