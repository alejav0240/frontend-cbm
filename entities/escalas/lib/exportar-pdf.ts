import type { EvaluacionExportarFila } from "../model/dto";

export const generarEvaluacionesPDF = async (
  filas: EvaluacionExportarFila[],
) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Reporte de Evaluaciones Clínicas", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    head: [["Paciente", "Escala", "Fecha", "Tipo", "Puntaje"]],
    body: filas.map((f) => [
      f.paciente,
      f.escala,
      f.fecha,
      f.tipo,
      f.puntaje != null ? String(f.puntaje) : "—",
    ]),
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: "#008080" },
  });

  return doc;
};

export const generarEvaluacionesPDFPreview = async (
  filas: EvaluacionExportarFila[],
): Promise<Blob> => {
  const doc = await generarEvaluacionesPDF(filas);
  return doc.output("blob");
};
