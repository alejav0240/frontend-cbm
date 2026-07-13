import { SesionExportarFila } from "../model/dto";

export const generarSesionesPDF = async (filas: SesionExportarFila[]) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Reporte de Sesiones", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    head: [
      ["#", "Paciente", "Fecha", "Terapeuta", "Tipo", "Estado", "Duración"],
    ],
    body: filas.map((f) => [
      f.numeroSesion,
      f.pacienteNombre,
      `${f.fecha} ${f.hora}`,
      f.terapeuta,
      f.tipo,
      f.estado,
      f.duracion,
    ]),
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: "#008080" },
  });

  return doc;
};

export const generarSesionesPDFPreview = async (
  filas: SesionExportarFila[],
): Promise<Blob> => {
  const doc = await generarSesionesPDF(filas);
  return doc.output("blob");
};
