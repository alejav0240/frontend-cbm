"use client";

import React, { useState } from "react";
import { ClipboardList, Target, Music, FileText } from "lucide-react";

interface WorkspaceSesionProps {
  notas: string;
  alCambiarNotas: (notas: string) => void;
  planTratamiento: any;
  recursos: any[];
}

export const WorkspaceSesion = ({
  notas,
  alCambiarNotas,
  planTratamiento,
  recursos,
}: WorkspaceSesionProps) => {
  const [tabActiva, setTabActiva] = useState<
    "plan" | "notas" | "recursos" | "evaluacion"
  >("plan");

  const tabs = [
    { id: "plan", label: "Plan", icon: <Target size={16} /> },
    { id: "notas", label: "Notas", icon: <FileText size={16} /> },
    { id: "recursos", label: "Recursos", icon: <Music size={16} /> },
    {
      id: "evaluacion",
      label: "Evaluación",
      icon: <ClipboardList size={16} />,
    },
  ] as const;

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#0a0a0a]">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTabActiva(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
              tabActiva === tab.id
                ? "text-[#008080] border-b-2 border-[#008080] bg-[#008080]/5"
                : "text-gray-400 hover:bg-gray-50 dark:hover:bg-white/2"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {tabActiva === "notas" && (
          <textarea
            value={notas}
            onChange={(e) => alCambiarNotas(e.target.value)}
            placeholder="Escribe tus observaciones clínicas aquí..."
            className="w-full h-full min-h-[400px] p-6 bg-gray-50 dark:bg-white/2 rounded-[24px] border-transparent focus:border-[#008080]/30 outline-none text-base dark:text-white resize-none shadow-inner"
          />
        )}

        {tabActiva === "plan" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold dark:text-white">
              Plan de Intervención Activo
            </h3>
            {planTratamiento ? (
              <div className="space-y-4">
                {planTratamiento.pasos.map((paso: any) => (
                  <div
                    key={paso.id}
                    className="p-6 bg-gray-50 dark:bg-white/2 rounded-2xl flex items-start gap-4"
                  >
                    <input
                      type="checkbox"
                      checked={paso.estaCompletado}
                      readOnly
                      className="mt-1.5 w-5 h-5 rounded-md border-gray-300 text-[#008080] focus:ring-[#008080]"
                    />
                    <div>
                      <p className="font-bold dark:text-white">
                        {paso.objetivo}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {paso.momento} - {paso.duracionMinutos} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                No hay un plan de intervención activo para este paciente.
              </p>
            )}
          </div>
        )}

        {(tabActiva === "recursos" || tabActiva === "evaluacion") && (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 mb-4">
              <ClipboardList size={32} />
            </div>
            <h3 className="text-lg font-bold dark:text-white">
              Sección en Construcción
            </h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              Estamos migrando esta pestaña para integrarla con el nuevo sistema
              de recursos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
