'use client';

import { FileText, Download, ExternalLink } from 'lucide-react';
import Modal from '@/shared/ui/components/Modal';

interface ReportDetailData {
  id: string;
  title: string;
  patientName: string;
  date: string;
  status: string;
  tutorName: string;
  therapistName: string;
  content: string;
  reportUrl: string;
}

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportDetailData | null;
}

export function ReportDetailsModal({ isOpen, onClose, report }: ReportDetailsModalProps) {
  if (!report) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle del Informe"
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
          <a
            href={report.reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-2xl text-gray-400 hover:text-[#008080] transition-all inline-flex"
          >
            <ExternalLink size={20} />
          </a>
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
          <div className="space-y-1 text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado</p>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              report.status === 'Leído' 
                ? 'bg-green-500/10 text-green-500' 
                : 'bg-blue-500/10 text-blue-500'
            }`}>
              {report.status}
            </div>
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
