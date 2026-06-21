import { useQuery } from "@apollo/client/react";
import { OBTENER_PROGRESO_SUBESCALA } from "@/entities/paciente";

interface PropsEscala {
  patientId: string;
  escalaId: string;
}

type subEscalaResponse = {
  id: string;
  score: number;
  subscale: { name: string; category: string };
};

export interface ProgresoSubEscala {
  evaluatedAt: string;
  totalScore: number;
  inSession: boolean;
  id: string;
  subscaleResponses: subEscalaResponse[];
}

interface ResponseProgresoSubEscala {
  scaleEvaluations: ProgresoSubEscala[];
}

export function useObtenerProgresoSubEscala({
  patientId,
  escalaId,
}: PropsEscala) {
  const { data, loading, error, refetch } = useQuery<ResponseProgresoSubEscala>(
    OBTENER_PROGRESO_SUBESCALA,
    {
      variables: {
        patientId: patientId,
        scaleId: escalaId,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  return {
    data: data?.scaleEvaluations,
    loading,
    error,
    refetch,
  };
}
