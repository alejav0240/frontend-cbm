import { PacienteExportarFila } from "../model/dto";

export const generarPacientesExcel = async (
  filas: PacienteExportarFila[],
  nombreArchivo = "reporte_pacientes"
) => {
  const XLSX = await import("xlsx");
  
  const datos = filas.map((f) => ({
    "ID / Carnet": f.cedula || f.id,
    Nombre: f.nombre,
    Diagnóstico: f.diagnostico ?? "",
    Estado: f.estado,
    Tutor: f.tutor ?? "",
    "Teléfono Tutor": f.telefonoTutor ?? "",
    "Fecha Registro": f.fechaRegistro ?? "",
  }));

  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pacientes");
  XLSX.writeFile(wb, `${nombreArchivo}_${Date.now()}.xlsx`);
};
