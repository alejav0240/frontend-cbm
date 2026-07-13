import { useQuery } from "@apollo/client/react";
import { OBTENER_ASIGNACIONES_FORMULARIO } from "./consultas";
import type {
  ObtenerAsignacionesFormularioQuery,
  ObtenerAsignacionesFormularioQueryVariables,
} from "@/shared/api/generated/graphql";
import { useMemo } from "react";

// 1. Definimos las interfaces de salida para que tu frontend mantenga un tipado impecable
export interface AsignacionNormalizada {
  id: string;
  templateId: string | undefined;
  assignedToRole: string;
  assignedAt: string;
  status: "Completado" | "Activo";
  patientName: string;
  originalData: any; // Mantenemos la referencia original por si la necesitas
}

export interface RespuestaFormNormalizada {
  id: string;
  assignmentId: string;
  templateId: string | undefined;
  submittedBy: string | undefined;
  patientName: string | undefined;
  submittedAt: string;
  status: "Revisado";
  answers: any[];
}

export const useAsignacionesFormulario = (patientId?: string) => {
  const { data, loading, error, refetch } = useQuery<
    ObtenerAsignacionesFormularioQuery,
    ObtenerAsignacionesFormularioQueryVariables
  >(OBTENER_ASIGNACIONES_FORMULARIO, {
    variables: { patientId },
    skip: !patientId,
    notifyOnNetworkStatusChange: true,
  });

  // 2. Unificamos el procesamiento en un solo useMemo supereficiente
  const { asignaciones, respuestasForm } = useMemo(() => {
    // IMPORTANTE: Ajusta 'formAssignments' al nombre real de tu propiedad de Query en el esquema GraphQL
    const rawAssignments = data?.formAssignments;

    if (!rawAssignments) {
      return { asignaciones: [], respuestasForm: [] };
    }

    const asignacionesList: AsignacionNormalizada[] = [];
    const respuestasList: RespuestaFormNormalizada[] = [];

    // Filtramos nulos del backend de golpe
    const cleanAssignments = rawAssignments.filter(
      (a): a is NonNullable<typeof a> => a !== null,
    );

    for (const a of cleanAssignments) {
      const tieneRespuestas = a.responses && a.responses.length > 0;

      // Manejo seguro de la fecha de asignación
      const fechaAsignacion = a.createdAt
        ? new Date(a.createdAt as string).toLocaleDateString()
        : "N/A";

      // A) Construimos la lista de asignaciones normalizadas
      asignacionesList.push({
        id: a.id,
        templateId: a.form?.id ?? undefined,
        assignedToRole: a.assignedTo?.fullName || "Paciente",
        assignedAt: fechaAsignacion,
        status: tieneRespuestas ? "Completado" : "Activo",
        patientName: a.patient?.fullName || "N/A",
        originalData: a,
      });

      // B) Si tiene respuestas, extraemos y normalizamos en la misma pasada
      if (tieneRespuestas && a.responses[0]) {
        const fechaRespuesta = a.responses[0].respondedAt
          ? new Date(a.responses[0].respondedAt as string).toLocaleDateString()
          : fechaAsignacion;

        respuestasList.push({
          id: a.id,
          assignmentId: a.id,
          templateId: a.form?.id ?? undefined,
          submittedBy: a.assignedTo?.fullName ?? undefined,
          patientName: a.patient?.fullName ?? undefined,
          submittedAt: fechaRespuesta,
          status: "Revisado",
          answers: [...a.responses], // Aseguramos inmutabilidad
        });
      }
    }

    return {
      asignaciones: asignacionesList,
      respuestasForm: respuestasList,
    };
  }, [data]);

  return {
    asignaciones,
    respuestaForm: respuestasForm,
    cargando: loading,
    error,
    refetch,
  };
};
