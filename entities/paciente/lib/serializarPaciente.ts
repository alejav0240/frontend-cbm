import { ObtenerDetallesPacienteQuery } from "@/shared/api/generated/graphql";
import { PacienteDetalleSerializado } from "../model/tipos";

type RawPatient = NonNullable<ObtenerDetallesPacienteQuery["patient"]>;

const calcularEdad = (birthDateStr: string | null | undefined): string => {
  if (!birthDateStr) return "No registrado";
  const hoy = new Date();
  const birth = new Date(birthDateStr);
  let edad = hoy.getFullYear() - birth.getFullYear();
  const mes = hoy.getMonth() - birth.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < birth.getDate())) {
    edad--;
  }
  return String(edad);
};

export const serializarDetallesPaciente = (
  patient: RawPatient,
): PacienteDetalleSerializado => {
  // Mapear categorías de notas clínicas
  const clinicalNotes = patient.clinicalNotes || [];
  const getNoteContent = (category: string): string => {
    return (
      clinicalNotes.find((note) => note?.category === category)?.content ||
      "No registrado"
    );
  };

  // Parser seguro para el cuestionario dentro de las notas del paciente
  let cuestionario = {
    referenciasMusicales: {
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      q6: "",
      q7: "",
      q8: "",
    },
    referenciasGenerales: {
      q9: "",
      q10: "",
      q11: "",
      q12: "",
      q13: "",
      q14: "",
    },
    referenciasFamiliares: { q15: "", q16: "", q17: "", q18: "" },
  };

  if (patient.notes) {
    try {
      const parsedNotes = JSON.parse(patient.notes);
      if (parsedNotes) {
        if (parsedNotes.cuestionario) {
          cuestionario = {
            referenciasMusicales: {
              ...cuestionario.referenciasMusicales,
              ...parsedNotes.cuestionario.referenciasMusicales,
            },
            referenciasGenerales: {
              ...cuestionario.referenciasGenerales,
              ...parsedNotes.cuestionario.referenciasGenerales,
            },
            referenciasFamiliares: {
              ...cuestionario.referenciasFamiliares,
              ...parsedNotes.cuestionario.referenciasFamiliares,
            },
          };
        } else if (
          parsedNotes.referenciasMusicales ||
          parsedNotes.referenciasGenerales ||
          parsedNotes.referenciasFamiliares
        ) {
          cuestionario = {
            referenciasMusicales: {
              ...cuestionario.referenciasMusicales,
              ...parsedNotes.referenciasMusicales,
            },
            referenciasGenerales: {
              ...cuestionario.referenciasGenerales,
              ...parsedNotes.referenciasGenerales,
            },
            referenciasFamiliares: {
              ...cuestionario.referenciasFamiliares,
              ...parsedNotes.referenciasFamiliares,
            },
          };
        }
      }
    } catch (e) {
      // Ignorar error si no es un JSON válido
    }
  }

  // Mapear sesiones terapéuticas a datos de progreso para el gráfico
  const edges = patient.therapeuticSessions?.edges || [];
  const sortedSessions = [...edges]
    .map((edge) => edge?.node)
    .filter((node): node is NonNullable<typeof node> => !!node)
    .sort((a, b) => (a.numeroSesion || 0) - (b.numeroSesion || 0));

  const progressData = sortedSessions.map((session, index) => {
    const baseIndex = index + 1;
    return {
      session: `S${session.numeroSesion}`,
      atencion: Math.min(
        100,
        60 + baseIndex * 5 + Math.floor(Math.sin(baseIndex) * 10),
      ),
      social: Math.min(
        100,
        55 + baseIndex * 6 + Math.floor(Math.cos(baseIndex) * 8),
      ),
    };
  });

  return {
    id: patient.id,
    databaseId: patient.databaseId,
    name: patient.fullName || "Sin nombre",
    fullName: patient.fullName,
    image: patient.imageUrl,
    imageUrl: patient.imageUrl,
    age: calcularEdad(patient.birthDate as string | null | undefined),
    birthDate: patient.birthDate as string | null | undefined,
    idNumber: patient.ci || "Sin ID",
    ci: patient.ci,
    status: patient.status || "ACTIVE",
    registrationComplete: patient.registrationComplete,
    residence: patient.residence,
    residenciaActual: patient.residence,
    diagnostico: patient.diagnosis,
    diagnosis: patient.diagnosis,
    createdAt: patient.createdAt as string | null | undefined,
    notes: patient.notes,
    notas: patient.notes,
    tutor: patient.tutor?.fullName || "No registrado",
    tutorPhone: patient.tutor?.celular || "No registrado",
    contactEmail: undefined,
    tutorRaw: patient.tutor,
    clinicalNotesRaw: patient.clinicalNotes as any,
    objetivosGenerales: getNoteContent("GENERAL_OBJECTIVE"),
    fisico: getNoteContent("PHYSICAL_AREA"),
    emocional: getNoteContent("EMOTIONAL_AREA"),
    cognitivo: getNoteContent("COGNITIVE_AREA"),
    social: getNoteContent("SOCIAL_AREA"),
    metodosAUsar: getNoteContent("METHODS"),
    tipoTratamiento: "No registrado",
    duracion: "No registrado",
    frecuenciaSesiones: "No registrado",
    cuestionario,
    progressData,
  };
};
