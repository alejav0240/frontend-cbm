export interface PacienteExportarFila {
  id: string;
  nombre: string;
  cedula: string;
  diagnostico?: string;
  estado: string;
  tutor?: string;
  telefonoTutor?: string;
  fechaRegistro?: string;
}
