"use client";

import React from "react";
import {motion} from "motion/react";
import {Search, BarChart3, PenTool, Trash2, Music, Video} from "lucide-react";
import {Pagination} from "@/shared/ui/Pagination";

interface SessionHistoryProps {
    patientSessions: any[];
    onViewAIAnalysis: (sessionId: number, mode: "list" | "charts") => void;
    onEditSession: (session: any) => void;
    onDeleteSession: (sessionId: number) => void;
    currentPage: number;
    totalPages: number;
    cicloNumber: number;
    onPageChange: (page: number) => void;
}

export function HistorialSesiones({
                                      patientSessions,
                                      onViewAIAnalysis,
                                      onEditSession,
                                      onDeleteSession,
                                      currentPage,
                                      totalPages,
                                      cicloNumber,
                                      onPageChange,
                                  }: SessionHistoryProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white serif">
                Historial de <span className="text-[#008080]">Sesiones</span>
            </h2>
            <div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gray-300/80 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 font-serif tracking-tight">
                        Ciclo # <span className="text-[#008080] font-bold">{cicloNumber}</span>
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Navegación en orden inverso
                        activo</p>
                </div>

                {/* Ajustamos el mt-8 original de la paginación a mt-0 mediante un contenedor */}
                <div className="[&>div]:mt-0">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        reverse={true}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
            <div className="grid gap-8">
                {patientSessions.length > 0 ? (
                    patientSessions.map((session, idx) => (
                        <motion.div
                            key={session.databaseId}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: idx * 0.1}}
                            className="bg-white dark:bg-[#111] p-10 rounded-[48px] border border-gray-200 dark:border-white/5 shadow-xl shadow-black/5 relative overflow-hidden group">
                            <div
                                className="absolute top-0 right-0 w-64 h-64 bg-[#008080]/2 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110"/>
                            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10 relative">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span
                                            className="text-[10px] font-bold text-[#008080] uppercase tracking-[0.2em] bg-[#008080]/10 px-4 py-1.5 rounded-full">
                                          Sesión #{session.sessionNumber}
                                        </span>
                                        <span
                                            className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                          {session.sessionDate}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-bold dark:text-white serif leading-tight">
                                        Sesión de{" "}
                                        <span className="text-[#008080]">Musicoterapia</span>
                                    </h3>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onViewAIAnalysis(session.id, "list")}
                                        className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                                        title="Ver Análisis de IA"
                                    >
                                        <Search size={18}/>
                                        <span>Análisis DEMUCA</span>
                                    </button>
                                    <button
                                        onClick={() => onViewAIAnalysis(session.id, "charts")}
                                        className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                                        title="Ver Gráficos de IA"
                                    >
                                        <BarChart3 size={18}/>
                                        <span>Gráficos</span>
                                    </button>
                                    <button
                                        onClick={() => onEditSession(session)}
                                        className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-400 hover:text-[#008080] transition-all"
                                        title="Editar Notas"
                                    >
                                        <PenTool size={20}/>
                                    </button>
                                    <button
                                        onClick={() => onDeleteSession(session.id)}
                                        className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-400 hover:text-red-500 transition-all"
                                        title="Eliminar Sesión"
                                    >
                                        <Trash2 size={20}/>
                                    </button>
                                </div>
                            </div>

                            <div
                                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10 p-8 bg-gray-50/50 dark:bg-white/2 rounded-[32px] border border-gray-100 dark:border-white/5 relative">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                                        Duración
                                    </p>
                                    <p className="text-base dark:text-white font-bold">
                                        {session?.durationMinutes ?? '40 min'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                                        Terapeuta
                                    </p>
                                    <p className="text-base dark:text-white font-bold">
                                        {session.therapist?.fullname ?? "No Asignado"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                                        Estado
                                    </p>
                                    <p className="text-base dark:text-white font-bold">
                                        {session.sessionStatus}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                                        Pago
                                    </p>
                                    <p className="text-base dark:text-white font-bold">
                                        {session.paymentStatusDisplay}
                                    </p>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-12 relative">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-[#008080] rounded-full"/>
                                        <h4 className="text-xs font-bold dark:text-white uppercase tracking-[0.2em]">
                                            Notas de la Sesión
                                        </h4>
                                    </div>
                                    <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                        {session.notes ||
                                            "No hay notas registradas para esta sesión."}
                                    </p>
                                </div>

                                {session.videoUrl && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-[#008080] rounded-full"/>
                                            <h4 className="text-xs font-bold dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                                {session.videoUrl.includes(".mp4") ? (
                                                    <Video size={14}/>
                                                ) : (
                                                    <Music size={14}/>
                                                )}
                                                Grabación
                                            </h4>
                                        </div>
                                        <div
                                            className="bg-black/5 dark:bg-white/2 p-4 rounded-[24px] border border-gray-200 dark:border-white/5">
                                            {session.videoUrl.includes(".mp4  ") ? (
                                                <audio controls className="w-full accent-[#008080]">
                                                    <source src={session.videoUrl} type="audio/mpeg"/>
                                                </audio>
                                            ) : (
                                                <video
                                                    controls
                                                    className="w-full rounded-xl shadow-lg bg-black aspect-video"
                                                >
                                                    <source src={session.videoUrl} type="video/webm"/>
                                                </video>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div
                        className="text-center py-20 bg-gray-50 dark:bg-white/2 rounded-[48px] border border-dashed border-gray-200 dark:border-white/10">
                        <p className="text-gray-400 italic">
                            No se encontraron sesiones registradas para este paciente.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
