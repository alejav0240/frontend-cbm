"use client";

import React from "react";
import { motion } from "motion/react";
import { FileText, Eye, Send, Trash2 } from "lucide-react";
import type { FormTemplate } from "@/entities/formulario";

interface TemplatesListProps {
  templates: FormTemplate[];
  onPreview: (form: FormTemplate) => void;
  onAssign: (form: FormTemplate) => void;
  onDelete: (id: string) => void;
}

export function TemplatesList({
  templates,
  onPreview,
  onAssign,
  onDelete,
}: TemplatesListProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((form, idx) => (
        <motion.div
          key={form.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 text-[#008080] flex items-center justify-center mb-6">
            <FileText size={24} />
          </div>
          <h3 className="text-xl font-bold dark:text-white mb-2 group-hover:text-[#008080] transition-colors">
            {form.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
            {form.description}
          </p>

          <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-white/5">
            <div className="flex gap-2">
              <button
                onClick={() => onPreview(form)}
                className="p-2 text-gray-400 hover:text-[#008080] transition-colors"
                title="Vista Previa"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => onAssign(form)}
                className="p-2 text-gray-400 hover:text-[#008080] transition-colors"
                title="Asignar"
              >
                <Send size={18} />
              </button>
              <button
                onClick={() => onDelete(form.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Eliminar"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {form.questions.length} campos
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
