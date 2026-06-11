export interface Sesion {
  id: string;
  fechaCreacion: Date;
  duracionMinutos: number;
  numeroCiclo: number;
  notas: string[];
  estadoPago: string;
  estadoPagoMostrado: string;
  fechaSesion: Date;
  numeroSesion: number;
  estadoSesion: string;
  tipoSesion: string;
  tipoSesionMostrado: string;
  videoUrl?: string;
  grupo?: {
    id: string;
    descripcion: string;
    nombre: string;
    institucion: { nombre: string };
  };
  paciente?: { id: string; fullName: string };
  terapeuta: { fullName: string };
}

export interface SesionNormalizada {
  id: string;
  pacienteId: string | null;
  pacienteNombre: string;
  institucionNombre?: string;
  numeroSesion: number;
  fecha: string;
  hora: string;
  estado: string;
  estadoMostrado: string;
  pago: string;
  pagoMostrado: string;
  duracion: string;
  terapeuta: string;
  tipo: string;
  notas: string;
  urlGrabacion?: string;
}

export interface SesionFiltros {
  pacienteId?: string;
  estadoPago?: string;
  estadoSesion?: string;
  terapeutaId?: string;
  tipoSesion?: string;
}
