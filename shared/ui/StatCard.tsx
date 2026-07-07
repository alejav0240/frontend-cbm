'use client';

import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, AlertCircle } from 'lucide-react';

export function StatCard({ icon, label, value, trend = '', color = 'teal' }: { icon: React.ReactNode; label: string; value: string; trend?: string; color?: string }) {
  const isPositive = trend?.startsWith('+') ?? false;
  
  const colorMap: Record<string, string> = {
    teal: 'text-[#008080] bg-[#008080]/10',
    blue: 'text-blue-600 bg-blue-600/10',
    red: 'text-red-600 bg-red-600/10',
    green: 'text-green-600 bg-green-600/10',
    purple: 'text-purple-600 bg-purple-600/10',
  };

  const bgGradients: Record<string, string> = {
    teal: 'from-[#008080]/10 via-transparent to-transparent',
    blue: 'from-blue-600/10 via-transparent to-transparent',
    red: 'from-red-600/10 via-transparent to-transparent',
    green: 'from-green-600/10 via-transparent to-transparent',
    purple: 'from-purple-600/10 via-transparent to-transparent',
  };

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
    >
      {/* Musical Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="notes" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M10 10 L10 25 M10 15 L20 10 L20 20" stroke="currentColor" fill="none" strokeWidth="1" />
            <circle cx="10" cy="25" r="3" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#notes)" />
        </svg>
      </div>

      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${bgGradients[color] || bgGradients.teal} rounded-full -mr-16 -mt-16 opacity-50 transition-transform duration-500 group-hover:scale-125`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-6 ${colorMap[color] || colorMap.teal}`}>
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-600 dark:bg-green-500/10' : 'bg-red-100 text-red-600 dark:bg-red-500/10'}`}>
              {isPositive ? <TrendingUp size={10} /> : <AlertCircle size={10} />}
              {trend}
            </div>
          )}
        </div>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-2xl md:text-3xl font-bold dark:text-white serif tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
}
