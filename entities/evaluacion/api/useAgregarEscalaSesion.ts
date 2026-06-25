import { useMutation } from "@apollo/client/react";
import { ADD_SCALE_RESPONSE } from "./mutaciones";

interface SubscaleInput {
  subscaleId: string;
  score: number;
}

interface AgregarEscalaVariables {
  patientId: string;
  evaluatorId: string;
  scaleId: string;
  sessionId?: string | null;
  subscales?: SubscaleInput[] | null;
  valueId?: string | null;
}

export function useAgregarEscalaSesion() {
  const [mutation, { loading }] = useMutation(ADD_SCALE_RESPONSE);

  const agregarEscalaSesion = (variables: AgregarEscalaVariables) =>
    mutation({ variables });

  return { agregarEscalaSesion, agregando: loading };
}
