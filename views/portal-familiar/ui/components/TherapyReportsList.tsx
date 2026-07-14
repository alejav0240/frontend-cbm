'use client';

import React from 'react';
import { FileText, Eye } from 'lucide-react';

interface TherapyReportsListProps {
  reports: any[];
  onViewReport: (report: any) => void;
}

export function TherapyReportsList({ reports, onViewReport }: TherapyReportsListProps) {
  return (
    <div className="bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold dark:text-white">Informes Terapéuticos</h3>
        <button className="text-xs font-bold text-[#008080] hover:underline">Ver Todos</button>
      </div>
      <div className="space-y-4">
        {reports.length > 0 ? reports.slice(0, 3).map((report) => (
          <div 
            key={report.id} 
            onClick={() => onViewReport(report)}
            className="flex items-center justify-between p-5 bg-gray-50 dark:bg-white/2 rounded-[28px] group hover:bg-white dark:hover:bg-white/5 transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/10 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#008080]/10 rounded-2xl flex items-center justify-center text-[#008080] group-hover:scale-110 transition-transform">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-sm font-bold dark:text-white group-hover:text-[#008080] transition-colors">{report.title}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{report.date} • {report.therapistName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {report.status === 'Enviado' && (
                <span className="w-2 h-2 bg-[#008080] rounded-full" />
              )}
              <Eye size={18} className="text-gray-300 group-hover:text-[#008080] transition-all" />
            </div>
          </div>
        )) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400 italic">No hay informes disponibles todavía.</p>
          </div>
        )}
      </div>
    </div>
  );
}
