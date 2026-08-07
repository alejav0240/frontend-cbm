export interface EscalaTarjeta {
  id: string;
  nombre: string;
  descripcion?: string | null;
  tipoEscala: string;
  subescalas?: Array<{
    id: string;
    nombre?: string | null;
    valorMaximo?: number | null;
    description?: string | null;
  }> | null;
  valores?: Array<{
    id: string;
    etiqueta?: string | null;
    valor?: number | null;
  }> | null;
}
