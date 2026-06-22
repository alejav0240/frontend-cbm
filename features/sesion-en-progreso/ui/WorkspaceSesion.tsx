"use client";

import React from "react";
import { ClipboardList, Target, Music, FileText } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { PlanTab } from "@/features/sesion-en-progreso/ui/PanTab";
import { NotesTab } from "@/features/sesion-en-progreso/ui/NotesTab";
import { ResourcesTab } from "@/features/sesion-en-progreso/ui/RecursosTab";
import { EvaluationTab } from "@/features/sesion-en-progreso/ui/EvaluacionTab";

interface WorkspaceSesionProps {
  tabActiva: "plan" | "notas" | "recursos" | "evaluacion";
  setTabActiva: (tab: "plan" | "notas" | "recursos" | "evaluacion") => void;
  notas: string;
  alCambiarNotas: (notas: string) => void;
  timer: number;
  formatTime: (seconds: number) => string;
  planTratamiento: any;
  completedSteps: string[];
  totalSteps: number;
  toggleStep: (id: string) => void;
  recursos: any[];
  selectedResources: string[];
  toggleResource: (id: string) => void;
  evaluationScales: any[];
  selectedScales: string[];
  toggleScale: (id: string) => void;
  formTemplates: any[];
  selectedForms: string[];
  toggleForm: (id: string) => void;
  formResponses: Record<string, any>;
  updateForm: (key: string, value: any) => void;
}

interface TabBadge {
  label: string;
  count: string;
}

export const WorkspaceSesion = ({
  tabActiva,
  setTabActiva,
  notas,
  alCambiarNotas,
  timer,
  formatTime,
  planTratamiento,
  completedSteps,
  totalSteps,
  toggleStep,
  recursos,
  selectedResources,
  toggleResource,
  evaluationScales,
  selectedScales,
  toggleScale,
  formTemplates,
  selectedForms,
  toggleForm,
  formResponses,
  updateForm,
}: WorkspaceSesionProps) => {
  const tabs: {
    id: typeof tabActiva;
    label: string;
    icon: React.ReactNode;
    badge?: TabBadge;
  }[] = [
    {
      id: "plan",
      label: "Plan",
      icon: <Target size={16} />,
      badge:
        totalSteps > 0
          ? {
              label: `${completedSteps.length}/${totalSteps}`,
              count: `${completedSteps.length}/${totalSteps}`,
            }
          : undefined,
    },
    {
      id: "notas",
      label: "Notas",
      icon: <FileText size={16} />,
      badge: notas.length > 0 ? { label: "•", count: "•" } : undefined,
    },
    {
      id: "recursos",
      label: "Recursos",
      icon: <Music size={16} />,
      badge:
        selectedResources.length > 0
          ? {
              label: `${selectedResources.length}`,
              count: `${selectedResources.length}`,
            }
          : undefined,
    },
    {
      id: "evaluacion",
      label: "Evaluación",
      icon: <ClipboardList size={16} />,
      badge:
        selectedScales.length + selectedForms.length > 0
          ? {
              label: `${selectedScales.length + selectedForms.length}`,
              count: `${selectedScales.length + selectedForms.length}`,
            }
          : undefined,
    },
  ] as const;

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-accent">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTabActiva(tab.id)}
            className={`relative flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
              tabActiva === tab.id
                ? "text-[#008080] border-b-2 border-[#008080] bg-[#008080]/5"
                : "text-gray-400 hover:bg-gray-50 dark:hover:bg-white/2"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.badge && (
              <span
                className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-black leading-none ${
                  tabActiva === tab.id
                    ? "bg-[#008080] text-white"
                    : "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                }`}
              >
                {tab.badge.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {tabActiva === "notas" && (
            <NotesTab
              key="notes"
              notes={notas}
              setNotes={alCambiarNotas}
              timer={timer}
              formatTime={formatTime}
            />
          )}

          {tabActiva === "plan" && (
            <PlanTab
              key="plan"
              patientPlan={planTratamiento}
              completedSteps={completedSteps}
              toggleStep={toggleStep}
            />
          )}

          {tabActiva === "recursos" && (
            <ResourcesTab
              key="resources"
              resources={recursos}
              selectedResources={selectedResources}
              toggleResource={toggleResource}
            />
          )}
          {tabActiva === "evaluacion" && (
            <EvaluationTab
              key="forms"
              evaluationScales={evaluationScales}
              selectedScales={selectedScales}
              toggleScale={toggleScale}
              formTemplates={formTemplates}
              selectedForms={selectedForms}
              toggleForm={toggleForm}
              formResponses={formResponses}
              updateForm={updateForm}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
