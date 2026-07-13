'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

interface OverviewSessionTrendsProps {
  data: any[];
}

export function OverviewSessionTrends({ data }: OverviewSessionTrendsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="lg:col-span-2"
    >
      <div className="bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm h-full flex flex-col">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-base md:text-lg font-bold dark:text-white">Tendencia de Sesiones</h2>
            <p className="text-[10px] md:text-xs text-gray-400">Actividad semanal de terapias realizadas.</p>
          </div>
          <select className="bg-gray-50 dark:bg-white/5 border-none text-[10px] md:text-xs font-bold rounded-lg px-2 md:px-3 py-1.5 md:py-2 outline-none dark:text-white">
            <option>Esta Semana</option>
            <option>Mes Pasado</option>
          </select>
        </div>
        <div className="flex-1 min-h-[200px] md:min-h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSesiones" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#008080" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#008080" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888822" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#888' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#888' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--accent)', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: 'var(--foreground)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{ color: 'var(--primary)' }}
              />
              <Area 
                type="monotone" 
                dataKey="sesiones" 
                stroke="#008080" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSesiones)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
