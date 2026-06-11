import { useMutation } from "@apollo/client/react";
import { CREATE_STEP_PLAN } from "@/modules/clinica/planes/graphql/mutations";
import { CreateStepPlanInput } from "@/modules/clinica/planes/schemas";

export function useCreatePlanStep(onCompleted?: () => void) {
  const [createStepMutation, { loading: isCreating }] = useMutation(CREATE_STEP_PLAN, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const createStep = (variables: CreateStepPlanInput) => createStepMutation({ variables });

  return {
    createStep,
    isCreating,
  };
}
