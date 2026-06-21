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
        notas: string;
    };
    sesiones: Array<{
        numero: number;
        fecha: string;
        terapeuta: string;
        duracion: string;
        estado: string;
        notas: string;
    }>;
    escalas?: Array<{
        nombre: string;
        etiqueta: string;
        puntuaciones: Array<{ sesion: string; valor: number | null }>;
    }>;
}
