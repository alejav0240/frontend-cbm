import { SesionExportarFila } from "../model/dto";

export const generarSesionesExcel = async (
  filas: SesionExportarFila[],
  nombreArchivo = "reporte_sesiones",
) => {
  const XLSX = await import("xlsx");

  const datos = filas.map((f) => ({
    "#": f.numeroSesion,
    Paciente: f.pacienteNombre,
    Institución: f.institucionNombre ?? "",
    Fecha: f.fecha,
    Hora: f.hora,
    Terapeuta: f.terapeuta,
    Tipo: f.tipo,
    Estado: f.estado,
    Pago: f.pago,
    Duración: f.duracion,
    Notas: f.notas ?? "",
  }));

  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sesiones");
  XLSX.writeFile(wb, `${nombreArchivo}_${Date.now()}.xlsx`);
};
