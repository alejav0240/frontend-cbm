"use client";

import React from "react";

export function ProfileMenuItem({
  icon,
  label,
  onClick,
  color = "text-gray-600 dark:text-gray-400",
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group ${color}`}
    >
      <span className="transition-transform group-hover:scale-110">{icon}</span>
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}
