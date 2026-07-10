'use client';

import React from 'react';
import { DollarSign, Users, TrendingUp, Target } from 'lucide-react';
import { formatBs } from '@/shared/lib/utils/formatoMoneda';

interface MarketingStatsProps {
  totalSpent: number;
  totalLeads: number;
  conversionRate: string | number;
  costPerLead: string | number;
}

export function MarketingStats({ totalSpent, totalLeads, conversionRate, costPerLead }: MarketingStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-[#008080]/5 transition-all duration-500">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
          <DollarSign size={48} className="text-[#008080]" />
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Inversión Total</p>
        <h3 className="text-3xl font-light dark:text-white serif tracking-tight">{formatBs(totalSpent)}</h3>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          +12.5% vs mes anterior
        </div>
      </div>
      
      <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
          <Users size={48} className="text-blue-500" />
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Leads</p>
        <h3 className="text-3xl font-light dark:text-white serif tracking-tight">{totalLeads}</h3>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Meta: 500 leads
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-green-500/5 transition-all duration-500">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
          <TrendingUp size={48} className="text-green-500" />
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Conversión</p>
        <h3 className="text-3xl font-light dark:text-white serif tracking-tight">{conversionRate}%</h3>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Optimizado
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-500">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
          <Target size={48} className="text-purple-500" />
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Costo por Lead</p>
        <h3 className="text-3xl font-light dark:text-white serif tracking-tight">{formatBs(Number(costPerLead))}</h3>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-purple-500 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          Eficiencia: Alta
        </div>
      </div>
    </div>
  );
}
