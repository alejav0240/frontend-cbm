'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

interface OverviewGrowthProps {
  data: any[];
}

export function OverviewGrowth({ data }: OverviewGrowthProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="lg:col-span-1"
    >
      <div className="bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base md:text-lg font-bold dark:text-white">Crecimiento</h2>
            <p className="text-[10px] md:text-xs text-gray-400">Nuevos pacientes mensuales.</p>
          </div>
        </div>
        <div className="flex-1 min-h-[200px] md:min-h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPacientes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888822" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--accent)', border: 'none', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="pacientes" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPacientes)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
