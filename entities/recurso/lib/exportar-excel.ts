import { RecursoExportarFila } from "../model/dto";

export const generarRecursosExcel = async (
  filas: RecursoExportarFila[],
  nombreArchivo = "reporte_recursos",
) => {
  const XLSX = await import("xlsx");

  const datos = filas.map((f) => ({
    ID: f.id,
    Título: f.titulo,
    Tipo: f.tipoMostrado || f.tipo,
    Categoría: f.categoria,
    URL: f.url,
  }));

  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Recursos");
  XLSX.writeFile(wb, `${nombreArchivo}_${Date.now()}.xlsx`);
};
