import { useMutation } from "@apollo/client/react";
import { SUBMIT_FULL_FORM } from "@/modules/sistema/formularios/graphql/mutations";
import { SubmitFullFormInput } from "@/modules/sistema/formularios/schemas";

export function useSubmitFullForm(onCompleted?: () => void) {
  const [submitFullFormMutation, { loading: isSubmitting }] = useMutation(SUBMIT_FULL_FORM, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const submitFullForm = (variables: SubmitFullFormInput) => submitFullFormMutation({ variables });

  return {
    submitFullForm,
    isSubmitting,
  };
}
