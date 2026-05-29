'use client';

import React from 'react';

export function SidebarItem({ icon, label, active = false, onClick, collapsed = false }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void; collapsed?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all font-medium text-sm group ${active ? 'bg-[#008080] text-white shadow-lg shadow-[#008080]/20' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'} ${collapsed ? 'justify-center px-0' : ''}`}
            title={collapsed ? label : undefined}
        >
      <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </span>
            {!collapsed && <span className="truncate">{label}</span>}
        </button>
    );
}
