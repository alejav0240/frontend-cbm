'use client';

import React from 'react';
import { motion } from 'motion/react';
import { FileText, Download } from 'lucide-react';

interface EvaluationCardProps {
  evaluation: any;
  onView: () => void;
  onExport: (e: React.MouseEvent) => void;
  idx: number;
}

export function EvaluationCard({ evaluation, onView, onExport, idx }: EvaluationCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group cursor-pointer"
      onClick={onView}
    >
      <div className="flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
          evaluation.status === 'Completada' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
        }`}>
          <FileText size={28} />
        </div>
        <div>
          <h3 className="font-bold dark:text-white text-lg group-hover:text-[#008080] transition-colors">{evaluation.patient}</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{evaluation.type}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{evaluation.date}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
        <div className="text-right">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Puntaje</p>
          <p className="font-bold dark:text-white">{evaluation.score || '-'}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
            evaluation.status === 'Completada' ? 'bg-green-100 text-green-600 dark:bg-green-500/10' : 'bg-orange-100 text-orange-600 dark:bg-orange-500/10'
          }`}>
            {evaluation.status}
          </span>
          <button 
            onClick={onExport}
            className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-400 hover:text-[#008080] transition-all"
          >
            <Download size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
