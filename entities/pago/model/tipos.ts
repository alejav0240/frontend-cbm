export interface Descuento {
  id: string;
  nombre: string;
  valor: string; // Revisar si cambiar a number en el futuro
  tipo: string;
  descripcion: string;
}

export interface Pago {
  id: string;
  cantidadSesiones: number;
  precioPorSesion: string;
  montoPagado: string;
  montoTotal: number;
  deuda: number;
  metodoPago: string;
  fechaPago: Date;
  estadoPago: string;
  paciente: {
    id: string;
    fullName: string;
  };
  descuento?: Descuento;
}

export interface PagoFiltros {
  pacienteId?: string;
  estadoPago?: string;
  busqueda?: string;
  pagina: number;
  pageSize: number;
}
