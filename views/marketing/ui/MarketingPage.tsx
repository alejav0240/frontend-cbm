"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  useCampanasMarketing,
  useLeads,
  useCrearCampana,
  useActualizarCampana,
  useEliminarCampana,
  useCrearLead,
  useActualizarEstadoLead,
  useEliminarLead,
  MarketingCampaign,
  MarketingLead,
} from "@/entities/marketing";
import { MarketingHeader } from "./components/MarketingHeader";
import { MarketingTabs } from "./components/MarketingTabs";
import { MarketingStats } from "./components/MarketingStats";
import { MarketingDashboard } from "./components/MarketingDashboard";
import { CampaignsList } from "./components/CampaignsList";
import { CampaignFormModal } from "./components/CampaignFormModal";
import { LeadsTable } from "./components/LeadsTable";
import { LeadFormModal } from "./components/LeadFormModal";
import { LeadDetailModal } from "./components/LeadDetailModal";
import { toast } from "sonner";

const STATUS_MAP: Record<string, MarketingCampaign["status"]> = {
  ACTIVE: "Activo",
  PAUSED: "Pausado",
  FINISHED: "Finalizado",
  DRAFT: "Activo",
};

const STATUS_REVERSE_MAP: Record<string, string> = {
  Activo: "ACTIVE",
  Pausado: "PAUSED",
  Finalizado: "FINISHED",
};

const LEAD_STATUS_MAP: Record<string, MarketingLead["status"]> = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  QUALIFIED: "Interesado",
  LOST: "Perdido",
};

