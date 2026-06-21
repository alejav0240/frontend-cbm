"use client";

import React from "react";
import { Camera, RefreshCw, StopCircle, Play } from "lucide-react";

interface VistaCamaraProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  estaGrabando: boolean;
  dispositivos: MediaDeviceInfo[];
  dispositivoSeleccionado: string;
  alCambiarCamara: (id: string) => void;
  alAlternarGrabacion: () => void;
}

export const VistaCamara = ({
  videoRef,
  estaGrabando,
  dispositivos,
  dispositivoSeleccionado,
  alCambiarCamara,
  alAlternarGrabacion,
}: VistaCamaraProps) => {
  return (
    <div className="w-full lg:w-96 bg-gray-900 flex flex-col relative">
      <div className="flex-1 relative min-h-[300px]">
        <video
          ref={videoRef as any}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {estaGrabando && (
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-full animate-pulse shadow-lg">
            <div className="w-2 h-2 rounded-full bg-white" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">
              REC
            </span>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-900 border-t border-white/5 space-y-4">
        <select
          value={dispositivoSeleccionado}
          onChange={(e) => alCambiarCamara(e.target.value)}
          className="w-full bg-white/10 text-white text-xs font-bold py-3 px-4 rounded-xl outline-none border border-transparent focus:border-[#008080]"
        >
          {dispositivos.map((d) => (
            <option key={d.deviceId} value={d.deviceId} className="bg-gray-900">
              {d.label || `Cámara ${d.deviceId.slice(0, 5)}`}
            </option>
          ))}
        </select>

        <button
          onClick={alAlternarGrabacion}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
            estaGrabando
              ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
              : "bg-[#008080] text-white shadow-lg shadow-[#008080]/20"
          }`}
        >
          {estaGrabando ? (
            <>
              <StopCircle size={18} /> Detener Grabación
            </>
          ) : (
            <>
              <Play size={18} /> Iniciar Grabación
            </>
          )}
        </button>
      </div>
    </div>
  );
};
