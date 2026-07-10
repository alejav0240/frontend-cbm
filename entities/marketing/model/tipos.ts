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

export interface MarketingCampaign {
  id: string;
  name: string;
  platform: string;
  budget: number;
  spent: number;
  status: "Activo" | "Pausado" | "Finalizado";
  startDate: string;
  leadsCount: number;
}

export interface MarketingLead {
  id: number;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: "Nuevo" | "Contactado" | "Interesado" | "Convertido" | "Perdido";
  notes: string;
  createdAt: string | Date;
}
