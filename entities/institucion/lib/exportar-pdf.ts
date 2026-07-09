import { InstitucionExportarFila } from "../model/dto";

export const generarInstitucionesPDF = async (
  filas: InstitucionExportarFila[],
) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Reporte de Instituciones", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    head: [["#", "Nombre", "Dirección", "Contacto", "Email", "Teléfono", "Grupos"]],
    body: filas.map((f, i) => [
      i + 1,
      f.nombre,
      f.direccion,
      f.nombreContacto,
      f.emailContacto,
      f.telefonoContacto,
      f.cantidadGrupos,
    ]),
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: "#008080" },
  });

  return doc;
};
