"use client";

import React from "react";
import { Modal } from "@/shared/ui/components/Modal";
import { Music, Video, FileText, PenTool, Download, Mail } from "lucide-react";

interface SessionDetailsModalProps {
  session: any;
  isOpen: boolean;
  onClose: () => void;
  isEditingNotes: boolean;
  setIsEditingNotes: (editing: boolean) => void;
  editedNotes: string;
  setEditedNotes: (notes: string) => void;
  onSaveNotes: () => void;
  onExportSession: (session: any) => void;
  onSendReminder: (session: any) => void;
}

export function SessionDetailsModal({
  session,
  isOpen,
  onClose,
  isEditingNotes,
  setIsEditingNotes,
  editedNotes,
  setEditedNotes,
  onSaveNotes,
  onExportSession,
  onSendReminder,
}: SessionDetailsModalProps) {
  if (!session) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalles de Sesión #${session.sessionNum}`}
    >
      <div className="space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-gray-50 dark:bg-white/2 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Paciente
            </p>
            <p className="text-sm md:text-base font-bold dark:text-white">
              {session.patientName}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-white/2 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Terapeuta
            </p>
            <p className="text-sm md:text-base font-bold dark:text-white">
              {session.therapist}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-white/2 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Fecha
            </p>
            <p className="text-sm md:text-base font-bold dark:text-white">
              {session.date}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-white/2 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Duración
            </p>
            <p className="text-sm md:text-base font-bold dark:text-white">
              {session.duration}
            </p>
          </div>
        </div>

        {session.recordingUrl && (
          <div className="bg-black/5 dark:bg-white/2 p-4 md:p-6 rounded-[32px] border border-gray-200 dark:border-white/5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#008080]/10 flex items-center justify-center text-[#008080]">
                  {session.recordingUrl?.includes(".mp3") ? (
                    <Music size={16} />
                  ) : (
                    <Video size={16} />
                  )}
                </div>
                <h3 className="font-bold dark:text-white uppercase tracking-widest text-[10px] md:text-xs">
                  Grabación de la Sesión
                </h3>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">
                {session.recordingUrl?.includes(".mp3")
                  ? "Audio MP3"
                  : "Video WEBM"}
              </span>
            </div>

            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5 group">
              {session.recordingUrl?.includes(".mp3") ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#008080]/20 to-black/40">
                  <Music
                    size={64}
                    className="text-[#008080] opacity-20 animate-pulse"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <audio controls className="w-full accent-[#008080]">
                      <source src={session.recordingUrl} type="audio/mpeg" />
                      Tu navegador no soporta el elemento de audio.
                    </audio>
                  </div>
                </div>
              ) : (
                <video controls className="w-full h-full object-contain">
                  <source src={session.recordingUrl} type="video/webm" />
                  Tu navegador no soporta el elemento de video.
                </video>
              )}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-[#008080]" />
              <h3 className="font-bold dark:text-white uppercase tracking-widest text-[10px] md:text-xs">
                Notas Clínicas
              </h3>
            </div>
            {!isEditingNotes ? (
              <button
                onClick={() => {
                  setEditedNotes(session.notes || "");
                  setIsEditingNotes(true);
                }}
                className="flex items-center gap-1 text-[10px] font-bold text-[#008080] hover:text-[#006666] uppercase tracking-widest transition-colors"
              >
                <PenTool size={14} />
                Editar
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditingNotes(false)}
                  className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={onSaveNotes}
                  className="text-[10px] font-bold text-[#008080] hover:text-[#006666] uppercase tracking-widest transition-colors"
                >
                  Guardar
                </button>
              </div>
            )}
          </div>
          {isEditingNotes ? (
            <textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white resize-none"
              placeholder="Escribe las observaciones clínicas aquí..."
            />
          ) : (
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed italic">
              {session.notes || "No hay notas registradas para esta sesión."}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button
            onClick={() => onExportSession(session)}
            className="w-full sm:w-auto bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 px-8 py-3 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Exportar PDF
          </button>
          {session.status !== "Completada" && (
            <button
              onClick={() => onSendReminder(session)}
              className="w-full sm:w-auto bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Mail size={18} />
              Enviar Recordatorio
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
