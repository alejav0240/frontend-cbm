export interface CampanaMarketing {
  id: string;
  nombre: string;
  plataforma: string;
  estado: string;
  presupuesto: number;
  gastado: number;
  presupuestoRestante: number;
  conteoLeads: number;
}

export interface Lead {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  estado: string;
  fechaCreacion: Date;
  campana?: {
    id: string;
    nombre: string;
  };
}
