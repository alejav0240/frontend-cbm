import { useMutation } from "@apollo/client/react";
import { UPDATE_STEP_PLAN } from "@/modules/clinica/planes/graphql/mutations";
import { UpdateStepPlanInput } from "@/modules/clinica/planes/schemas";

export function useUpdatePlanStep(onCompleted?: () => void) {
  const [updateStepMutation, { loading: isUpdating }] = useMutation(UPDATE_STEP_PLAN, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const updateStep = (variables: UpdateStepPlanInput) => updateStepMutation({ variables });

  return {
    updateStep,
    isUpdating,
  };
}
