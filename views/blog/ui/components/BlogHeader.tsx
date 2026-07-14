"use client";

import React from "react";
import { motion } from "motion/react";
import { Plus, FileText } from "lucide-react";

interface BlogHeaderProps {
  onCreateClick: () => void;
  total: number;
}

export function BlogHeader({ onCreateClick, total }: BlogHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold dark:text-white serif">
          Gestión de <span className="text-[#008080] italic">Blog</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
          <FileText size={14} />
          {total} {total === 1 ? "artículo" : "artículos"} en total
        </p>
      </motion.div>
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCreateClick}
        className="bg-[#008080] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#006666] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#008080]/20"
      >
        <Plus size={20} />
        Nuevo Artículo
      </motion.button>
    </div>
  );
}
