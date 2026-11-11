import type { EvaluacionExportarFila } from "../model/dto";
import { descargarExcel } from "@/shared/lib/exportar-excel";

export const generarEvaluacionesExcel = async (
  filas: EvaluacionExportarFila[],
  nombreArchivo = "reporte_evaluaciones",
) => {
  const datos = filas.map((f) => ({
    Paciente: f.paciente,
    Escala: f.escala,
    Fecha: f.fecha,
    Tipo: f.tipo,
    Puntaje: f.puntaje ?? "",
    Dimensiones: f.dimensiones,
  }));

  await descargarExcel(datos, "Evaluaciones", nombreArchivo);
};
