import { useMutation } from "@apollo/client/react";
import { UPDATE_STEP_PROGRESS } from "@/modules/clinica/planes/graphql/mutations";

export function useUpdatePlanStepProgress(onCompleted?: () => void) {
  const [updateStepProgressMutation, { loading: isUpdating }] = useMutation(UPDATE_STEP_PROGRESS, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const updateStepProgress = (stepId: string | number, isCompleted: boolean) => 
    updateStepProgressMutation({ variables: { stepId, isCompleted } });

  return {
    updateStepProgress,
    isUpdating,
  };
}
