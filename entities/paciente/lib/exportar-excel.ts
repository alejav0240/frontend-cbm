import { PacienteExportarFila } from "../model/dto";
import { descargarExcel } from "@/shared/lib/exportarExcel";

export const generarPacientesExcel = async (
  filas: PacienteExportarFila[],
  nombreArchivo = "reporte_pacientes",
) => {
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

  await descargarExcel(
    datos,
    "Pacientes",
    `${nombreArchivo}_${Date.now()}.xlsx`,
  );
};
