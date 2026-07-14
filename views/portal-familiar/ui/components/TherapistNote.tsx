'use client';

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

export function TherapistNote() {
  return (
    <div className="bg-amber-50 dark:bg-amber-500/5 p-8 rounded-[40px] border border-amber-100 dark:border-amber-500/10">
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-4">
        <Star size={20} fill="currentColor" />
        <h3 className="font-bold">Nota de la Terapeuta</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
        &quot;Juan ha tenido una semana excelente. Su respuesta a los estímulos rítmicos ha mejorado notablemente. Recomiendo practicar el ejercicio de respiración antes de dormir.&quot;
      </p>
      <div className="mt-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden relative">
          <Image src="/personal/josue.jpeg" alt="Therapist" fill className="object-cover" />
        </div>
        <div>
          <p className="text-xs font-bold dark:text-white">Lic. María René Vargas</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Musicoterapeuta</p>
        </div>
      </div>
    </div>
  );
}
