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
}

interface ResponseProgresoEscala {
  scaleEvaluations: ProgresoEscala[];
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
