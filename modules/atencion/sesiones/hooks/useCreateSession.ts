import { useMutation } from "@apollo/client/react";
import { CREATE_SESSION } from "@/modules/atencion/sesiones/graphql/mutation";

export function useCreateSession(onCompleted?: () => void) {
  const [createMutation, { loading: isCreating }] = useMutation(
    CREATE_SESSION,
    { 
      onCompleted: () => {
        if (onCompleted) onCompleted();
      } 
    },
  );

  const addSession = (variables: object) => createMutation({ variables });

  return {
    addSession,
    isCreating,
  };
}
