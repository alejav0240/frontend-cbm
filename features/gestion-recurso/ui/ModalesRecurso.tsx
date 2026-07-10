"use client";

import React, { useMemo } from "react";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import GenericExportModal, {
  Exporter,
} from "@/shared/ui/GenericExportModal";
import {
  RecursoDigital,
  RecursoExportarFila,
  generarRecursosExcel,
  generarRecursosPDF,
} from "@/entities/recurso";
import { ResourceFormModal } from "./ResourceFormModal";

interface ModalesRecursoProps {
  mostrarFormulario: boolean;
  alCerrarFormulario: () => void;
  alEnviarFormulario: (data: {
    title: string;
    type: string;
    url: string;
    category: string;
  }) => void;
  estaCreando: boolean;

  mostrarConfirmarEliminar: boolean;
  alCerrarConfirmarEliminar: () => void;
  alConfirmarEliminar: () => void;
  recursoAEliminar: string | null;

  mostrarExportar: boolean;
  alCerrarExportar: () => void;
  listaRecursos: RecursoDigital[];

  recursoAEditar: RecursoDigital | null;
}

const recursoPDFExporter: Exporter<RecursoExportarFila> = {
  id: "pdf",
  label: "Exportar PDF",
  async execute(data, columns, fileName) {
    const doc = await generarRecursosPDF(data);
    doc.save(`${fileName}_${Date.now()}.pdf`);
  },
  async preview(data) {
    const doc = await generarRecursosPDF(data);
    return doc.output("blob");
  },
};

const recursoExcelExporter: Exporter<RecursoExportarFila> = {
  id: "excel",
  label: "Exportar Excel",
  async execute(data) {
    await generarRecursosExcel(data);
  },
};

const exporters: Exporter<RecursoExportarFila>[] = [
  recursoPDFExporter,
  recursoExcelExporter,
];

export const ModalesRecurso = ({
  mostrarFormulario,
  alCerrarFormulario,
  alEnviarFormulario,
  estaCreando,
  mostrarConfirmarEliminar,
  alCerrarConfirmarEliminar,
  alConfirmarEliminar,
  recursoAEliminar,
  mostrarExportar,
  alCerrarExportar,
  listaRecursos,
  recursoAEditar,
}: ModalesRecursoProps) => {
  const datosExportacion = useMemo((): RecursoExportarFila[] => {
    return listaRecursos.map((r) => ({
      id: r.id,
      titulo: r.titulo,
      tipo: r.tipo,
      categoria: r.categoria,
      url: r.url,
      tipoMostrado: r.tipoMostrado,
    }));
  }, [listaRecursos]);

  return (
    <>
      <ResourceFormModal
        isOpen={mostrarFormulario}
        onClose={alCerrarFormulario}
        onSubmit={alEnviarFormulario}
        estaCreando={estaCreando}
        initialData={recursoAEditar ? recursoAEditar : undefined}
      />

      <ConfirmModal
        isOpen={mostrarConfirmarEliminar}
        onClose={alCerrarConfirmarEliminar}
        onConfirm={alConfirmarEliminar}
        title="Eliminar Recurso"
        message={`¿Estás seguro de que deseas eliminar el recurso${recursoAEliminar ? "" : ""}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar Recurso"
      />

      <GenericExportModal<RecursoExportarFila>
        title="Exportar Recursos"
        isOpen={mostrarExportar}
        onClose={alCerrarExportar}
        data={datosExportacion}
        fileName="recursos"
        columns={[
          { key: "titulo", label: "Título" },
          { key: "tipoMostrado", label: "Tipo" },
          { key: "categoria", label: "Categoría" },
          { key: "url", label: "URL" },
        ]}
        filters={[
          {
            key: "tipoMostrado",
            label: "Tipo",
            type: "select",
            options: [
              { value: "Audio", label: "Audio" },
              { value: "Video", label: "Video" },
              { value: "Imagen", label: "Imagen" },
              { value: "Partitura", label: "Partitura" },
              { value: "Documento", label: "Documento" },
              { value: "Enlace Web", label: "Enlace Web" },
            ],
          },
          {
            key: "categoria",
            label: "Categoría",
            type: "text",
          },
        ]}
        exporters={exporters}
      />
    </>
  );
};
