import { useMutation } from "@apollo/client/react";
import { 
  UPDATE_SESSION, 
  UPDATE_SESSION_PAYMENT,
  ADD_SESSION_RESOURCE
} from "@/modules/atencion/sesiones/graphql/mutation";

export function useUpdateSession(onCompleted?: () => void) {
  const [updateMutation, { loading: isUpdating }] = useMutation(UPDATE_SESSION, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const [updatePaymentMutation, { loading: isUpdatingPayment }] = useMutation(
    UPDATE_SESSION_PAYMENT,
    { 
      onCompleted: () => {
        if (onCompleted) onCompleted();
      } 
    },
  );

  const [addResourceMutation, { loading: isAddingResource }] = useMutation(
      ADD_SESSION_RESOURCE,
      { 
        onCompleted: () => {
          if (onCompleted) onCompleted();
        } 
      },
  )

  const updateSession = (variables: object) => updateMutation({ variables });
  const updatePayment = (id: string, paymentStatus: string) => 
    updatePaymentMutation({ variables: { id, paymentStatus } });
  const addResource = (variables: object) => addResourceMutation({ variables });

  return {
    updateSession,
    updatePayment,
    addResource,
    isUpdating,
    isUpdatingPayment,
    isAddingResource
  };
}
