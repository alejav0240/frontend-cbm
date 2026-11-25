import { PagoExportarFila } from "../model/dto";
import { descargarExcel } from "@/shared/lib/exportarExcel";

export const generarPagosExcel = async (
  filas: PagoExportarFila[],
  nombreArchivo = "reporte_pagos",
) => {
  const datos = filas.map((f) => ({
    Paciente: f.pacienteNombre,
    Fecha: f.fecha,
    "Monto Total": f.montoTotal,
    Pagado: f.pagado,
    Deuda: f.deuda,
    Estado: f.estado,
    Método: f.metodo,
  }));

  await descargarExcel(datos, "Pagos", `${nombreArchivo}_${Date.now()}.xlsx`);
};
