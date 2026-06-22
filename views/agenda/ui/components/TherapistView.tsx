'use client';

import React from 'react';
import {motion} from 'motion/react';
import {DragOverlay} from '@dnd-kit/react';
import {DroppableSlot, DraggableSession} from './DnDHelpers';
import {closestCenter, DndContext} from "@dnd-kit/core";

interface TherapistViewProps {
    therapists: string[];
    hours: number[];
    getSessionsForSelectedDate: () => any[];
    onSessionClick: (session: any) => void;
    sensors: any;
    handleDragStart: (event: any) => void;
    handleDragEnd: (event: any) => void;
    activeId: number | null;
    sessions: any[];
}

export function TherapistView({
                                  therapists,
                                  hours,
                                  getSessionsForSelectedDate,
                                  onSessionClick,
                                  sensors,
                                  handleDragStart,
                                  handleDragEnd,
                                  activeId,
                                  sessions
                              }: TherapistViewProps) {
    return (
        <motion.div
            key="therapist"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm"
        >
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="overflow-x-auto custom-scrollbar">
                    <div className="min-w-[1000px]">
                        {/* Header Row */}
                        <div
                            className="flex border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
                            <div className="w-24 p-4 border-r border-gray-100 dark:border-white/5"/>
                            {therapists.map((t, idx) => (
                                <div key={idx}
                                     className="flex-1 p-4 text-center border-r border-gray-100 dark:border-white/5 last:border-0">
                                    <p className="text-sm font-bold dark:text-white">{t}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Terapeuta</p>
                                </div>
                            ))}
                        </div>

                        {/* Body */}
                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                            {hours.map(hour => {
                                const displayHour = hour > 12 ? hour - 12 : hour;
                                const ampm = hour >= 12 ? 'PM' : 'AM';

                                return (
                                    <div key={hour}
                                         className="flex border-b border-gray-50 dark:border-white/2 last:border-0">
                                        <div
                                            className="w-24 py-8 px-4 border-r border-gray-50 dark:border-white/2 flex flex-col items-center justify-center bg-gray-50/30 dark:bg-white/1">
                                            <span className="text-sm font-bold dark:text-white">{displayHour}:00</span>
                                            <span
                                                className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ampm}</span>
                                        </div>
                                        {therapists.map((t, tIdx) => {
                                            const sessionsInSlot = getSessionsForSelectedDate().filter(s => {
                                                const sHour = parseInt(s.time.split(':')[0]);
                                                const sAmpm = s.time.split(' ')[1];
                                                const normalizedSHour = sAmpm === 'PM' && sHour !== 12 ? sHour + 12 : (sAmpm === 'AM' && sHour === 12 ? 0 : sHour);
                                                return normalizedSHour === hour && s.therapist === t;
                                            });

                                            return (
                                                <DroppableSlot
                                                    key={`${tIdx}-${hour}`}
                                                    id={`slot-${tIdx}-${hour}`}
                                                    className="flex-1 p-2 border-r border-gray-50 dark:border-white/2 last:border-0 min-h-[100px] bg-transparent hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors"
                                                >
                                                    {sessionsInSlot.map(s => (
                                                        <DraggableSession
                                                            key={s.id}
                                                            session={s}
                                                            onClick={() => onSessionClick(s)}
                                                        />
                                                    ))}
                                                </DroppableSlot>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <DragOverlay>
                    {activeId ? (
                        <div
                            className="p-4 bg-[#008080] text-white rounded-2xl shadow-2xl opacity-90 scale-105 cursor-grabbing">
                            <p className="text-sm font-bold">
                                {sessions.find(s => s.id === activeId)?.patientName}
                            </p>
                            <p className="text-[10px] opacity-70">Reprogramando...</p>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </motion.div>
    );
}
