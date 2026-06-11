import { useMutation } from "@apollo/client/react";
import { DELETE_STEP_PLAN } from "@/modules/clinica/planes/graphql/mutations";

export function useDeletePlanStep(onCompleted?: () => void) {
  const [deleteStepMutation, { loading: isDeleting }] = useMutation(DELETE_STEP_PLAN, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const deleteStep = (id: string | number) => deleteStepMutation({ variables: { id } });

  return {
    deleteStep,
    isDeleting,
  };
}
