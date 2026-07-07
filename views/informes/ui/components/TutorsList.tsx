'use client';

import { ArrowRight } from 'lucide-react';
import { Patient } from '@/types';

interface TutorsListProps {
  patients: Patient[];
}

export function TutorsList({ patients }: TutorsListProps) {
  return (
    <div className="bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5">
      <h3 className="text-lg font-bold dark:text-white mb-6">Tutores Activos</h3>
      <div className="space-y-4">
        {patients.slice(0, 4).map((patient) => (
          <div key={patient.id} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 font-bold text-xs group-hover:bg-[#008080]/10 group-hover:text-[#008080] transition-all">
                {patient.tutor.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold dark:text-white group-hover:text-[#008080] transition-colors">{patient.tutor}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tutor de {patient.name}</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
}
