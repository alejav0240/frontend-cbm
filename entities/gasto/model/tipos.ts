export interface Gasto {
  id: string;
  descripcion: string;
  categoria: string;
  monto: string;
  fechaGasto: string;
  estado: string;
}

export interface GastoFiltros {
  estado?: string;
  categoria?: string;
}
