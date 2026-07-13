"use client";

import React from "react";

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick?: () => void;
}

export function QuickAction({ icon, label, color, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all group"
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
        {label}
      </span>
    </button>
  );
}
