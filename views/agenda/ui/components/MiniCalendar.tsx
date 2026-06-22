'use client';

import React, {useState} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

interface MiniCalendarProps {
    value: Date;
    onChange: (date: Date) => void;
}

export function MiniCalendar({value, onChange}: MiniCalendarProps) {
    const [viewDate, setViewDate] = useState(new Date(value));
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
    const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

    const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

    return (
        <div
            className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <button onClick={handlePrevMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all text-gray-400 hover:text-[#008080]">
                    <ChevronLeft size={18}/>
                </button>
                <h3 className="font-bold dark:text-white text-sm serif">
                    {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                </h3>
                <button onClick={handleNextMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all text-gray-400 hover:text-[#008080]">
                    <ChevronRight size={18}/>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
                    <div key={i}
                         className="h-8 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {Array.from({length: firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth())}).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8"/>
                ))}
                {Array.from({length: daysInMonth(viewDate.getFullYear(), viewDate.getMonth())}).map((_, i) => {
                    const d = i + 1;
                    const currentDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
                    const isSelected = isSameDay(currentDay, value);
                    const isToday = isSameDay(currentDay, new Date());
                    return (
                        <button
                            key={d}
                            onClick={() => onChange(currentDay)}
                            className={`h-8 w-8 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center ${
                                isSelected
                                    ? 'bg-[#008080] text-white shadow-lg shadow-[#008080]/20'
                                    : isToday
                                        ? 'text-[#008080] bg-[#008080]/10'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                            }`}
                        >
                            {d}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
