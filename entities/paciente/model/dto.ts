export interface PacienteExportarFila {
  id: string;
  nombre: string;
  cedula: string;
  diagnostico?: string;
  tutor?: string;
  telefonoTutor?: string;
  emailTutor?: string;
  fechaRegistro?: string;
  edad?: string;
  residencia?: string;
  status?: string;
}
