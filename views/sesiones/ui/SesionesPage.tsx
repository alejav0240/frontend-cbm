"use client";

import React from "react";
import {
  useSesiones,
  generarSesionesPDF,
  generarSesionesExcel,
  SesionExportarFila,
} from "@/entities/sesion";
import { TablaSesiones } from "@/widgets/lista-sesiones";
import { Plus, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const SesionesPage = () => {
  const router = useRouter();
  const { sesiones, cargando } = useSesiones();

  const prepararDatosExportacion = (): SesionExportarFila[] => {
    return sesiones.map((s) => ({
      ...s,
      notas: s.notas,
    }));
  };

  const manejarExportarPDF = async () => {
    try {
      const filas = prepararDatosExportacion();
      const doc = await generarSesionesPDF(filas);
      doc.save(`reporte_sesiones_${Date.now()}.pdf`);
      toast.success("PDF generado exitosamente");
    } catch (err) {
      toast.error("Error al generar PDF");
    }
  };

  const manejarExportarExcel = async () => {
    try {
      const filas = prepararDatosExportacion();
      await generarSesionesExcel(filas);
      toast.success("Excel generado exitosamente");
    } catch (err) {
      toast.error("Error al generar Excel");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">
            Sesiones Terapéuticas
          </h1>
          <p className="text-gray-400 text-sm">
            Historial y seguimiento de sesiones individuales y grupales
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white dark:bg-accent border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={manejarExportarPDF}
              className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-all border-r border-gray-100 dark:border-white/5"
            >
              PDF
            </button>
            <button
              onClick={manejarExportarExcel}
              className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-all"
            >
              Excel
            </button>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-[#008080] text-white rounded-2xl text-sm font-bold hover:bg-[#006666] transition-all shadow-lg">
            <Plus size={18} />
            Nueva Sesión
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        <TablaSesiones sesiones={sesiones} alVerDetalles={() => {}} />
      </div>
    </div>
  );
};
