"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Clock,
  Video,
  Pause,
  Play,
  Square,
  Mic,
  MicOff,
  User,
  Calendar,
  Users,
  ChevronDown,
  MoreVertical,
} from "lucide-react";

interface SessionHeaderProps {
  activeSession: any;
  timer: number;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  isRecording: boolean;
  toggleRecording: () => void;
  setShowFinishConfirm: (show: boolean) => void;
  formatTime: (seconds: number) => string;
  duracionSesion?: number;
  tiempoRestante?: number;
}

export function SessionHeader({
  activeSession,
  timer,
  isActive,
  setIsActive,
  isRecording,
  toggleRecording,
  setShowFinishConfirm,
  formatTime,
  duracionSesion,
  tiempoRestante,
}: SessionHeaderProps) {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isHoveringRecording, setIsHoveringRecording] = useState(false);
  const moreOptionsRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreOptionsRef.current &&
        !moreOptionsRef.current.contains(event.target as Node)
      ) {
        setShowMoreOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!activeSession) return null;

  // Helper para colores dinámicos
  const getInitialColor = (name: string) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
      "from-teal-500 to-teal-600",
      "from-rose-500 to-rose-600",
      "from-amber-500 to-amber-600",
      "from-emerald-500 to-emerald-600",
    ];
    const code = name ? name.charCodeAt(0) : 0;
    const index = Number.isNaN(code) ? 0 : code % colors.length;
    return colors[index];
  };

  // Estado de la sesión para mostrar indicadores
  const sessionStatus = {
    isLive: true,
    duration: formatTime(timer),
    isPaused: !isActive,
    isRecording: isRecording,
  };

  return (
    <header
      className="relative bg-white dark:bg-accent border-b border-gray-200 dark:border-white/5 sticky top-0 z-50 shadow-sm backdrop-blur-xl bg-white/80 dark:bg-[#0f0f0f]/80"
      role="banner"
      aria-label="Cabecera de sesión activa"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 py-3 lg:py-4">
          {/* Sección Izquierda - Información del Paciente */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            {/* Avatar con inicial y estado */}
            <div className="relative flex-shrink-0 group">
              <div
                className={`
                w-12 h-12 sm:w-14 sm:h-14 rounded-2xl 
                bg-gradient-to-br ${getInitialColor(activeSession.patientName)}
                text-white flex items-center justify-center 
                font-bold text-lg sm:text-xl
                shadow-lg transition-transform duration-200
                group-hover:scale-105
              `}
              >
                {activeSession.patientName?.charAt(0) || "?"}
              </div>
              {/* Indicador de estado en vivo */}
              <div className="absolute -bottom-1 -right-1">
                <div className="relative">
                  <span className="block w-4 h-4 sm:w-5 sm:h-5 bg-green-500 border-2 border-white dark:border-[#0f0f0f] rounded-full shadow-sm" />
                  <span className="absolute inset-0 block w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full animate-ping opacity-75" />
                </div>
              </div>
            </div>

            {/* Información del paciente */}
            <div className="min-w-0 flex-1 lg:flex-none">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold dark:text-white truncate">
                  {activeSession.patientName}
                </h2>
                {/* Badge de sesión en vivo */}
                <div className="flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-full flex-shrink-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                    En Vivo
                  </span>
                </div>
              </div>

              {/* Meta información */}
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar size={12} className="flex-shrink-0" />
                  <span>Sesión #{activeSession.sessionNum}</span>
                </span>
                <span className="hidden xs:flex items-center gap-1">
                  <User size={12} className="flex-shrink-0" />
                  <span>{activeSession.therapist}</span>
                </span>
                {activeSession.sessionType && (
                  <span className="hidden sm:flex items-center gap-1">
                    <Users size={12} className="flex-shrink-0" />
                    <span>{activeSession.sessionType}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sección Derecha - Controles */}
          <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-4 w-full lg:w-auto">
            {/* Timer */}
            <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-xl">
              <div className="flex items-center gap-1.5">
                <Clock
                  size={16}
                  className="text-[#008080] dark:text-teal-400"
                />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">
                  Duración
                </span>
              </div>
              <span
                className={`
                text-xl sm:text-2xl lg:text-3xl font-mono font-bold tabular-nums
                ${!isActive ? "text-gray-400 dark:text-gray-500" : "dark:text-white"}
                transition-colors duration-200
              `}
              >
                {formatTime(timer)}
              </span>
              {!isActive && (
                <span className="text-[10px] font-medium text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                  Pausado
                </span>
              )}
            </div>

            {/* Separador */}
            <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden sm:block" />

            {/* Botones de acción */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Botón Grabar */}
              <button
                onClick={toggleRecording}
                onMouseEnter={() => setIsHoveringRecording(true)}
                onMouseLeave={() => setIsHoveringRecording(false)}
                className={`
                  relative p-2.5 sm:p-3 rounded-xl transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0f0f0f]
                  ${
                    isRecording
                      ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg shadow-red-500/25"
                      : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 focus:ring-[#008080]"
                  }
                `}
                aria-label={
                  isRecording ? "Detener grabación" : "Iniciar grabación"
                }
                title={isRecording ? "Detener Grabación" : "Iniciar Grabación"}
              >
                {isRecording ? (
                  <>
                    <Mic className="w-5 h-5 sm:w-5 sm:h-5" />
                    {isHoveringRecording && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-gray-900 text-white px-2 py-0.5 rounded whitespace-nowrap">
                        Detener
                      </span>
                    )}
                  </>
                ) : (
                  <MicOff className="w-5 h-5 sm:w-5 sm:h-5" />
                )}
              </button>

              {/* Botón Pausa/Reanudar */}
              <button
                onClick={() => setIsActive(!isActive)}
                className={`
                  p-2.5 sm:p-3 rounded-xl transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0f0f0f]
                  ${
                    isActive
                      ? "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 focus:ring-orange-500"
                      : "bg-green-500/10 text-green-500 hover:bg-green-500/20 focus:ring-green-500"
                  }
                `}
                aria-label={isActive ? "Pausar sesión" : "Reanudar sesión"}
                title={isActive ? "Pausar" : "Reanudar"}
              >
                {isActive ? (
                  <Pause className="w-5 h-5 sm:w-5 sm:h-5" />
                ) : (
                  <Play className="w-5 h-5 sm:w-5 sm:h-5" />
                )}
              </button>

              {/* Botón Finalizar - Principal */}
              <button
                onClick={() => setShowFinishConfirm(true)}
                className="
                  px-4 sm:px-6 py-2.5 sm:py-3
                  bg-red-500 hover:bg-red-600 active:scale-95
                  text-white font-bold rounded-xl
                  transition-all duration-200
                  shadow-lg shadow-red-500/30 hover:shadow-red-500/40
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0f0f0f]
                  flex items-center gap-2
                "
                aria-label="Finalizar sesión"
              >
                <Square
                  size={16}
                  fill="currentColor"
                  className="flex-shrink-0"
                />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                  <span className="hidden sm:inline">Finalizar</span>
                  <span className="sm:hidden">Fin</span>
                </span>
              </button>

              {/* Menú de opciones adicionales */}
              <div className="relative" ref={moreOptionsRef}>
                <button
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                  className="
                    p-2 rounded-xl
                    text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-white/10
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2
                  "
                  aria-label="Más opciones"
                  aria-expanded={showMoreOptions}
                >
                  <MoreVertical size={20} />
                </button>

                {/* Dropdown de opciones */}
                {showMoreOptions && (
                  <div
                    className="
                    absolute right-0 top-full mt-2
                    w-48 bg-white dark:bg-[#1a1a1a]
                    rounded-xl shadow-xl
                    border border-gray-100 dark:border-white/10
                    py-1 overflow-hidden
                    animate-in slide-in-from-top-2 duration-150
                  "
                  >
                    <button
                      className="
                      w-full px-4 py-2.5 text-left text-sm
                      hover:bg-gray-50 dark:hover:bg-white/5
                      flex items-center gap-3
                      transition-colors duration-150
                    "
                    >
                      <Video size={16} className="text-gray-400" />
                      <span>Ver grabación</span>
                    </button>
                    <button
                      className="
                      w-full px-4 py-2.5 text-left text-sm
                      hover:bg-gray-50 dark:hover:bg-white/5
                      flex items-center gap-3
                      transition-colors duration-150
                    "
                    >
                      <Clock size={16} className="text-gray-400" />
                      <span>Añadir nota de tiempo</span>
                    </button>
                    <div className="border-t border-gray-100 dark:border-white/5 my-1" />
                    <button
                      className="
                      w-full px-4 py-2.5 text-left text-sm text-red-500
                      hover:bg-red-50 dark:hover:bg-red-500/10
                      flex items-center gap-3
                      transition-colors duration-150
                    "
                    >
                      <Square size={16} className="text-red-500" />
                      <span>Finalizar y salir</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progreso de sesión */}
      {duracionSesion && duracionSesion > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200 dark:bg-white/5">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              tiempoRestante != null && tiempoRestante <= 120
                ? "bg-red-500"
                : "bg-gradient-to-r from-[#008080] to-teal-400"
            }`}
            style={{ width: `${Math.min((timer / (duracionSesion * 60)) * 100, 100)}%` }}
          />
        </div>
      )}
    </header>
  );
}
