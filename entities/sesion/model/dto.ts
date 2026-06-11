export interface SesionExportarFila {
  id: string;
  numeroSesion: number;
  pacienteNombre: string;
  institucionNombre?: string;
  fecha: string;
  hora: string;
  terapeuta: string;
  tipo: string;
  estado: string;
  pago: string;
  duracion: string;
  notas?: string;
}
