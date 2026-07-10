export interface Usuario {
  id: string;
  username: string;
  email: string;
  fullName: string;
  isStaff: boolean;
  isActive: boolean;
  celular: string;
  status: string;
  foto: string;
  ci: string;
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
