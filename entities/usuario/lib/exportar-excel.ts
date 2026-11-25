import { UsuarioExportarFila } from "../model/dto";
import { descargarExcel } from "@/shared/lib/exportarExcel";

export const generarUsuariosExcel = async (
  filas: UsuarioExportarFila[],
  nombreArchivo = "reporte_usuarios",
) => {
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

  await descargarExcel(
    datos,
    "Usuarios",
    `${nombreArchivo}_${Date.now()}.xlsx`,
  );
};
