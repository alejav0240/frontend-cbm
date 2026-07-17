import { useQuery } from "@apollo/client/react";
import type {
  ObtenerRespuestasFormularioQuery,
  ObtenerRespuestasFormularioQueryVariables,
} from "@/shared/api/generated/graphql";
import { OBTENER_RESPUESTAS_FORMULARIO } from "@/entities/formulario/api/consultas";

// Definimos el tipo para una pregunta-respuesta normalizada
export interface PreguntaRespuesta {
  pregunta: string;
  respuesta: string;
}

export function useObtenerRespuestaFormulario({
  assignedToId,
  formId,
  patientId,
}: ObtenerRespuestasFormularioQueryVariables) {
  const { data, loading, error, refetch } = useQuery<
    ObtenerRespuestasFormularioQuery,
    ObtenerRespuestasFormularioQueryVariables
  >(OBTENER_RESPUESTAS_FORMULARIO, {
    variables: { assignedToId, formId, patientId },
    notifyOnNetworkStatusChange: true,
  });

  // Normalizar los datos: extraer preguntas y respuestas
  const preguntasNormalizadas: PreguntaRespuesta[] =
    data?.formAssignments?.results?.flatMap(
      (assignment) =>
        assignment?.responses?.map((response) => ({
          pregunta: response.question.question,
          respuesta: response.response,
        })) || [],
    ) || [];

  return {
    idAssigmente: data?.formAssignments?.results?.[0]?.id ?? null,
    preguntasNormalizadas, // Array plano de {pregunta, respuesta}
    cargando: loading,
    error,
    refetch,
  };
}
