import { useMutation } from "@apollo/client/react";
import { DELETE_SESSION } from "@/modules/atencion/sesiones/graphql/mutation";

export function useDeleteSession(onCompleted?: () => void) {
  const [deleteMutation, { loading: isDeleting }] = useMutation(DELETE_SESSION, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const deleteSession = (id: string) => deleteMutation({ variables: { id } });

  return {
    deleteSession,
    isDeleting,
  };
}
