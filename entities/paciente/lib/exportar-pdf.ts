import { PacienteExportarFila } from "../model/dto";

export const generarPacientesPDF = async (filas: PacienteExportarFila[]) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Reporte de Pacientes", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    head: [["ID", "Nombre", "Diagnóstico", "Estado", "Tutor"]],
    body: filas.map((f) => [
      f.cedula || f.id,
      f.nombre,
      f.diagnostico ?? "",
      f.estado,
      f.tutor ?? "",
    ]),
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: "#008080" },
  });

  return doc;
};
