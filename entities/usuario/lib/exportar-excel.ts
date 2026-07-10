import { UsuarioExportarFila } from "../model/dto";

export const generarUsuariosExcel = async (
  filas: UsuarioExportarFila[],
  nombreArchivo = "reporte_usuarios",
) => {
  const XLSX = await import("xlsx");

  const datos = filas.map((f) => ({
    Nombre: f.nombre,
    Carnet: f.carnet,
    Email: f.email,
    Celular: f.celular,
    Rol: f.rol,
    Estado: f.estado,
    Visibilidad: f.visibilidad,
    Usuario: f.username,
    "Fecha Registro": f.fechaRegistro ?? "",
  }));

  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
  XLSX.writeFile(wb, `${nombreArchivo}_${Date.now()}.xlsx`);
};
