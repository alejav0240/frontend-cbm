export interface Gasto {
  id: string;
  descripcion: string;
  categoria: string;
  monto: number;
  fechaGasto: Date;
  estado: string;
}

export interface GastoFiltros {
  estado?: string;
  categoria?: string;
}
