import { useMutation } from "@apollo/client/react";
import { ASSIGN_FORM } from "@/modules/sistema/formularios/graphql/mutations";
import { AssignFormInput } from "@/modules/sistema/formularios/schemas";

export function useAssignForm(onCompleted?: () => void) {
  const [assignFormMutation, { loading: isAssigning }] = useMutation(ASSIGN_FORM, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const assignForm = (variables: AssignFormInput) => assignFormMutation({ variables });

  return {
    assignForm,
    isAssigning,
  };
}
