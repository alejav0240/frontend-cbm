"use client";

import React from "react";
import { Search } from "lucide-react";

interface UsersFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export function UsersFilters({
  searchTerm,
  onSearchChange,
}: UsersFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#008080] transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar usuarios por nombre, carnet o email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/5 focus:border-[#008080] focus:ring-4 focus:ring-[#008080]/10 outline-none transition-all text-sm dark:text-white shadow-sm"
        />
      </div>
    </div>
  );
}
