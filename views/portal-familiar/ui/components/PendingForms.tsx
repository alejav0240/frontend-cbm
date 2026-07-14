'use client';

import React from 'react';
import { ClipboardList, ChevronRight, CheckCircle2 } from 'lucide-react';

interface PendingFormsProps {
  forms: any[];
  onSelectForm: (form: any) => void;
}

export function PendingForms({ forms, onSelectForm }: PendingFormsProps) {
  if (forms.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-[#008080]/10 to-[#008080]/5 p-8 rounded-[40px] border border-[#008080]/20 shadow-sm relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold dark:text-white">Formularios Pendientes</h3>
          <span className="bg-[#008080] text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {forms.length} NUEVOS
          </span>
        </div>
        <div className="space-y-4">
          {forms.map((form) => (
            <button
              key={form.id}
              onClick={() => onSelectForm({ template: form.template, assignmentId: form.id })}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl hover:scale-[1.02] transition-all group border border-transparent hover:border-[#008080]/30 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#008080]/10 flex items-center justify-center text-[#008080]">
                  <ClipboardList size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold dark:text-white group-hover:text-[#008080] transition-colors">
                    {form.template?.name}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Pendiente
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-[#008080] transition-all" />
            </button>
          ))}
        </div>
      </div>
      <CheckCircle2 className="absolute -right-4 -bottom-4 text-[#008080]/5 w-32 h-32 rotate-12" />
    </div>
  );
}
