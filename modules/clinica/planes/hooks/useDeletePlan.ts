import { useMutation } from "@apollo/client/react";
import { DELETE_INTERVENTION_PLAN } from "@/modules/clinica/planes/graphql/mutations";

export function useDeletePlan(onCompleted?: () => void) {
  const [deletePlanMutation, { loading: isDeleting }] = useMutation(DELETE_INTERVENTION_PLAN, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const deletePlan = (id: string | number) => deletePlanMutation({ variables: { id } });

  return {
    deletePlan,
    isDeleting,
  };
}
