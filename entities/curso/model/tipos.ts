export interface Curso {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: string;
  conteoEstudiantes: number;
  ingresosTotales: number;
}

export interface InscripcionCurso {
  id: string;
  nombreCompleto: string;
  carnet: string;
  fechaInscripcion: Date;
  pago: {
    id: string;
    monto: number;
    metodoPago: string;
    estadoPago: string;
  };
}
