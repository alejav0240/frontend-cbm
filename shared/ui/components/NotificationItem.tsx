'use client';

import React from 'react';

export function NotificationItem({ icon, title, desc, time, color, isRead = true }: { icon: React.ReactNode; title: string; desc: string; time: string; color: string; isRead?: boolean }) {
    return (
        <div className={`p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-gray-50 dark:border-white/5 last:border-0 relative ${!isRead ? 'bg-[#008080]/5' : ''}`}>
            {!isRead && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-[#008080] rounded-full" />
            )}
            <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <p className={`text-sm leading-tight mb-1 ${!isRead ? 'font-bold dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>{title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight mb-2">{desc}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{time}</p>
                </div>
            </div>
        </div>
    );
}
