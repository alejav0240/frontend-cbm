import type { EvaluacionDetalleDTO } from "../model/dto";

export async function generarEvaluacionPDF(datos: EvaluacionDetalleDTO) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF() as InstanceType<typeof jsPDF> & {
    lastAutoTable: { finalY: number };
  };
  const pagX = 14;
  let y = 22;

  const header = (text: string) => {
    if (y > 250) {
      doc.addPage();
      y = 22;
    }
    doc.setFontSize(13);
    doc.setTextColor(0, 128, 128);
    doc.text(text, pagX, y);
    y += 8;
  };

  doc.setFontSize(20);
  doc.setTextColor(0, 128, 128);
  doc.text("Evaluación Clínica", pagX, y);
  y += 6;
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(`Generado el: ${new Date().toLocaleDateString("es-ES")}`, pagX, y);
  y += 12;

  header("Información General");
  autoTable(doc, {
    body: [
      ["Paciente:", datos.paciente, "Fecha:", datos.fecha],
      ["Escala:", datos.escala, "Tipo:", datos.tipo],
    ],
    startY: y,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [100, 100, 100], cellWidth: 40 },
      1: { textColor: [50, 50, 50], cellWidth: 60 },
      2: { fontStyle: "bold", textColor: [100, 100, 100], cellWidth: 40 },
      3: { textColor: [50, 50, 50], cellWidth: 60 },
    },
  });
  y = doc.lastAutoTable.finalY + 12;

  if (datos.subescalas.length > 0) {
    header("Resultados por Dimensión");
    autoTable(doc, {
      head: [["Dimensión", "Puntaje"]],
      body: datos.subescalas.map((s) => [
        s.nombre,
        s.maximo != null ? `${s.puntaje} / ${s.maximo}` : String(s.puntaje),
      ]),
      startY: y,
      theme: "striped",
      headStyles: { fillColor: [0, 128, 128] },
      styles: { fontSize: 9, cellPadding: 3 },
      margin: { left: pagX, right: 14 },
    });
    y = doc.lastAutoTable.finalY + 12;
  } else if (datos.valorSeleccionado) {
    header("Resultado de la Escala");
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(`Valor seleccionado: ${datos.valorSeleccionado}`, pagX, y);
    y += 6;
  }

  if (y > 230) {
    doc.addPage();
    y = 22;
  }
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 128, 128);
  doc.text("Puntaje Global", pagX, y);
  y += 6;
  doc.setFontSize(20);
  doc.setTextColor(50);
  doc.text(datos.puntaje != null ? String(datos.puntaje) : "—", pagX + 70, y);

  return doc;
}
