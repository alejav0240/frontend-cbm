"use client";

import React from "react";
import { motion } from "motion/react";
import { Clock } from "lucide-react";

interface NotesTabProps {
  notes: string;
  setNotes: (notes: string) => void;
  timer: number;
  formatTime: (seconds: number) => string;
}

export function NotesTab({
  notes,
  setNotes,
  timer,
  formatTime,
}: NotesTabProps) {
  const tags = [
    "Respuesta Positiva",
    "Agitación",
    "Improvisación",
    "Resistencia",
    "Interacción",
    "Relajación",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="h-full flex flex-col"
    >
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setNotes(notes + `[${formatTime(timer)}] `)}
          className="flex-shrink-0 px-4 py-2 bg-[#008080]/10 text-[#008080] rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#008080]/20 transition-all flex items-center gap-2"
        >
          <Clock size={14} />
          Marca de Tiempo
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setNotes(notes + `[${formatTime(timer)}] ${tag}: `)}
            className="flex-shrink-0 px-4 py-2 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#008080]/10 hover:text-[#008080] transition-all"
          >
            {tag}
          </button>
        ))}
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Escribe aquí tus observaciones clínicas..."
        className="flex-1 w-full bg-gray-50 dark:bg-white/2 rounded-[24px] md:rounded-[32px] p-6 md:p-8 outline-none focus-visible:ring-2 focus-visible:ring-[#008080] transition-all dark:text-white resize-none text-base md:text-lg leading-relaxed shadow-inner"
      />
    </motion.div>
  );
}
