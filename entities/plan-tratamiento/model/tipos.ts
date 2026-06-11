export interface PasoPlan {
  id: string;
  momento: string;
  duracionMinutos: number;
  objetivo: string;
  enfoque: string;
  recursosMusicales: string;
  enfasisMusical: string;
  abordaje: string;
  metodoMlt: string;
  indiceOrden: number;
  estaCompletado: boolean;
}

export interface PlanTratamiento {
  id: string;
  objetivoPrincipal: string;
  fechaInicio: string;
  fechaFin?: string;
  porcentajeProgreso: number;
  estado: string;
  paciente: {
    id: string;
    fullName: string;
  };
  pasos: PasoPlan[];
}

export interface PlanFiltros {
  pagina: number;
  pageSize: number;
  pacienteId?: string;
  busqueda?: string;
}
