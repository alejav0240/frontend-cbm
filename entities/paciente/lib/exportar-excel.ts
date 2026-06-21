import { PacienteExportarFila } from "../model/dto";

export const generarPacientesExcel = async (
  filas: PacienteExportarFila[],
  nombreArchivo = "reporte_pacientes",
) => {
  const XLSX = await import("xlsx");

  const datos = filas.map((f) => ({
    "ID / Carnet": f.cedula || f.id,
    Nombre: f.nombre,
    Edad: f.edad ?? "",
    Diagnóstico: f.diagnostico ?? "",
    Residencia: f.residencia ?? "",
    Tutor: f.tutor ?? "",
    "Teléfono Tutor": f.telefonoTutor ?? "",
    "Email Tutor": f.emailTutor ?? "",
    "Fecha Registro": f.fechaRegistro ?? "",
  }));

  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pacientes");
  XLSX.writeFile(wb, `${nombreArchivo}_${Date.now()}.xlsx`);
};