export const MarketingPage = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "campaigns" | "leads"
  >("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [sourceFilter, setSourceFilter] = useState("Todos");

  const [mostrarFormularioCampana, setMostrarFormularioCampana] =
    useState(false);
  const [campanaAEditar, setCampanaAEditar] =
    useState<Partial<MarketingCampaign> | null>(null);
  const [mostrarFormularioLead, setMostrarFormularioLead] = useState(false);
  const [leadAEditar, setLeadAEditar] = useState<Partial<MarketingLead> | null>(
    null,
  );
  const [leadDetalle, setLeadDetalle] = useState<MarketingLead | null>(null);
  const [idAEliminar, setIdAEliminar] = useState<{
    tipo: "campana" | "lead";
    id: string;
  } | null>(null);

  const { campanas, cargando: cargandoCampanas } =
    useCampanasMarketing();
  const { leads, cargando: cargandoLeads } = useLeads();

  const { crear: crearCampana } = useCrearCampana();
  const { actualizar: actualizarCampana } =
    useActualizarCampana();
  const { eliminar: eliminarCampana } = useEliminarCampana();
  const { crear: crearLead } = useCrearLead();
  const { actualizar: actualizarEstadoLead } = useActualizarEstadoLead();
  const { eliminar: eliminarLead } = useEliminarLead();

  const campanasMapeadas = useMemo<MarketingCampaign[]>(() => {
    return campanas.map((c) => ({
      id: c.id,
      name: c.nombre,
      platform: c.plataforma,
      budget: Number(c.presupuesto),
      spent: Number(c.gastado),
      status: STATUS_MAP[c.estado] || "Activo",
      startDate: "",
      leadsCount: c.conteoLeads,
    }));
  }, [campanas]);

  const leadsMapeados = useMemo<MarketingLead[]>(() => {
    return leads
      .filter((l) => {
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          if (
            !l.nombre?.toLowerCase().includes(term) &&
            !l.telefono?.toLowerCase().includes(term) &&
            !l.email?.toLowerCase().includes(term)
          ) {
            return false;
          }
        }
        if (statusFilter !== "Todos") {
          const estadoMapeado = LEAD_STATUS_MAP[l.estado] || l.estado;
          if (estadoMapeado !== statusFilter) return false;
        }
        if (sourceFilter !== "Todos") {
          const origen = l.campana?.nombre || "Directo";
          if (origen !== sourceFilter) return false;
        }
        return true;
      })
      .map((l) => ({
        id: Number(l.id),
        name: l.nombre,
        phone: l.telefono || "",
        email: l.email || "",
        source: l.campana?.nombre || "Directo",
        status: LEAD_STATUS_MAP[l.estado] || "Nuevo",
        notes: "",
        createdAt: l.fechaCreacion,
      }));
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const campanasAbiertas = useMemo(() => {
    return campanasMapeadas
      .filter((c) => c.status === "Activo")
      .map((c) => ({
        label: c.name,
        value: c.name,
        color: "bg-[#008080]",
      }));
  }, [campanasMapeadas]);

  const stats = useMemo(() => {
    const totalSpent = campanasMapeadas.reduce((acc, c) => acc + c.spent, 0);
    const totalLeads = leadsMapeados.length;
    const convertidos = leadsMapeados.filter(
      (l) => l.status === "Convertido",
    ).length;
    const conversionRate =
      totalLeads > 0 ? ((convertidos / totalLeads) * 100).toFixed(1) : "0";
    const costPerLead =
      totalLeads > 0 ? (totalSpent / totalLeads).toFixed(2) : "0";
    return { totalSpent, totalLeads, conversionRate, costPerLead };
  }, [campanasMapeadas, leadsMapeados]);

  const campaignChartData = useMemo(() => {
    return campanasMapeadas.map((c) => ({
      name: c.name.length > 12 ? c.name.slice(0, 12) + "..." : c.name,
      presupuesto: c.budget,
      invertido: c.spent,
    }));
  }, [campanasMapeadas]);

  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    leadsMapeados.forEach((l) => {
      counts[l.source] = (counts[l.source] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [leadsMapeados]);

  const timelineData = useMemo(() => {
    const grouped: Record<string, number> = {};
    leadsMapeados.forEach((l) => {
      const date = new Date(l.createdAt).toLocaleDateString("es-ES", {
        month: "short",
      });
      grouped[date] = (grouped[date] || 0) + 1;
    });
    return Object.entries(grouped).map(([date, leads]) => ({ date, leads }));
  }, [leadsMapeados]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    leadsMapeados.forEach((l) => {
      counts[l.status] = (counts[l.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [leadsMapeados]);

  const handleCrearCampana = useCallback(
    async (data: Partial<MarketingCampaign>) => {
      try {
        await crearCampana({
          name: data.name || "",
          platform: data.platform || "Facebook",
          budget: data.budget || 0,
          status: STATUS_REVERSE_MAP[data.status || "Activo"] || "ACTIVE",
        });
        setMostrarFormularioCampana(false);
        toast.success("Campaña creada correctamente");
      } catch {
        toast.error("Error al crear la campaña");
      }
    },
    [crearCampana],
  );

  const handleActualizarCampana = useCallback(
    async (data: Partial<MarketingCampaign>) => {
      if (!data.id) return;
      try {
        await actualizarCampana({
          id: data.id,
          name: data.name,
          platform: data.platform,
          budget: data.budget,
          status: STATUS_REVERSE_MAP[data.status || "Activo"] || "ACTIVE",
        });
        setMostrarFormularioCampana(false);
        setCampanaAEditar(null);
        toast.success("Campaña actualizada correctamente");
      } catch {
        toast.error("Error al actualizar la campaña");
      }
    },
    [actualizarCampana],
  );

  const handleEliminarCampana = useCallback(
    async (id: string) => {
      try {
        await eliminarCampana(id);
        setIdAEliminar(null);
        toast.success("Campaña eliminada correctamente");
      } catch {
        toast.error("Error al eliminar la campaña");
      }
    },
    [eliminarCampana],
  );

  const handleCrearLead = useCallback(
    async (data: Partial<MarketingLead>) => {
      try {
        const campana = campanasMapeadas.find((c) => c.name === data.source);
        await crearLead({
          name: data.name || "",
          phone: data.phone,
          email: data.email,
          campaignId: campana?.id,
        });
        setMostrarFormularioLead(false);
        toast.success("Lead registrado correctamente");
      } catch {
        toast.error("Error al registrar el lead");
      }
    },
    [crearLead, campanasMapeadas],
  );

  const handleActualizarEstadoLead = useCallback(
    async (id: number, status: MarketingLead["status"]) => {
      const statusReverse: Record<string, string> = {
        Nuevo: "NEW",
        Contactado: "CONTACTED",
        Interesado: "QUALIFIED",
        Convertido: "QUALIFIED",
        Perdido: "LOST",
      };
      try {
        await actualizarEstadoLead(String(id), statusReverse[status] || "NEW");
        toast.success("Estado actualizado");
      } catch {
        toast.error("Error al actualizar el estado");
      }
    },
    [actualizarEstadoLead],
  );

  const handleEliminarLead = useCallback(
    async (id: number) => {
      try {
        await eliminarLead(String(id));
        setIdAEliminar(null);
        toast.success("Lead eliminado correctamente");
      } catch {
        toast.error("Error al eliminar el lead");
      }
    },
    [eliminarLead],
  );

  const handleExportarCSV = useCallback(() => {
    const headers = ["Nombre", "Teléfono", "Email", "Origen", "Estado", "Fecha"];
    const rows = leadsMapeados.map((l) => [
      l.name,
      l.phone,
      l.email,
      l.source,
      l.status,
      new Date(l.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado correctamente");
  }, [leadsMapeados]);

  const cargando = cargandoCampanas || cargandoLeads;

  return (
    <div className="space-y-8">
      <MarketingHeader
        onNewCampaign={() => {
          setCampanaAEditar(null);
          setMostrarFormularioCampana(true);
        }}
        onNewLead={() => {
          setLeadAEditar(null);
          setMostrarFormularioLead(true);
        }}
      />

      <MarketingTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        openCampaigns={campanasAbiertas}
        onExport={handleExportarCSV}
      />

      {cargando ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-24 mb-4" />
                <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-20" />
                <div className="mt-4 h-2 bg-gray-200 dark:bg-white/10 rounded w-32" />
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-48 mb-8" />
            <div className="h-[300px] bg-gray-200 dark:bg-white/10 rounded-2xl" />
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <MarketingStats
                  totalSpent={stats.totalSpent}
                  totalLeads={stats.totalLeads}
                  conversionRate={stats.conversionRate}
                  costPerLead={stats.costPerLead}
                />
                <MarketingDashboard
                  campaignData={campaignChartData}
                  sourceData={sourceData}
                  timelineData={timelineData}
                  statusData={statusData}
                />
              </div>
            )}

            {activeTab === "campaigns" && (
              <div className="space-y-6">
                <MarketingStats
                  totalSpent={stats.totalSpent}
                  totalLeads={stats.totalLeads}
                  conversionRate={stats.conversionRate}
                  costPerLead={stats.costPerLead}
                />
                <CampaignsList
                  campaigns={campanasMapeadas}
                  onEdit={(c) => {
                    setCampanaAEditar(c);
                    setMostrarFormularioCampana(true);
                  }}
                  onDelete={(id) =>
                    setIdAEliminar({ tipo: "campana", id: String(id) })
                  }
                />
              </div>
            )}

            {activeTab === "leads" && (
              <LeadsTable
                leads={leadsMapeados}
                onSelectLead={setLeadDetalle}
                onUpdateStatus={handleActualizarEstadoLead}
                onWhatsApp={(lead) => {
                  const phone = lead.phone.replace(/[^0-9]/g, "");
                  window.open(`https://wa.me/${phone}`, "_blank");
                }}
                onEdit={(lead) => {
                  setLeadAEditar(lead);
                  setMostrarFormularioLead(true);
                }}
                onDelete={(id) =>
                  setIdAEliminar({ tipo: "lead", id: String(id) })
                }
              />
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <CampaignFormModal
        key={campanaAEditar?.id || "new-campaign"}
        isOpen={mostrarFormularioCampana}
        onClose={() => {
          setMostrarFormularioCampana(false);
          setCampanaAEditar(null);
        }}
        onSave={
          campanaAEditar?.id ? handleActualizarCampana : handleCrearCampana
        }
        initialData={campanaAEditar}
      />

      <LeadFormModal
        key={leadAEditar?.id || "new-lead"}
        isOpen={mostrarFormularioLead}
        onClose={() => {
          setMostrarFormularioLead(false);
          setLeadAEditar(null);
        }}
        onSave={handleCrearLead}
        initialData={leadAEditar}
        openCampaigns={campanasAbiertas}
      />

      <LeadDetailModal
        lead={leadDetalle}
        onClose={() => setLeadDetalle(null)}
        onWhatsApp={(lead) => {
          const phone = lead.phone.replace(/[^0-9]/g, "");
          window.open(`https://wa.me/${phone}`, "_blank");
        }}
        onEdit={(lead) => {
          setLeadDetalle(null);
          setLeadAEditar(lead);
          setMostrarFormularioLead(true);
        }}
      />

      {idAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-2xl max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-bold dark:text-white mb-2">
              Confirmar eliminación
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              ¿Estás seguro de que deseas eliminar este{" "}
              {idAEliminar.tipo === "campana" ? "campaña" : "lead"}? Esta
              acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIdAEliminar(null)}
                className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (idAEliminar.tipo === "campana") {
                    handleEliminarCampana(idAEliminar.id);
                  } else {
                    handleEliminarLead(Number(idAEliminar.id));
                  }
                }}
                className="px-6 py-3 rounded-2xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
