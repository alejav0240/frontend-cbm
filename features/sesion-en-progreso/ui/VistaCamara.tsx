"use client";

import React from "react";
import { motion } from "motion/react";
import { Video } from "lucide-react";

interface CameraPreviewProps {
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isRecording: boolean;
  videoDevices: MediaDeviceInfo[];
  selectedDeviceId: string;
  switchCamera: (deviceId: string) => void;
  startRecording: () => void;
}

export function VistaCamara({
  stream,
  videoRef,
  isRecording,
  videoDevices = [],
  selectedDeviceId = "",
  switchCamera = () => {},
  startRecording = () => {},
}: CameraPreviewProps) {
  return (
    <div className="w-full border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-white/5 p-4 md:p-8 space-y-8 bg-gray-50/30 dark:bg-white/1">
      <div className="bg-white dark:bg-[#111] p-5 md:p-8 rounded-[32px] md:rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden relative">
        <div className="flex items-center justify-between mb-4 md:mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <Video
              size={18}
              className={`md:w-5 md:h-5 ${isRecording ? "text-red-500" : "text-[#008080]"}`}
            />
            <h3 className="font-bold dark:text-white uppercase tracking-widest text-[10px] md:text-xs">
              Vista de Cámara
            </h3>
          </div>
          {videoDevices.length > 1 && (
            <select
              value={selectedDeviceId}
              onChange={(e) => switchCamera(e.target.value)}
              className="bg-gray-100 dark:bg-white/5 text-[8px] md:text-[10px] font-bold uppercase tracking-widest px-2 md:px-3 py-1 md:py-1.5 rounded-full outline-none border-none cursor-pointer hover:bg-[#008080] hover:text-white transition-all"
            >
              {videoDevices.map((device, idx) => (
                <option key={device.deviceId} value={device.deviceId}>
                  Cámara {idx + 1}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="aspect-video bg-gray-900 rounded-2xl md:rounded-3xl overflow-hidden relative group">
          {!stream && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-3 md:gap-4 p-4 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 flex items-center justify-center">
                <Video size={24} className="md:w-8 md:h-8" />
              </div>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
                Cámara Desactivada
              </p>
              <button
                onClick={() => startRecording()}
                className="px-4 md:px-6 py-2 bg-[#008080] text-white rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
              >
                Activar Cámara
              </button>
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-500 ${stream ? "opacity-100" : "opacity-0"}`}
          />
          {isRecording && (
            <div className="absolute top-3 md:top-4 left-3 md:left-4 flex items-center gap-1.5 md:gap-2 bg-black/40 backdrop-blur-md px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-white/10">
              <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-widest">
                REC
              </span>
            </div>
          )}
        </div>

        {isRecording && (
          <div className="mt-4 md:mt-6 flex items-center gap-1 md:gap-1.5 h-4 md:h-6 justify-center">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [1, 2.5, 1.5, 3, 1] }}
                transition={{ repeat: Infinity, duration: 0.3 + i * 0.03 }}
                className="w-0.5 md:w-1 bg-red-500/60 rounded-full h-1.5 md:h-2"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
