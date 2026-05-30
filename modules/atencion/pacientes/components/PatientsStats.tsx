'use client';

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { MusicalNotes } from '@/shared/ui/MusicalNotes';
import { GrowthPoint } from '@/modules/atencion/pacientes/types/patient';

interface PatientsStatsProps {
    totalPatients: number;
    growthData: GrowthPoint[];
}

export function PatientsStats({ totalPatients, growthData }: PatientsStatsProps) {
    const growthPercent = useMemo(() => {
        if (growthData.length < 2) return null;
        const prev = growthData[growthData.length - 2].total;
        const curr = growthData[growthData.length - 1].total;
        if (prev === 0) return null;
        return Math.round(((curr - prev) / prev) * 100);
    }, [growthData]);
    return (
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 bg-white dark:bg-[#111] rounded-[32px] p-8 border border-gray-200 dark:border-white/5 shadow-sm">
                <h2 className="text-lg font-bold mb-6 dark:text-white">Crecimiento de Pacientes</h2>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={growthData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888822" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--accent)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: 'var(--foreground)',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                }}
                                cursor={{ fill: 'var(--primary)', fillOpacity: 0.1 }}
                            />
                            <Bar dataKey="total" fill="#008080" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-[#008080] rounded-[32px] p-8 text-white flex flex-col justify-center relative overflow-hidden">
                <MusicalNotes />
                <div className="relative z-10">
                    <p className="text-teal-100 text-sm font-medium mb-2 uppercase tracking-widest">Total Clientes</p>
                    <h3 className="text-5xl font-bold mb-4">{totalPatients}</h3>
                    <div className="flex items-center gap-2 text-teal-100 text-sm">
                        <TrendingUp size={16} />
                        <span>
                            {growthPercent !== null
                                ? `${growthPercent >= 0 ? '+' : ''}${growthPercent}% desde el mes pasado`
                                : 'Sin datos comparativos'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
