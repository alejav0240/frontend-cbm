import { ArticuloInventarioExportarFila } from "../model/dto";

export const generarInventarioExcel = async (
  filas: ArticuloInventarioExportarFila[],
  nombreArchivo = "reporte_inventario",
) => {
  const XLSX = await import("xlsx");

  const datos = filas.map((f) => ({
    Nombre: f.nombre,
    Tipo: f.tipo,
    Condición: f.condicion,
    Aula: f.aula,
    Estado: f.estadoMostrado,
  }));

  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inventario");
  XLSX.writeFile(wb, `${nombreArchivo}_${Date.now()}.xlsx`);
};
