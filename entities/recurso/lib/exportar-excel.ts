import { RecursoExportarFila } from "../model/dto";
import { descargarExcel } from "@/shared/lib/exportarExcel";

export const generarRecursosExcel = async (
  filas: RecursoExportarFila[],
  nombreArchivo = "reporte_recursos",
) => {
  const datos = filas.map((f) => ({
    ID: f.id,
    Título: f.titulo,
    Tipo: f.tipoMostrado || f.tipo,
    Categoría: f.categoria,
    URL: f.url,
  }));

  await descargarExcel(datos, "Recursos", `${nombreArchivo}_${Date.now()}.xlsx`);
};
