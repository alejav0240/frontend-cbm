import { useMutation } from "@apollo/client/react";
import { ELIMINAR_ESCALA, useEscalas } from "@/entities/escalas";

export function useEliminarEscala() {
  const { refetch } = useEscalas();
  const [mutation, { loading: eliminando }] = useMutation<
    { deleteScale: { success: boolean | null } },
    { id: string }
  >(ELIMINAR_ESCALA, {
    onCompleted: () => refetch(),
  });

  const eliminarEscala = (id: string) => mutation({ variables: { id } });

  return { eliminarEscala, eliminando };
}
