import { PagoExportarFila } from "../model/dto";
import { Pago } from "../model/tipos";

export function serializarPagosExportar(pagos: Pago[]): PagoExportarFila[] {
  return pagos.map((p) => ({
    id: p.id,
    pacienteNombre: p.paciente.fullName,
    fecha: new Intl.DateTimeFormat("es-ES").format(new Date(p.fechaPago)),
    montoTotal: p.montoTotal,
    pagado: Number(p.montoPagado),
    deuda: p.deuda,
    estado:
      p.estadoPago === "PAID"
        ? "Pagado"
        : p.estadoPago === "PARTIAL"
          ? "Parcial"
          : "Pendiente",
    metodo: p.metodoPago,
  }));
}

export const generarPagosPDF = async (filas: PagoExportarFila[]) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Reporte de Pagos", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    head: [["Paciente", "Fecha", "Total", "Pagado", "Deuda", "Estado", "Método"]],
    body: filas.map((f) => [
      f.pacienteNombre,
      f.fecha,
      `Bs. ${f.montoTotal}`,
      `Bs. ${f.pagado}`,
      `Bs. ${f.deuda}`,
      f.estado,
      f.metodo,
    ]),
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: "#008080" },
  });

  return doc;
};
