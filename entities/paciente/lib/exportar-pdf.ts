import { PacienteExportarFila } from "../model/dto";

export const generarPacientesPDF = async (filas: PacienteExportarFila[]) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  console.log(filas);

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Reporte de Pacientes", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    head: [
      [
        "ID",
        "Nombre",
        "Edad",
        "Diagnóstico",
        "Tutor",
        "Telefono",
        "Residencia",
      ],
    ],
    body: filas.map((f) => [
      f.cedula || f.id,
      f.nombre,
      f.edad ?? "",
      f.diagnostico ?? "",
      f.tutor ?? "",
      f.telefonoTutor ?? "",
      f.residencia ?? "",
    ]),
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: "#008080" },
  });

  return doc;
};
