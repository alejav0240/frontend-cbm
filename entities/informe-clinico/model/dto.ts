export interface InformeClinicoDTO {
  paciente: {
    nombre: string;
    cedula: string;
    edad: string;
    diagnostico: string;
    residencia: string;
    tutor: string;
    telefono: string;
    objetivosGenerales: string;
    fisico: string;
    emocional: string;
    cognitivo: string;
    social: string;
    metodosAUsar: string;
    tipoTratamiento?: string;
    duracion?: string;
    frecuenciaSesiones?: string;
    notas: string;
    cuestionario?: Array<{ pregunta: string; respuesta: string }>;
    notasClinicas?: Array<{ categoria: string; contenido: string }>;
  };
  sesiones: Array<{
    numero: number;
    fecha: string;
    terapeuta: string;
    duracion: string;
    estado: string;
    ciclo: number;
    notas: string;
    recursos: string[];
    materiales: string[];
    evaluaciones: Array<{
      escala: string;
      puntuacion: number | null;
      subescalas: Array<{
        nombre: string;
        categoria: string;
        puntuacion: number;
      }>;
      valores: Array<{ label: string; value: number }>;
    }>;
  }>;
  escalas: Array<{
    id: string;
    nombre: string;
    etiqueta: string;
    color: string;
    puntuaciones: Array<{ sesion: string; valor: number | null }>;
    detalle: Array<{
      fecha: string;
      total: number | null;
      subescalas: Array<{
        nombre: string;
        categoria: string;
        puntuacion: number;
      }>;
      valores: Array<{ label: string; value: number }>;
    }>;
  }>;
}
