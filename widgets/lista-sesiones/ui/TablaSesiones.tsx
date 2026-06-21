"use client";

import React from "react";
import { motion } from "motion/react";
import { History, Play, CheckCircle, XCircle, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { SesionNormalizada, useSesionActivaStore } from "@/entities/sesion";

interface TablaSesionesProps {
  sesiones: SesionNormalizada[];
  alVerDetalles: (sesion: SesionNormalizada) => void;
}

export const TablaSesiones = ({
  sesiones,
  alVerDetalles,
}: TablaSesionesProps) => {
  const { setSesion } = useSesionActivaStore();
  const router = useRouter();

  const manejarInicioSesion = (sesion: SesionNormalizada) => {
    setSesion({
      id: sesion.id,
      pacienteId: sesion.pacienteId || "",
      pacienteNombre: sesion.pacienteNombre,
      inicio: new Date(),
    });
    router.push("/dashboard/sesion-en-progreso");
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Sesión
            </th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Paciente
            </th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Terapeuta
            </th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Estado
            </th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Pago
            </th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
          {sesiones.map((sesion, idx) => (
            <motion.tr
              key={sesion.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="hover:bg-gray-50/80 dark:hover:bg-white/2 transition-colors group"
            >
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#008080]/10 flex items-center justify-center text-[#008080]">
                    <History size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold dark:text-white">
                      Sesión #{sesion.numeroSesion}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {sesion.fecha} - {sesion.hora}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5 text-sm text-gray-600 dark:text-gray-400 font-medium">
                {sesion.pacienteNombre}
              </td>
              <td className="px-8 py-5 text-sm text-gray-600 dark:text-gray-400 font-medium">
                {sesion.terapeuta}
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-2">
                  {sesion.estado === "completed" ? (
                    <CheckCircle size={14} className="text-green-500" />
                  ) : sesion.estado === "pending" ? (
                    <History size={14} className="text-amber-500" />
                  ) : (
                    <XCircle size={14} className="text-red-500" />
                  )}
                  <span className="text-sm dark:text-gray-300">
                    {sesion.estadoMostrado}
                  </span>
                </div>
              </td>
              <td className="px-8 py-5">
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    sesion.pago === "PAID"
                      ? "bg-green-100 text-green-600 dark:bg-green-500/10"
                      : "bg-amber-100 text-amber-600 dark:bg-amber-500/10"
                  }`}
                >
                  {sesion.pagoMostrado}
                </span>
              </td>
              <td className="px-8 py-5">
                <div className="flex gap-2">
                  <button
                    onClick={() => alVerDetalles(sesion)}
                    className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-[#008080] transition-all"
                  >
                    <FileText size={18} />
                  </button>
                  {sesion.estado === "pending" && (
                    <button
                      onClick={() => manejarInicioSesion(sesion)}
                      className="p-2.5 bg-[#008080]/10 rounded-xl text-[#008080] hover:bg-[#008080] hover:text-white transition-all"
                    >
                      <Play size={18} />
                    </button>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
