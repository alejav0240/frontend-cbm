import { useMutation } from "@apollo/client/react";
import { SUBMIT_FULL_FORM } from "./mutaciones";

interface ResponseInput {
  questionId: string;
  responseText: string;
}

interface SubmitFullFormVariables {
  assignmentId: string;
  responses: ResponseInput[];
}

export function useSubmitFullForm() {
  const [mutation, { loading, error, data }] = useMutation(SUBMIT_FULL_FORM);

  const submitFullForm = (variables: SubmitFullFormVariables) =>
    mutation({ variables });

  return {
    submitFullForm,
    enviando: loading,
    error,
    data,
  };
}
