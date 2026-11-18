import { CursoExportarFila } from "../model/dto";
import { descargarExcel } from "@/shared/lib/exportar-excel";

export const generarCursosExcel = async (
  filas: CursoExportarFila[],
  nombreArchivo = "reporte_cursos",
) => {
  const datos = filas.map((f) => ({
    Nombre: f.nombre,
    Descripción: f.descripcion,
    Precio: f.precio,
    Estudiantes: f.conteoEstudiantes,
    Ingresos: f.ingresosTotales,
    Estado: f.estado === "ACTIVE" ? "Activo" : "Cerrado",
  }));

  await descargarExcel(datos, "Cursos", nombreArchivo);
};
