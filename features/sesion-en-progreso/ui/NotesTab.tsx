"use client";

import React, { useRef, useCallback } from "react";
import { motion } from "motion/react";
import { Clock, CheckCircle2, Sparkles, CornerDownLeft } from "lucide-react";

interface NotesTabProps {
  notes: string;
  setNotes: (notes: string) => void;
  timer: number;
  formatTime: (seconds: number) => string;
  ultimoGuardado?: Date | null;
}

export function NotesTab({
  notes,
  setNotes,
  timer,
  formatTime,
  ultimoGuardado,
}: NotesTabProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const tags = [
    "Respuesta Positiva",
    "Agitación",
    "Improvisación",
    "Resistencia",
    "Interacción",
    "Relajación",
  ];

  const insertarTextoEnCursor = useCallback(
    (textoAInsertar: string) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        setNotes(notes + textoAInsertar);
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const previo = notes.substring(0, start);
      const posterior = notes.substring(end);

      // Si no estamos al inicio de una línea y no hay espacio previo, agregar salto o espacio
      let prefijo = "";
      if (start > 0 && previo[start - 1] !== "\n" && previo[start - 1] !== " ") {
        prefijo = "\n";
      }

      const nuevoContenido = previo + prefijo + textoAInsertar + posterior;
      setNotes(nuevoContenido);

      const nuevaPosicion = start + prefijo.length + textoAInsertar.length;
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(nuevaPosicion, nuevaPosicion);
      });
    },
    [notes, setNotes],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Atajo Ctrl+M o Alt+T para insertar marca de tiempo
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
      e.preventDefault();
      insertarTextoEnCursor(`[${formatTime(timer)}] `);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="h-full flex flex-col space-y-3"
    >
      {/* Barra de herramientas y feedback */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => insertarTextoEnCursor(`[${formatTime(timer)}] `)}
            className="flex-shrink-0 px-3.5 py-2 bg-[#008080] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-[#006666] active:scale-95 transition-all flex items-center gap-1.5 shadow-sm shadow-[#008080]/20"
            title="Insertar tiempo actual en la posición del cursor (Atajo: Ctrl+M)"
          >
            <Clock size={13} />
            <span>Marca [Ctrl+M]</span>
          </button>

          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => insertarTextoEnCursor(`[${formatTime(timer)}] ${tag}: `)}
              className="flex-shrink-0 px-3 py-2 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-xl text-[10px] font-medium tracking-wide hover:bg-[#008080]/10 hover:text-[#008080] active:scale-95 transition-all border border-transparent hover:border-[#008080]/20"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Indicador de Auto-guardado seguro */}
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 self-end sm:self-center shrink-0">
          <CheckCircle2 size={12} className="animate-in fade-in" />
          <span>
            {ultimoGuardado
              ? `Guardado ${ultimoGuardado.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
              : "Guardado local activo"}
          </span>
        </div>
      </div>

      {/* Área de texto clínica */}
      <div className="relative flex-1 flex flex-col min-h-[220px]">
        <textarea
          ref={textareaRef}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe aquí tus observaciones clínicas en tiempo real... (Usa Ctrl+M para insertar marcas de tiempo)"
          className="flex-1 w-full bg-gray-50 dark:bg-white/2 rounded-[24px] md:rounded-[32px] p-5 md:p-7 outline-none border border-transparent focus-visible:border-[#008080]/40 focus-visible:ring-4 focus-visible:ring-[#008080]/10 transition-all dark:text-white resize-none text-sm md:text-base leading-relaxed custom-scrollbar shadow-inner"
        />
        <div className="absolute bottom-3 right-4 pointer-events-none text-[10px] text-gray-400 dark:text-gray-500 font-mono">
          {notes.length} caracteres
        </div>
      </div>
    </motion.div>
  );
}
