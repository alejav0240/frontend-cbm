'use client';

import React from 'react';
import {motion} from 'motion/react';
import {Plus, Clock, LayoutGrid, RefreshCw, Users} from 'lucide-react';
import {CalendarPicker} from "@/shared/ui/components/CalendarPicker";

interface AgendaHeaderProps {
    viewMode: 'calendar' | 'hourly' | 'therapist';
    setViewMode: (mode: 'calendar' | 'hourly' | 'therapist') => void;
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    setShowTestForm: (show: boolean) => void;
    setShowForm: (show: boolean) => void;
}

export function AgendaHeader({
                                 viewMode,
                                 setViewMode,
                                 selectedDate,
                                 setSelectedDate,
                                 setShowTestForm,
                                 setShowForm
                             }: AgendaHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <motion.div
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
            >
                <h1 className="text-3xl font-bold dark:text-white serif">Agenda <span
                    className="text-[#008080] italic">Semanal</span></h1>
                <p className="text-gray-500 dark:text-gray-400">Visualización de sesiones programadas por terapeuta.</p>
            </motion.div>
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl shadow-inner">
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-[#1a1a1a] text-[#008080] shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    >
                        <LayoutGrid size={14}/>
                        Calendario
                    </button>
                    <button
                        onClick={() => setViewMode('hourly')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'hourly' ? 'bg-white dark:bg-[#1a1a1a] text-[#008080] shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    >
                        <Clock size={14}/>
                        Por Horas
                    </button>
                    <button
                        onClick={() => setViewMode('therapist')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'therapist' ? 'bg-white dark:bg-[#1a1a1a] text-[#008080] shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    >
                        <Users size={14}/>
                        Terapeutas
                    </button>
                </div>

                <div className="h-10 w-px bg-gray-200 dark:bg-white/10 hidden md:block"/>

                {viewMode === 'calendar' && (
                    <CalendarPicker
                        value={selectedDate}
                        onChange={setSelectedDate}
                    />
                )}

                <div className="flex gap-2 ml-auto">
                    <button
                        onClick={() => setShowTestForm(true)}
                        className="bg-purple-500/10 text-purple-600 px-4 py-3 rounded-2xl font-bold hover:bg-purple-500/20 transition-all flex items-center gap-2 border border-purple-500/20"
                        title="Agendar sesión de prueba"
                    >
                        <RefreshCw size={18}/>
                        <span className="hidden lg:inline">Sesión de Prueba</span>
                    </button>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-[#008080] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all flex items-center gap-2 shadow-lg"
                    >
                        <Plus size={20}/>
                        Nueva Cita
                    </button>
                </div>
            </div>
        </div>
    );
}
