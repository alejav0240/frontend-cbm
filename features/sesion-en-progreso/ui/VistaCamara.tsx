"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sparkles,
  Camera,
  Activity,
  SlidersHorizontal,
  Volume2,
  ShieldCheck,
} from "lucide-react";

interface CameraPreviewProps {
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isRecording: boolean;
  videoDevices?: MediaDeviceInfo[];
  selectedDeviceId?: string;
  switchCamera?: (deviceId: string) => void;
  startRecording?: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function VistaCamara({
  stream,
  videoRef,
  isRecording,
  videoDevices = [],
  selectedDeviceId = "",
  switchCamera = () => {},
  startRecording = () => {},
  onClose,
  isMobile = false,
}: CameraPreviewProps) {
  const [espejo, setEspejo] = useState(true);
  const [mostrarAjustes, setMostrarAjustes] = useState(false);
  const [esPiPActivo, setEsPiPActivo] = useState(false);
  const [nivelAudio, setNivelAudio] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Vincular stream al elemento de video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream ?? null;
    }
  }, [stream, videoRef]);

  // Medidor de decibelios / audio en tiempo real del stream
  useEffect(() => {
    if (!stream) {
      const id = requestAnimationFrame(() => setNivelAudio(0));
      return () => cancelAnimationFrame(id);
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateMeter = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setNivelAudio(normalized);
        animFrameRef.current = requestAnimationFrame(updateMeter);
      };

      animFrameRef.current = requestAnimationFrame(updateMeter);
    } catch (err) {
      console.warn("Audio meter no disponible:", err);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        void audioContextRef.current.close();
      }
    };
  }, [stream]);

  // Picture-in-Picture nativo
  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setEsPiPActivo(false);
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
        setEsPiPActivo(true);
      }
    } catch (e) {
      console.error("Error al activar Picture-in-Picture:", e);
    }
  }, [videoRef]);

  // Escuchar salida de PiP
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLeavePiP = () => setEsPiPActivo(false);
    video.addEventListener("leavepictureinpicture", onLeavePiP);
    return () => video.removeEventListener("leavepictureinpicture", onLeavePiP);
  }, [videoRef]);

  return (
    <div className={`w-full h-full flex flex-col ${isMobile ? "p-2 sm:p-3" : "p-3 sm:p-5 lg:p-6"}`}>
      {/* Marco estilizado de alta gama */}
      <div className="relative flex-1 w-full h-full rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-white/10 shadow-2xl shadow-black/40 flex flex-col">
        
        {/* Glow sutil en esquinas cuando está grabando */}
        {isRecording && (
          <div className="absolute inset-0 pointer-events-none z-10 ring-1 ring-inset ring-red-500/30 rounded-2xl sm:rounded-3xl lg:rounded-[32px] transition-all" />
        )}

        {/* HUD SUPERIOR: Título, estado, selector de cámara y acciones */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent backdrop-blur-[2px]">
          {/* Tag clínico y estado */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/10 dark:bg-zinc-800/80 backdrop-blur-md border border-white/15 text-teal-400 shadow-sm">
              <Camera size={15} className="sm:w-4 sm:h-4" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white drop-shadow-sm">
                  Cámara Clínica
                </span>
                {isRecording ? (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[9px] font-black tracking-widest uppercase animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm shadow-red-500" />
                    REC
                  </span>
                ) : stream ? (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold tracking-wider uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    En vivo
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-zinc-800/80 border border-white/5 text-zinc-400 text-[9px] font-bold tracking-wider uppercase">
                    Inactiva
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Controles de HUD superior */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Medidor de audio en vivo */}
            {stream && (
              <div
                className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md"
                title={`Nivel de Micrófono: ${nivelAudio}%`}
              >
                <Volume2 size={12} className={nivelAudio > 10 ? "text-teal-400" : "text-zinc-500"} />
                <div className="w-10 sm:w-14 h-1.5 bg-white/10 rounded-full overflow-hidden flex items-center p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-75 ${
                      nivelAudio > 70
                        ? "bg-red-400"
                        : nivelAudio > 30
                          ? "bg-teal-400"
                          : "bg-emerald-400"
                    }`}
                    style={{ width: `${Math.max(4, nivelAudio)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Selector de cámara si hay más de 1 */}
            {videoDevices.length > 1 && (
              <div className="relative">
                <select
                  value={selectedDeviceId}
                  onChange={(e) => switchCamera(e.target.value)}
                  className="bg-black/60 hover:bg-black/80 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-md outline-none cursor-pointer transition-all"
                  aria-label="Cambiar dispositivo de video"
                >
                  {videoDevices.map((device, idx) => (
                    <option key={device.deviceId} value={device.deviceId} className="bg-zinc-900 text-white">
                      Cámara {idx + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Toggle Espejo */}
            {stream && (
              <button
                type="button"
                onClick={() => setEspejo(!espejo)}
                className={`p-1.5 sm:p-2 rounded-xl border transition-all ${
                  espejo
                    ? "bg-teal-500/20 border-teal-500/40 text-teal-300"
                    : "bg-black/50 border-white/10 text-zinc-300 hover:text-white"
                } backdrop-blur-md`}
                title={espejo ? "Modo Espejo Activado" : "Modo Espejo Desactivado"}
                aria-label="Alternar modo espejo"
              >
                <RefreshCw size={14} className={espejo ? "rotate-180 transition-transform" : "transition-transform"} />
              </button>
            )}

            {/* Picture-in-Picture */}
            {stream && typeof document !== "undefined" && document.pictureInPictureEnabled && (
              <button
                type="button"
                onClick={togglePiP}
                className={`p-1.5 sm:p-2 rounded-xl border transition-all ${
                  esPiPActivo
                    ? "bg-teal-500/20 border-teal-500/40 text-teal-300"
                    : "bg-black/50 border-white/10 text-zinc-300 hover:text-white"
                } backdrop-blur-md`}
                title={esPiPActivo ? "Salir de Ventana Flotante (PiP)" : "Ventana Flotante (PiP)"}
                aria-label="Alternar Picture in Picture"
              >
                {esPiPActivo ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            )}

            {/* Botón cerrar/colapsar si se provee */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl bg-black/50 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 backdrop-blur-md transition-all ml-1"
                aria-label="Ocultar cámara"
              >
                <Minimize2 size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ÁREA DE VIDEO PRINCIPAL */}
        <div className="relative flex-1 w-full h-full min-h-[200px] flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
          {/* Mirilla / Guías de encuadre estéticas estilo visor médico */}
          <div className="absolute inset-4 sm:inset-6 pointer-events-none z-10">
            {/* Esquinas del visor */}
            <div className="absolute top-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-white/20 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-white/20 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-white/20 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-white/20 rounded-br-lg" />
          </div>

          {/* Grilla sutil de fondo cuando está vacía */}
          {!stream && (
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
          )}

          {/* Video element */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover transition-all duration-700 ${
              stream ? "opacity-100 scale-100" : "opacity-0 scale-95"
            } ${espejo ? "-scale-x-100" : ""}`}
          />

          {/* Estado inactivo o sin cámara */}
          {!stream && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="relative mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-zinc-400 shadow-xl shadow-black/50">
                  <VideoOff size={28} className="sm:w-8 sm:h-8 text-teal-400/80" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-zinc-900 border border-white/15 flex items-center justify-center text-zinc-400">
                  <ShieldCheck size={12} className="text-teal-400" />
                </div>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-white tracking-wide mb-1">
                Transmisión Segura Desconectada
              </h4>
              <p className="text-xs text-zinc-400 max-w-xs mb-6 leading-relaxed">
                Inicia la cámara del dispositivo para observar la sesión y grabar la interacción clínica.
              </p>

              <button
                type="button"
                onClick={() => startRecording()}
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#008080] to-teal-500 hover:from-[#006666] hover:to-teal-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-teal-900/40 active:scale-95 transition-all flex items-center gap-2"
              >
                <Camera size={15} />
                <span>Activar Cámara</span>
              </button>
            </div>
          )}
        </div>

        {/* FOOTER INFERIOR DE ESTADO Y ONDA DE GRABACIÓN */}
        <div className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-between px-3 sm:px-4 py-2.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent backdrop-blur-[2px]">
          {/* Badge de seguridad / resolución */}
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono font-medium">
            <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              HD 720p
            </span>
            {stream && (
              <span className="hidden sm:inline text-zinc-500 text-[10px]">
                WebM • Audio Enlazado
              </span>
            )}
          </div>

          {/* Animación visualizador de sonido / grabación */}
          {isRecording ? (
            <div className="flex items-center gap-1 sm:gap-1.5 h-4 bg-black/40 px-2.5 py-1 rounded-full border border-red-500/20">
              <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest mr-1">
                Grabando
              </span>
              {[...Array(9)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [0.6, 2.2, 1, 2.8, 0.6] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.45 + (i % 4) * 0.08,
                    ease: "easeInOut",
                  }}
                  className="w-0.5 sm:w-1 bg-gradient-to-t from-red-500 to-rose-400 rounded-full h-2 origin-bottom"
                />
              ))}
            </div>
          ) : stream ? (
            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
              <Activity size={12} className="text-teal-400 animate-pulse" />
              <span className="font-mono text-[10px] text-zinc-300">Feed en tiempo real</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

