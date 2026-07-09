export interface GrupoInstitucion {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface Institucion {
  id: string;
  nombre: string;
  direccion: string;
  nombreContacto: string;
  emailContacto: string;
  telefonoContacto: string;
  grupos: GrupoInstitucion[];
}

export interface SesionGrupo {
  id: string;
  numeroSesion: number;
  fechaSesion: string;
  estadoSesion: string;
  estadoPago: string;
  duracionMinutos: number | null;
  terapeuta: { fullName: string | null } | null;
  notas: string | null;
}

export interface DetalleGrupo {
  id: string;
  nombre: string;
  descripcion: string | null;
  sesiones: SesionGrupo[];
}

export interface DetalleInstitucion extends Institucion {
  grupos: (GrupoInstitucion & { descripcion?: string })[];
}
