'use client';

import React from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface OverviewDistributionsProps {
  conditionData: any[];
  cycleStatusData: any[];
}

export function OverviewDistributions({ conditionData, cycleStatusData }: OverviewDistributionsProps) {
  return (
    <>
      {/* Condition Distribution */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="lg:col-span-1"
      >
        <div className="bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm h-full">
          <h2 className="text-base md:text-lg font-bold mb-4 md:mb-6 dark:text-white">Diagnósticos</h2>
          <div className="h-40 md:h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conditionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {conditionData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--accent)', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: 'var(--foreground)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {conditionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Therapy Cycle Status Distribution */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="lg:col-span-1"
      >
        <div className="bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm h-full">
          <h2 className="text-base md:text-lg font-bold mb-4 md:mb-6 dark:text-white">Estado de Ciclos</h2>
          <div className="h-40 md:h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cycleStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cycleStatusData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--accent)', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: 'var(--foreground)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {cycleStatusData.map((item) => (
              <div key={item.name} className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[8px] text-gray-500 dark:text-gray-400 font-bold uppercase">{item.name}</span>
                </div>
                <span className="text-xs font-bold dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
