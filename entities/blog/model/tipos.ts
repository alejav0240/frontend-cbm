export interface PostBlog {
  id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  categoria: string;
  autor: string;
  urlImagen?: string;
  tiempoLectura: string;
  estado: string;
  fechaCreacion: Date;
}
