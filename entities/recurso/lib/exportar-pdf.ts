import { RecursoExportarFila } from "../model/dto";

export const generarRecursosPDF = async (filas: RecursoExportarFila[]) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Reporte de Recursos", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    head: [["ID", "Título", "Tipo", "Categoría", "URL"]],
    body: filas.map((f) => [
      f.id,
      f.titulo,
      f.tipoMostrado || f.tipo,
      f.categoria,
      f.url,
    ]),
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: "#008080" },
  });

  return doc;
};
