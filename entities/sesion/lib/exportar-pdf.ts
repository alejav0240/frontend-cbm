import { SesionExportarFila } from "../model/dto";

type ExportColumn = {
  key: keyof SesionExportarFila;
  label: string;
  formatter?: (value: unknown, row: SesionExportarFila) => string;
};

const columnasPorDefecto: ExportColumn[] = [
  { key: "numeroSesion", label: "#" },
  { key: "pacienteNombre", label: "Paciente" },
  { key: "fecha", label: "Fecha" },
  { key: "hora", label: "Hora" },
  { key: "terapeuta", label: "Terapeuta" },
  { key: "tipo", label: "Tipo" },
  { key: "estado", label: "Estado" },
  { key: "duracion", label: "Duración" },
];

export const generarSesionesPDF = async (
  filas: SesionExportarFila[],
  columnas: ExportColumn[] = columnasPorDefecto,
) => {
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
    head: [columnas.map((columna) => columna.label)],
    body: filas.map((fila) =>
      columnas.map((columna) => {
        const value =
          columna.key === "fecha"
            ? `${fila.fecha} ${fila.hora}`
            : fila[columna.key];
        return columna.formatter
          ? columna.formatter(value, fila)
          : String(value ?? "");
      }),
    ),
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: "#008080" },
  });

  return doc;
};

export const generarSesionesPDFPreview = async (
  filas: SesionExportarFila[],
  columnas?: ExportColumn[],
): Promise<Blob> => {
  const doc = await generarSesionesPDF(filas, columnas);
  return doc.output("blob");
};
