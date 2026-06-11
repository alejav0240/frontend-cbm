export interface Usuario {
  id: string;
  username: string;
  email: string;
  fullName: string;
  isStaff: boolean;
  isActive: boolean;
  celular: number;
  status: boolean;
  foto: string;
  ci: number;
  rol: {
    id: string;
    nombre: string;
  };
}

export interface UsuarioFiltros {
  pagina: number;
  pageSize: number;
  busqueda?: string;
  nombreRol?: string;
  excluirRol?: string;
}
