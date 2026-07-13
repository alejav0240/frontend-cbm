"use client";

import React, { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Loader2, ClipboardList, AlertCircle } from "lucide-react";
import { ReportsHeader } from "./components/ReportsHeader";
import { ReportsStats } from "./components/ReportsStats";
import { ReportCard } from "./components/ReportCard";
import { ReportDetailsModal } from "./components/ReportDetailsModal";
import { ReportFormModal } from "./components/ReportFormModal";
import { useInformes, useCrearInforme } from "@/entities/informes";
import { useBuscarPacientes } from "@/entities/paciente";
import { useAuthStore } from "@/shared/model/useAuthStore";

export default function InformesPage() {
  const { informes, cargando, refetch } = useInformes();
  const { usuario } = useAuthStore();
  const { options: patientOptions, onSearch: onSearchPatient } =
    useBuscarPacientes();
  const { crearInforme, creando } = useCrearInforme();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const [newReport, setNewReport] = useState({
    patientId: "",
    reportUrl: "",
    type: "Mensual",
  });

  const stats = useMemo(() => {
    const total = informes.length;
    const read = informes.filter((r) => readIds.has(r.id)).length;
    const rate = total > 0 ? Math.round((read / total) * 100) : 0;
    return { total, read, rate };
  }, [informes, readIds]);

  const handleViewReport = useCallback((report: any) => {
    setReadIds((prev) => new Set(prev).add(report.id));
    setSelectedReport({
      ...report,
      status: "Leído",
    });
  }, []);

  const handleSendReport = useCallback(async () => {
    if (!newReport.patientId || !newReport.reportUrl || !usuario?.databaseId) {
      toast.error("Completa todos los campos requeridos");
      return;
    }
    try {
      await crearInforme({
        patientId: newReport.patientId,
        generatedById: String(usuario.databaseId),
        reportUrl: newReport.reportUrl,
      });
      setShowCreateModal(false);
      setNewReport({ patientId: "", reportUrl: "", type: "Mensual" });
      refetch();
    } catch {
      /* toast handled in hook */
    }
  }, [newReport, usuario, crearInforme, refetch]);

  if (cargando && informes.length === 0) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-[#008080]" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ReportsHeader onNewReport={() => setShowCreateModal(true)} />

      {informes.length > 0 && (
        <ReportsStats total={stats.total} read={stats.read} rate={stats.rate} />
      )}

      {informes.length === 0 ? (
        <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-6">
            <ClipboardList size={40} />
          </div>
          <h2 className="text-xl font-bold dark:text-white mb-2">
            Informes Terapéuticos
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            No hay informes enviados aún. Crea el primer informe para comenzar.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {informes.map((report) => (
            <ReportCard
              key={report.id}
              report={{
                ...report,
                status: readIds.has(report.id) ? "Leído" : "Enviado",
              }}
              onClick={handleViewReport}
            />
          ))}
        </div>
      )}

      <ReportFormModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewReport({ patientId: "", reportUrl: "", type: "Mensual" });
        }}
        patientOptions={patientOptions}
        onSearchPatient={onSearchPatient}
        newReport={newReport}
        setNewReport={setNewReport}
        onSend={handleSendReport}
      />

      <ReportDetailsModal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
      />
    </div>
  );
}
