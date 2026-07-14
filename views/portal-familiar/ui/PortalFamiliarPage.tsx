"use client";

import { useState } from "react";
import { usePacientesTutor } from "@/entities/paciente";
import { usePortalData } from "../api/usePortalData";
import { FamilyHeader } from "./components/FamilyHeader";
import { ProgressCard } from "./components/ProgressCard";
import { NextSessionCard } from "./components/NextSessionCard";
import { RecentActivity } from "./components/RecentActivity";
import { PendingForms } from "./components/PendingForms";
import { TherapyReportsList } from "./components/TherapyReportsList";
import { ReportDetailModal } from "./components/ReportDetailModal";
import { TherapistNote } from "./components/TherapistNote";
import { HomeResources } from "./components/HomeResources";
import LoadingScreen from "@/shared/ui/LoadingScreen";
import { Users } from "lucide-react";
import type { TherapyReport } from "@/entities/informes/model/tipos";

export const PortalFamiliarPage = () => {
  const {
    pacientes,
    pacienteSeleccionado,
    indiceSeleccionado,
    seleccionarPaciente,
    cargando: cargandoPacientes,
  } = usePacientesTutor();

  const {
    informes,
    sesiones,
    proximaSesion,
    formulariosPendientes,
    cargando: cargandoData,
  } = usePortalData(pacienteSeleccionado?.fullName);

  const [informeSeleccionado, setInformeSeleccionado] =
    useState<TherapyReport | null>(null);

  if (cargandoPacientes) return <LoadingScreen />;

  if (pacientes.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Portal Familiar</h1>
          <p className="text-gray-400 text-sm">
            Espacio de comunicación y reportes para los tutores de los pacientes
          </p>
        </div>
        <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 mx-auto mb-6">
            <Users size={40} />
          </div>
          <h2 className="text-xl font-bold dark:text-white mb-2">
            Sin pacientes asignados
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            No se encontraron pacientes vinculados a tu cuenta. Contacta al
            administrador para más información.
          </p>
        </div>
      </div>
    );
  }

  if (pacientes.length > 1 && !pacienteSeleccionado) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Portal Familiar</h1>
          <p className="text-gray-400 text-sm">
            Selecciona un paciente para ver su información
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pacientes.map((p, i) => (
            <button
              key={i}
              onClick={() => seleccionarPaciente(i)}
              className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 text-left hover:border-[#008080]/50 hover:shadow-lg transition-all"
            >
              <p className="text-lg font-bold dark:text-white">{p.fullName}</p>
              <p className="text-sm text-gray-400 mt-1">
                {p.diagnosis ?? "Sin diagnóstico"}
              </p>
              <span
                className={`inline-block mt-3 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                  p.status === "active"
                    ? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                    : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400"
                }`}
              >
                {p.status === "active" ? "Activo" : p.status}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FamilyHeader
        patient={{ name: pacienteSeleccionado?.fullName ?? "Paciente" }}
      />

      {pacientes.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {pacientes.map((p, i) => (
            <button
              key={i}
              onClick={() => seleccionarPaciente(i)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                i === indiceSeleccionado
                  ? "bg-[#008080] text-white"
                  : "bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 text-gray-500 hover:border-[#008080]/30"
              }`}
            >
              {p.fullName}
            </button>
          ))}
        </div>
      )}

      {cargandoData ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <ProgressCard />
              <NextSessionCard session={proximaSesion} />
              <TherapistNote />
            </div>
            <div className="space-y-8">
              <PendingForms
                forms={formulariosPendientes}
                onSelectForm={() => {}}
              />
              <RecentActivity sessions={sesiones} />
              <TherapyReportsList
                reports={informes}
                onViewReport={setInformeSeleccionado}
              />
              <HomeResources />
            </div>
          </div>
        </>
      )}

      <ReportDetailModal
        report={informeSeleccionado}
        isOpen={!!informeSeleccionado}
        onClose={() => setInformeSeleccionado(null)}
      />
    </div>
  );
};
