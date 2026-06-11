export interface RecursoDigital {
  id: string;
  titulo: string;
  tipo: string;
  categoria: string;
  url: string;
  tipoMostrado: string;
}

export interface RecursoFiltros {
  tipo?: string;
  busqueda?: string;
  pagina: number;
  pageSize: number;
}
