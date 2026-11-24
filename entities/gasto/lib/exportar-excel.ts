import { GastoExportarFila } from "../model/dto";
import { descargarExcel } from "@/shared/lib/exportarExcel";

export const generarGastosExcel = async (
  filas: GastoExportarFila[],
  nombreArchivo = "reporte_gastos",
) => {
  const datos = filas.map((f) => ({
    Descripción: f.descripcion,
    Categoría: f.categoria,
    Monto: f.monto,
    Fecha: f.fecha,
    Estado: f.estado === "PAID" ? "Pagado" : "Pendiente",
  }));

  await descargarExcel(datos, "Gastos", `${nombreArchivo}_${Date.now()}.xlsx`);
};
