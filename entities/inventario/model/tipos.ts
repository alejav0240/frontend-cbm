export interface ArticuloInventario {
  id: string;
  nombre: string;
  tipo: string;
  condicion: string;
  estado: string;
  aula: string;
  estadoMostrado: string;
}

export interface InventarioFiltros {
  estado?: string;
  tipo?: string;
  pagina?: number;
  pageSize?: number;
}
