import { ArticuloInventarioExportarFila } from "../model/dto";

export const generarInventarioPDF = async (
  filas: ArticuloInventarioExportarFila[],
) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Reporte de Inventario", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    head: [
      ["Nombre", "Tipo", "Condición", "Aula", "Estado"],
    ],
    body: filas.map((f) => [
      f.nombre,
      f.tipo,
      f.condicion,
      f.aula,
      f.estadoMostrado,
    ]),
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: "#008080" },
  });

  return doc;
};
