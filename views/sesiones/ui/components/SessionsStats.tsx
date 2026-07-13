'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const durationData = [
  { name: '45 min', value: 65, color: '#008080' },
  { name: '60 min', value: 25, color: '#3b82f6' },
  { name: '30 min', value: 10, color: '#8b5cf6' },
];

export function SessionsStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
      <div className="md:col-span-2 lg:col-span-2 bg-white dark:bg-[#111] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm">
        <h2 className="text-lg font-bold mb-6 dark:text-white">Distribución de Duración</h2>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={durationData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#88888822" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 600, fill: '#888888' }}
                width={80}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  backgroundColor: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                {durationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white dark:bg-[#111] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm flex flex-col justify-center">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Resumen Mensual</h2>
          <Activity size={16} className="text-[#008080]" />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm dark:text-gray-300">Total Sesiones</span>
            <span className="text-xl font-bold dark:text-white">156</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm dark:text-gray-300">Completadas</span>
            <span className="text-xl font-bold text-green-500">142</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm dark:text-gray-300">Canceladas</span>
            <span className="text-xl font-bold text-red-500">4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
