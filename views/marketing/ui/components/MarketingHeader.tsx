'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

interface MarketingHeaderProps {
  onNewCampaign: () => void;
  onNewLead: () => void;
}

export function MarketingHeader({ onNewCampaign, onNewLead }: MarketingHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-4xl font-light dark:text-white serif tracking-tight">
          Marketing <span className="text-[#008080] italic font-medium">Intelligence</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium uppercase tracking-[0.2em]">CRM & Campaign Analytics</p>
      </motion.div>
      <div className="flex gap-3 w-full sm:w-auto">
        <button 
          onClick={onNewCampaign}
          className="flex-1 sm:flex-none bg-[#008080] text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-[#006666] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#008080]/20 active:scale-95"
        >
          <Plus size={18} />
          Nueva Campaña
        </button>
        <button 
          onClick={onNewLead}
          className="flex-1 sm:flex-none bg-white dark:bg-white/5 text-[#008080] border border-[#008080]/10 px-6 py-3.5 rounded-2xl font-bold hover:bg-[#008080]/5 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={18} />
          Nuevo Lead
        </button>
      </div>
    </div>
  );
}
