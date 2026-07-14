'use client';

import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Modal } from "@/shared/ui/components/Modal";

interface ReportDetailModalProps {
  report: any;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportDetailModal({ report, isOpen, onClose }: ReportDetailModalProps) {
  if (!report) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Informe Terapéutico"
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#008080] flex items-center justify-center text-white shadow-lg shadow-[#008080]/20">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold dark:text-white">{report.title}</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Enviado el {report.date}</p>
            </div>
          </div>
          <button className="p-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-2xl text-gray-400 hover:text-[#008080] transition-all">
            <Download size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paciente</p>
            <p className="text-sm font-bold dark:text-white">{report.patientName}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tutor</p>
            <p className="text-sm font-bold dark:text-white">{report.tutorName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Terapeuta</p>
            <p className="text-sm font-bold dark:text-white">{report.therapistName}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contenido del Informe</p>
          <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 text-sm leading-relaxed dark:text-gray-300 whitespace-pre-wrap">
            {report.content}
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
}
