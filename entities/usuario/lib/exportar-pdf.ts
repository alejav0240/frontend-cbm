import { UsuarioExportarFila } from "../model/dto";

export const generarUsuariosPDF = async (filas: UsuarioExportarFila[]) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Reporte de Usuarios", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    head: [["Nombre", "Carnet", "Email", "Celular", "Rol", "Estado"]],
    body: filas.map((f) => [
      f.nombre,
      f.carnet,
      f.email,
      f.celular,
      f.rol,
      f.estado,
    ]),
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: "#008080" },
  });

  return doc;
};
