import { useMutation } from "@apollo/client/react";
import { CREATE_INTERVENTION_PLAN } from "@/modules/clinica/planes/graphql/mutations";
import { CreateInterventionPlanInput } from "@/modules/clinica/planes/schemas";

export function useCreatePlan(onCompleted?: () => void) {
  const [createPlanMutation, { loading: isCreating }] = useMutation(CREATE_INTERVENTION_PLAN, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const createPlan = (variables: CreateInterventionPlanInput) => createPlanMutation({ variables });

  return {
    createPlan,
    isCreating,
  };
}
