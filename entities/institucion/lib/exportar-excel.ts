import { InstitucionExportarFila } from "../model/dto";

export const generarInstitucionesExcel = async (
  filas: InstitucionExportarFila[],
  nombreArchivo = "reporte_instituciones",
) => {
  const XLSX = await import("xlsx");

  const datos = filas.map((f) => ({
    Nombre: f.nombre,
    Dirección: f.direccion,
    Contacto: f.nombreContacto,
    Email: f.emailContacto,
    Teléfono: f.telefonoContacto,
    "Cant. Grupos": f.cantidadGrupos,
  }));

  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Instituciones");
  XLSX.writeFile(wb, `${nombreArchivo}_${Date.now()}.xlsx`);
};
