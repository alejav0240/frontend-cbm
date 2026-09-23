"use client";

import React from "react";

type Tab = "templates" | "assignments" | "responses";

interface FormsTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function FormsTabs({ activeTab, onTabChange }: FormsTabsProps) {
  return (
    <div
      data-onboarding-tabs=""
      role="tablist"
      className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl w-fit"
    >
      <button
        role="tab"
        aria-selected={activeTab === "templates"}
        onClick={() => onTabChange("templates")}
        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
          activeTab === "templates"
            ? "bg-white dark:bg-white/10 text-[#008080] shadow-sm"
            : "text-gray-500 hover:text-[#008080]"
        }`}
      >
        Plantillas
      </button>
      <button
        role="tab"
        aria-selected={activeTab === "assignments"}
        onClick={() => onTabChange("assignments")}
        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
          activeTab === "assignments"
            ? "bg-white dark:bg-white/10 text-[#008080] shadow-sm"
            : "text-gray-500 hover:text-[#008080]"
        }`}
      >
        Asignaciones
      </button>
      <button
        role="tab"
        aria-selected={activeTab === "responses"}
        onClick={() => onTabChange("responses")}
        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
          activeTab === "responses"
            ? "bg-white dark:bg-white/10 text-[#008080] shadow-sm"
            : "text-gray-500 hover:text-[#008080]"
        }`}
      >
        Respuestas
      </button>
    </div>
  );
}
