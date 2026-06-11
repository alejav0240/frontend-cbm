import { useMutation } from "@apollo/client/react";
import { UPDATE_INTERVENTION_PLAN } from "@/modules/clinica/planes/graphql/mutations";
import { UpdateInterventionPlanInput } from "@/modules/clinica/planes/schemas";

export function useUpdatePlan(onCompleted?: () => void) {
  const [updatePlanMutation, { loading: isUpdating }] = useMutation(UPDATE_INTERVENTION_PLAN, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const updatePlan = (variables: UpdateInterventionPlanInput) => updatePlanMutation({ variables });

  return {
    updatePlan,
    isUpdating,
  };
}
