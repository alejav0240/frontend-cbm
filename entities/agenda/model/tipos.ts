export interface EventoAgenda {
  id: string;
  titulo: string;
  inicio: Date;
  fin: Date;
  tipo: "SESION" | "CITA" | "OTRO";
  descripcion?: string;
  pacienteId?: string;
  terapeutaId?: string;
}
