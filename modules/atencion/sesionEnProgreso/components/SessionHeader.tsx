'use client';

import React from 'react';
import { Clock, Video, Pause, Play, Square } from 'lucide-react';

interface SessionHeaderProps {
    activeSession: any;
    timer: number;
    isActive: boolean;
    setIsActive: (active: boolean) => void;
    isRecording: boolean;
    toggleRecording: () => void;
    setShowFinishConfirm: (show: boolean) => void;
    formatTime: (seconds: number) => string;
}

export function SessionHeader({
                                  activeSession,
                                  timer,
                                  isActive,
                                  setIsActive,
                                  isRecording,
                                  toggleRecording,
                                  setShowFinishConfirm,
                                  formatTime
                              }: SessionHeaderProps) {
    if (!activeSession) return null;

    return (
        <header className="min-h-[6rem] md:h-24 border-b border-gray-200 dark:border-white/5 px-4 md:px-10 py-4 md:py-0 flex flex-col md:flex-row justify-between items-center bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-2xl sticky top-0 z-50 gap-4 md:gap-0">
            <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
                <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#008080] to-[#006666] text-white flex items-center justify-center font-bold text-lg md:text-xl shadow-xl shadow-[#008080]/30 relative z-10">
                        {activeSession.patientName?.charAt(0) || '?'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-green-500 border-2 md:border-4 border-white dark:border-[#0a0a0a] rounded-full z-20" />
                </div>
                <div className="min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold dark:text-white serif tracking-tight truncate">{activeSession.patientName}</h2>
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="flex items-center gap-1.5 bg-red-500/10 px-2 py-0.5 rounded-md flex-shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[8px] md:text-[9px] font-black text-red-500 uppercase tracking-widest">En Vivo</span>
                        </div>
                        <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] md:tracking-[0.2em] truncate">Sesión #{activeSession.sessionNum} • {activeSession.therapist}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 md:gap-12 w-full md:w-auto">
                <div className="flex flex-col items-start md:items-end">
                    <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5 md:mb-1">Cronómetro</span>
                    <div className="flex items-center gap-2 md:gap-3">
                        <Clock size={16} className="text-[#008080] md:hidden" />
                        <Clock size={20} className="text-[#008080] hidden md:block" />
                        <span className="text-2xl md:text-4xl font-mono font-bold dark:text-white tabular-nums tracking-tighter">{formatTime(timer)}</span>
                    </div>
                </div>

                <div className="h-10 md:h-12 w-px bg-gray-200 dark:bg-white/10 hidden sm:block" />

                <div className="flex gap-2 md:gap-4">
                    <button
                        onClick={toggleRecording}
                        className={`p-3 md:p-5 rounded-xl md:rounded-[20px] transition-all shadow-lg flex items-center gap-2 md:gap-3 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-[#008080]/10 text-[#008080] hover:bg-[#008080]/20'}`}
                        title={isRecording ? "Detener Grabación" : "Iniciar Grabación"}
                    >
                        <Video size={20} className={`md:w-6 md:h-6 ${isRecording ? "animate-pulse" : ""}`} />
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest hidden lg:block">
              {isRecording ? 'Grabando...' : 'Grabar'}
            </span>
                    </button>
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`p-3 md:p-5 rounded-xl md:rounded-[20px] transition-all shadow-lg ${isActive ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
                        title={isActive ? "Pausar" : "Reanudar"}
                    >
                        {isActive ? <Pause size={20} className="md:w-6 md:h-6" /> : <Play size={20} className="md:w-6 md:h-6" />}
                    </button>
                    <button
                        onClick={() => setShowFinishConfirm(true)}
                        className="bg-red-500 text-white px-4 md:px-10 py-3 md:py-5 rounded-xl md:rounded-[20px] font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-red-600 transition-all flex items-center gap-2 md:gap-3 shadow-2xl shadow-red-500/30"
                    >
                        <Square size={14} className="md:w-[18px] md:h-[18px]" fill="currentColor" />
                        <span className="hidden sm:inline">Finalizar</span>
                        <span className="sm:hidden">Fin</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
