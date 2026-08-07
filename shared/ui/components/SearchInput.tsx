"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (valor: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  variant?: "default" | "compact";
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
  id,
  className = "",
  variant = "default",
}: SearchInputProps) {
  const esCompacto = variant === "compact";

  return (
    <div className={`relative flex-1 group ${className}`}>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <Search
        size={esCompacto ? 16 : 18}
        className={`absolute ${
          esCompacto ? "left-4" : "left-4"
        } top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#008080] transition-colors`}
      />
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={
          esCompacto
            ? "w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus-visible:bg-white dark:focus-visible:bg-white/10 focus-visible:border-[#008080] focus-visible:ring-2 focus-visible:ring-[#008080]/10 outline-none transition-all text-sm dark:text-white placeholder:text-gray-400"
            : "w-full pl-12 pr-10 py-4 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/5 focus-visible:border-[#008080] focus-visible:ring-4 focus-visible:ring-[#008080]/10 outline-none transition-all text-sm dark:text-white shadow-sm"
        }
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
