import { CursoExportarFila } from "../model/dto";

export const generarCursosExcel = async (
  filas: CursoExportarFila[],
  nombreArchivo = "reporte_cursos",
) => {
  const XLSX = await import("xlsx");

  const datos = filas.map((f) => ({
    Nombre: f.nombre,
    Descripción: f.descripcion,
    Precio: f.precio,
    Estudiantes: f.conteoEstudiantes,
    Ingresos: f.ingresosTotales,
    Estado: f.estado === "ACTIVE" ? "Activo" : "Cerrado",
  }));

  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Cursos");
  XLSX.writeFile(wb, `${nombreArchivo}_${Date.now()}.xlsx`);
};
