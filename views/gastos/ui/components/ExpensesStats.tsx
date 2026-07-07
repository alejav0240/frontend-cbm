'use client';

import React from 'react';
import { TrendingDown, CheckCircle2, Clock } from 'lucide-react';
import { StatCard } from '@/shared/ui/StatCard';

interface ExpensesStatsProps {
  totalExpenses: number;
  paidExpenses: number;
  pendingExpenses: number;
}

export function ExpensesStats({ totalExpenses, paidExpenses, pendingExpenses }: ExpensesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        label="Total Egresos" 
        value={`${totalExpenses} Bs`} 
        icon={<TrendingDown size={24} />} 
        trend="+5.2%" 
        color="red"
      />
      <StatCard 
        label="Pagados" 
        value={`${paidExpenses} Bs`} 
        icon={<CheckCircle2 size={24} />} 
        trend="82% del total" 
        color="green"
      />
      <StatCard 
        label="Pendientes" 
        value={`${pendingExpenses} Bs`} 
        icon={<Clock size={24} />} 
        trend="Por liquidar" 
        color="amber"
      />
    </div>
  );
}
