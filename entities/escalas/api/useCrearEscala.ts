import { useMutation } from "@apollo/client/react";
import { CREAR_ESCALA, useEscalas } from "@/entities/escalas";

interface SubscaleInput {
  name: string;
  maxValue: number;
  description?: string | null;
}

interface ScaleValueInput {
  label: string;
  value: number;
}

interface CrearEscalaVariables {
  name: string;
  scaleType: string;
  description?: string | null;
  subscales?: SubscaleInput[] | null;
  values?: ScaleValueInput[] | null;
}

export function useCrearEscala() {
  const { refetch } = useEscalas();
  const [mutation, { loading: creando }] = useMutation<
    { createScale: { scale: { id: string } } },
    CrearEscalaVariables
  >(CREAR_ESCALA, {
    onCompleted: () => refetch(),
  });

  const crearEscala = (variables: CrearEscalaVariables) =>
    mutation({ variables });

  return { crearEscala, creando };
}
