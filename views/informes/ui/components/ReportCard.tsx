"use client";

import { motion } from "motion/react";
import {
  FileText,
  User,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface ReportCardData {
  id: string;
  title: string;
  patientName: string;
  date: string;
  status: string;
  therapistName: string;
  reportUrl: string;
}

interface ReportCardProps {
  report: ReportCardData;
  onClick: (report: ReportCardData) => void;
}

export function ReportCard({ report, onClick }: ReportCardProps) {
  return (
    <motion.div
      layoutId={`report-${report.id}`}
      onClick={() => onClick(report)}
      className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 hover:border-[#008080]/30 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080]">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="font-bold dark:text-white group-hover:text-[#008080] transition-colors">
              {report.title}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <User size={12} /> {report.patientName}
              </span>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <Calendar size={12} /> {report.date}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
              report.status === "Leído"
                ? "bg-green-500/10 text-green-500"
                : "bg-blue-500/10 text-blue-500"
            }`}
          >
            {report.status === "Leído" ? (
              <CheckCircle2 size={12} />
            ) : (
              <Clock size={12} />
            )}
            {report.status}
          </div>
          <ChevronRight
            size={20}
            className="text-gray-300 group-hover:text-[#008080] group-hover:translate-x-1 transition-all"
          />
        </div>
      </div>
    </motion.div>
  );
}
