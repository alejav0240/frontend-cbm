import { ArticuloInventarioExportarFila } from "../model/dto";
import { descargarExcel } from "@/shared/lib/exportarExcel";

export const generarInventarioExcel = async (
  filas: ArticuloInventarioExportarFila[],
  nombreArchivo = "reporte_inventario",
) => {
  const datos = filas.map((f) => ({
    Nombre: f.nombre,
    Tipo: f.tipo,
    Condición: f.condicion,
    Aula: f.aula,
    Estado: f.estadoMostrado,
  }));

  await descargarExcel(
    datos,
    "Inventario",
    `${nombreArchivo}_${Date.now()}.xlsx`,
  );
};
