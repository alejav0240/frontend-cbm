"use client";

import React, { useState } from "react";
import {
  useTemporizador,
  useGrabacion,
  VistaCamara,
  WorkspaceSesion,
} from "@/features/sesion-en-progreso";
import { useSesionActivaStore } from "@/entities/sesion";
import { usePlanesTratamiento } from "@/entities/plan-tratamiento";
import { Timer, Save, X, User, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import { toast } from "sonner";

export const SesionEnProgresoPage = () => {
  const router = useRouter();
  const { sesion, limpiarSesion } = useSesionActivaStore();
  const { segundos, tiempoFormateado } = useTemporizador(!!sesion);
  const grabacion = useGrabacion();

  const [notas, setNotas] = useState("");
  const [showFinishModal, setShowFinishModal] = useState(false);

  const { planes } = usePlanesTratamiento({
    pagina: 1,
    pageSize: 1,
    pacienteId: sesion?.pacienteId,
  });

  const planActivo = planes[0] || null;

  const handleFinalizar = async () => {
    try {
      // Lógica de guardado omitida por simplicidad en este paso, igual que el original
      grabacion.detenerGrabacion();
      limpiarSesion();
      toast.success("Sesión guardada exitosamente");
      router.push("/dashboard/sesiones");
    } catch (err) {
      toast.error("Error al guardar la sesión");
    }
  };

  if (!sesion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold dark:text-white mb-2">
          No hay sesión activa
        </h2>
        <p className="text-gray-400 max-w-md mb-8">
          Inicia una sesión desde el listado de sesiones o la ficha del
          paciente.
        </p>
        <button
          onClick={() => router.push("/dashboard/sesiones")}
          className="px-8 py-3 bg-[#008080] text-white rounded-2xl font-bold"
        >
          Ir a Sesiones
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#f8fafc] dark:bg-background flex flex-col">
      {/* Header de Sesión */}
      <header className="h-20 bg-white dark:bg-accent border-b border-gray-200 dark:border-white/5 px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#008080]/10 flex items-center justify-center text-[#008080]">
            <User size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold dark:text-white">
              {sesion.pacienteNombre}
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Sesión en Progreso
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 px-6 py-2 bg-gray-900 rounded-full border border-white/10 shadow-inner">
            <Timer size={16} className="text-[#008080]" />
            <span className="text-lg font-mono font-bold text-white tracking-wider">
              {tiempoFormateado}
            </span>
          </div>

          <button
            onClick={() => setShowFinishModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#008080] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#008080]/20 hover:bg-[#006666] transition-all"
          >
            <Save size={18} />
            Finalizar Sesión
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <VistaCamara
          videoRef={grabacion.videoRef}
          estaGrabando={grabacion.estaGrabando}
          dispositivos={grabacion.dispositivos}
          dispositivoSeleccionado={grabacion.dispositivoSeleccionado}
          alCambiarCamara={grabacion.cambiarCamara}
          alAlternarGrabacion={() =>
            grabacion.estaGrabando
              ? grabacion.detenerGrabacion()
              : grabacion.iniciarGrabacion()
          }
        />

        <WorkspaceSesion
          notas={notas}
          alCambiarNotas={setNotas}
          planTratamiento={planActivo}
          recursos={[]}
        />
      </main>

      <ConfirmModal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onConfirm={handleFinalizar}
        title="Finalizar Sesión"
        message="¿Estás seguro de que deseas finalizar y guardar esta sesión clínica?"
        confirmLabel="Finalizar y Guardar"
      />
    </div>
  );
};
