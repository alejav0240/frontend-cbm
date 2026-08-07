import type { EvaluacionExportarFila } from "../model/dto";

export const generarEvaluacionesExcel = async (
  filas: EvaluacionExportarFila[],
  nombreArchivo = "reporte_evaluaciones",
) => {
  const XLSX = await import("xlsx");

  const datos = filas.map((f) => ({
    Paciente: f.paciente,
    Escala: f.escala,
    Fecha: f.fecha,
    Tipo: f.tipo,
    Puntaje: f.puntaje ?? "",
    Dimensiones: f.dimensiones,
  }));

  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Evaluaciones");
  XLSX.writeFile(wb, `${nombreArchivo}_${Date.now()}.xlsx`);
};
