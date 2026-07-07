import { PagoExportarFila } from "../model/dto";

export const generarPagosExcel = async (
  filas: PagoExportarFila[],
  nombreArchivo = "reporte_pagos",
) => {
  const XLSX = await import("xlsx");

  const datos = filas.map((f) => ({
    Paciente: f.pacienteNombre,
    Fecha: f.fecha,
    "Monto Total": f.montoTotal,
    Pagado: f.pagado,
    Deuda: f.deuda,
    Estado: f.estado,
    Método: f.metodo,
  }));

  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pagos");
  XLSX.writeFile(wb, `${nombreArchivo}_${Date.now()}.xlsx`);
};
