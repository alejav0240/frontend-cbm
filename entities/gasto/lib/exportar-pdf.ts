import { GastoExportarFila } from "../model/dto";

export const generarGastosPDF = async (filas: GastoExportarFila[]) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Reporte de Gastos", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    head: [["#", "Descripción", "Categoría", "Monto", "Fecha", "Estado"]],
    body: filas.map((f, i) => [
      i + 1,
      f.descripcion,
      f.categoria,
      `Bs. ${Number(f.monto).toFixed(2)}`,
      f.fecha,
      f.estado === "PAID" ? "Pagado" : "Pendiente",
    ]),
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: "#008080" },
  });

  return doc;
};
