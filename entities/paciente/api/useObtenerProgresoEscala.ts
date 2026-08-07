import { useQuery } from "@apollo/client/react";
import { OBTENER_PROGRESO_DE_ESCALA } from "@/entities/paciente";

interface PropsEscala {
  patientId: string;
  escalaId: string;
}

export interface ProgresoEscala {
  evaluatedAt: string;
  totalScore: number;
  inSession: boolean;
  id: string;
  scale?: { id: string; name: string; scaleType?: string | null } | null;
  subscaleResponses?: Array<{
    id: string;
    score: number;
    subscale?: {
      id?: string;
      name: string;
      category?: string | null;
      maxValue?: number | null;
    } | null;
  } | null> | null;
  valueResponses?: Array<{
    id: string;
    scaleValue?: { id: string; label: string; value: number } | null;
  } | null> | null;
}

interface ResponseProgresoEscala {
  scaleEvaluations: { results: ProgresoEscala[] };
}

export function useObtenerProgresoEscala({ patientId, escalaId }: PropsEscala) {
  const { data, loading, error, refetch } = useQuery<ResponseProgresoEscala>(
    OBTENER_PROGRESO_DE_ESCALA,
    {
      variables: {
        patientId: patientId,
        scaleId: escalaId,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  return {
    data: data,
    loading,
    error,
    refetch,
  };
}
