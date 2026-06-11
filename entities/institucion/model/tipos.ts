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
