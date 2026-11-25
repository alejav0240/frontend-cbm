import { InstitucionExportarFila } from "../model/dto";
import { descargarExcel } from "@/shared/lib/exportar-excel";

export const generarInstitucionesExcel = async (
  filas: InstitucionExportarFila[],
  nombreArchivo = "reporte_instituciones",
) => {
  const datos = filas.map((f) => ({
    Nombre: f.nombre,
    Dirección: f.direccion,
    Contacto: f.nombreContacto,
    Email: f.emailContacto,
    Teléfono: f.telefonoContacto,
    "Cant. Grupos": f.cantidadGrupos,
  }));

  await descargarExcel(datos, "Instituciones", nombreArchivo);
};
