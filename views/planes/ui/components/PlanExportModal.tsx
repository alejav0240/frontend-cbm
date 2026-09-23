"use client";

import React, { useState, useEffect } from "react";
import { Download, Loader2, FileText } from "lucide-react";
import Modal from "@/shared/ui/components/Modal";
import type { PlanTarjeta } from "../tipos";
import { generarPlanIntervencionPDF } from "@/entities/plan-tratamiento/lib/exportar-plan-pdf";

interface PlanExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanTarjeta | null;
}

export function PlanExportModal({ isOpen, onClose, plan }: PlanExportModalProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let url: string | null = null;
    let active = true;

    async function loadPdf() {
      if (!isOpen || !plan) {
        setPdfUrl(null);
        return;
      }
      setLoading(true);
      try {
        const doc = await generarPlanIntervencionPDF(plan);
        if (!active) return;
        const blob = doc.output("blob");
        url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        console.error("Error generando preview de PDF:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPdf();

    return () => {
      active = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [isOpen, plan]);

  const handleDownload = async () => {
    if (!plan) return;
    setDownloading(true);
    try {
      const doc = await generarPlanIntervencionPDF(plan);
      const nombreLimpio = (plan.patientName || "paciente")
        .toLowerCase()
        .replace(/\s+/g, "_");
      doc.save(`plan_intervencion_${nombreLimpio}_${Date.now()}.pdf`);
    } catch (err) {
      console.error("Error al descargar PDF:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vista Previa de Plan de Intervención"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#008080]/10 flex items-center justify-center text-[#008080]">
              <FileText size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm dark:text-white">
                {plan?.patientName}
              </h4>
              <p className="text-xs text-gray-500">
                {plan?.steps?.length ?? 0} pasos · {plan?.status}
              </p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading || loading}
            className="flex items-center justify-center gap-2 bg-[#008080] hover:bg-[#006666] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            Descargar PDF
          </button>
        </div>

        <div className="w-full h-[60vh] bg-gray-100 dark:bg-[#18181b] rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200 dark:border-white/10">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <Loader2 className="animate-spin text-[#008080]" size={32} />
              <p className="text-sm font-medium">Generando vista previa del PDF...</p>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full rounded-2xl"
              title="Vista previa del PDF"
            />
          ) : (
            <p className="text-sm text-gray-400">
              No se pudo cargar la vista previa.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
