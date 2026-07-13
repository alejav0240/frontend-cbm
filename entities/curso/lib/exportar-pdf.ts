import { CursoExportarFila } from "../model/dto";

export const generarCursosPDF = async (filas: CursoExportarFila[]) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Reporte de Cursos", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    head: [
      ["Nombre", "Descripción", "Precio", "Estudiantes", "Ingresos", "Estado"],
    ],
    body: filas.map((f) => [
      f.nombre,
      f.descripcion,
      `Bs. ${Number(f.precio).toFixed(2)}`,
      String(f.conteoEstudiantes),
      `Bs. ${Number(f.ingresosTotales).toFixed(2)}`,
      f.estado === "ACTIVE" ? "Activo" : "Cerrado",
    ]),
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: "#008080" },
  });

  return doc;
};
