import { SesionExportarFila } from "../model/dto";
import { descargarExcel } from "@/shared/lib/exportar-excel";

type ExportColumn = {
  key: keyof SesionExportarFila;
  label: string;
  formatter?: (value: unknown, row: SesionExportarFila) => string;
};

const columnasPorDefecto: ExportColumn[] = [
  { key: "numeroSesion", label: "#" },
  { key: "pacienteNombre", label: "Paciente" },
  { key: "institucionNombre", label: "Institución" },
  { key: "fecha", label: "Fecha" },
  { key: "hora", label: "Hora" },
  { key: "terapeuta", label: "Terapeuta" },
  { key: "tipo", label: "Tipo" },
  { key: "estado", label: "Estado" },
  { key: "pago", label: "Pago" },
  { key: "duracion", label: "Duración" },
  { key: "notas", label: "Notas" },
];

export const generarSesionesExcel = async (
  filas: SesionExportarFila[],
  nombreArchivo = "reporte_sesiones",
  columnas: ExportColumn[] = columnasPorDefecto,
) => {
  const datos = filas.map((fila) =>
    Object.fromEntries(
      columnas.map((columna) => {
        const value =
          columna.key === "fecha"
            ? `${fila.fecha} ${fila.hora}`
            : fila[columna.key];
        return [
          columna.label,
          columna.formatter ? columna.formatter(value, fila) : (value ?? ""),
        ];
      }),
    ),
  );

  await descargarExcel(datos, "Sesiones", nombreArchivo);
};
