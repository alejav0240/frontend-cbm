"use client";

import React from "react";
import { Search, ExternalLink } from "lucide-react";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";

interface MarketingTabsProps {
  activeTab: "dashboard" | "campaigns" | "leads";
  setActiveTab: (tab: "dashboard" | "campaigns" | "leads") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter?: string;
  setStatusFilter?: (status: string) => void;
  sourceFilter?: string;
  setSourceFilter?: (source: string) => void;
  openCampaigns?: { label: string; value: string; color: string }[];
  onExport?: () => void;
}

export function MarketingTabs({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sourceFilter,
  setSourceFilter,
  openCampaigns = [],
  onExport,
}: MarketingTabsProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white dark:bg-white/2 p-2 rounded-[28px] border border-gray-200 dark:border-white/5">
      <div className="flex p-1 rounded-2xl w-full lg:w-auto">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex-1 lg:flex-none px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "dashboard" ? "bg-[#008080] text-white shadow-lg shadow-[#008080]/20" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`flex-1 lg:flex-none px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "campaigns" ? "bg-[#008080] text-white shadow-lg shadow-[#008080]/20" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
        >
          Campañas
        </button>
        <button
          onClick={() => setActiveTab("leads")}
          className={`flex-1 lg:flex-none px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "leads" ? "bg-[#008080] text-white shadow-lg shadow-[#008080]/20" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
        >
          Leads
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
        <div className="relative w-full sm:w-64 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#008080] transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus-visible:border-[#008080]/30 focus-visible:ring-4 focus-visible:ring-[#008080]/5 outline-none transition-all text-xs dark:text-white"
          />
        </div>

        {activeTab === "leads" && setStatusFilter && setSourceFilter && (
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 items-center">
            <SearchableSelect
              value={statusFilter || "Todos"}
              onChange={setStatusFilter}
              options={[
                { label: "Todos los Estados", value: "Todos" },
                { label: "Nuevo", value: "Nuevo", color: "bg-purple-500" },
                {
                  label: "Contactado",
                  value: "Contactado",
                  color: "bg-blue-500",
                },
                {
                  label: "Interesado",
                  value: "Interesado",
                  color: "bg-blue-500",
                },
                {
                  label: "Convertido",
                  value: "Convertido",
                  color: "bg-green-500",
                },
                { label: "Perdido", value: "Perdido", color: "bg-gray-500" },
              ]}
              className="w-48"
              clearable={false}
            />
            <SearchableSelect
              value={sourceFilter || "Todos"}
              onChange={setSourceFilter}
              options={[
                { label: "Todos los Orígenes", value: "Todos" },
                { label: "Directo / Orgánico", value: "Directo" },
                ...openCampaigns,
              ]}
              className="w-48"
              clearable={false}
            />
            <button
              onClick={onExport}
              className="p-3 bg-gray-50 dark:bg-white/5 text-[#008080] rounded-xl hover:bg-[#008080]/10 transition-all active:scale-95 h-[46px] flex items-center justify-center"
              title="Exportar CSV"
            >
              <ExternalLink size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
