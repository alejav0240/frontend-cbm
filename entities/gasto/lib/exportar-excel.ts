import { GastoExportarFila } from "../model/dto";

export const generarGastosExcel = async (
  filas: GastoExportarFila[],
  nombreArchivo = "reporte_gastos",
) => {
  const XLSX = await import("xlsx");

  const datos = filas.map((f) => ({
    Descripción: f.descripcion,
    Categoría: f.categoria,
    Monto: f.monto,
    Fecha: f.fecha,
    Estado: f.estado === "PAID" ? "Pagado" : "Pendiente",
  }));

  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Gastos");
  XLSX.writeFile(wb, `${nombreArchivo}_${Date.now()}.xlsx`);
};
