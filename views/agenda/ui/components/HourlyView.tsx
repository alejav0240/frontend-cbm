'use client';

import React from 'react';
import {motion} from 'motion/react';
import {Play, Plus} from 'lucide-react';

interface HourlyViewProps {
    selectedDate: Date;
    hours: number[];
    getSessionsForSelectedDate: () => any[];
    onSessionClick: (session: any) => void;
    onStartSession: (session: any) => void;
    onSlotClick: (hour: number) => void;
}

export function HourlyView({
                               selectedDate,
                               hours,
                               getSessionsForSelectedDate,
                               onSessionClick,
                               onStartSession,
                               onSlotClick
                           }: HourlyViewProps) {
    return (
        <motion.div
            key="hourly"
            initial={{opacity: 0, x: 20}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: -20}}
            className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm"
        >
            <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
                <h3 className="font-bold dark:text-white serif">
                    Horarios para el {selectedDate.toLocaleDateString('es-BO', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                })}
                </h3>
            </div>
            <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
                {hours.map(hour => {
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const displayHour = hour > 12 ? hour - 12 : hour;
                    const sessionsAtHour = getSessionsForSelectedDate().filter(s => {
                        const sHour = parseInt(s.time.split(':')[0]);
                        const sAmpm = s.time.split(' ')[1];
                        const normalizedSHour = sAmpm === 'PM' && sHour !== 12 ? sHour + 12 : (sAmpm === 'AM' && sHour === 12 ? 0 : sHour);
                        return normalizedSHour === hour;
                    });

                    return (
                        <div key={hour}
                             className="flex border-b border-gray-50 dark:border-white/2 last:border-0 group">
                            <div
                                className="w-24 py-8 px-6 border-r border-gray-50 dark:border-white/2 flex flex-col items-center justify-center bg-gray-50/30 dark:bg-white/1">
                                <span className="text-sm font-bold dark:text-white">{displayHour}:00</span>
                                <span
                                    className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ampm}</span>
                            </div>
                            <div className="flex-1 p-4 flex flex-wrap gap-4 min-h-[100px] items-center">
                                {sessionsAtHour.length > 0 ? (
                                    sessionsAtHour.map(s => (
                                        <motion.div
                                            key={s.id}
                                            whileHover={{scale: 1.01}}
                                            onClick={() => onSessionClick(s)}
                                            className={`flex-1 min-w-[180px] max-w-sm p-3 rounded-[20px] border transition-all cursor-pointer flex items-center justify-between group/item ${
                                                s.status === 'Completada'
                                                    ? 'bg-green-500/5 dark:bg-green-500/10 border-green-500/10 hover:shadow-lg hover:shadow-green-500/5'
                                                    : 'bg-[#008080]/5 dark:bg-[#008080]/10 border-[#008080]/10 hover:shadow-lg hover:shadow-[#008080]/5'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${s.status === 'Completada' ? 'bg-green-500/20 text-green-600' : 'bg-[#008080]/20 text-[#008080]'}`}>
                                                    {s.patientName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold dark:text-white leading-tight">{s.patientName}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span
                                                            className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{s.therapist}</span>
                                                        {s.isTest && (
                                                            <span
                                                                className="text-[7px] bg-purple-500/10 text-purple-600 px-1 py-0.5 rounded-md font-bold">PRUEBA</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{s.duration}</p>
                                                    <p className={`text-[9px] font-bold uppercase tracking-widest ${s.status === 'Completada' ? 'text-green-500' : 'text-[#008080]'}`}>{s.status}</p>
                                                </div>
                                                {s.status !== 'Completada' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onStartSession(s);
                                                        }}
                                                        className="p-2 bg-[#008080] text-white rounded-lg opacity-0 group-hover/item:opacity-100 transition-all hover:scale-110 shadow-lg shadow-[#008080]/20"
                                                    >
                                                        <Play size={12} fill="currentColor"/>
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div
                                        className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onSlotClick(hour)}
                                            className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-[#008080] uppercase tracking-[0.2em] transition-colors"
                                        >
                                            <Plus size={14}/>
                                            Programar en este horario
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
