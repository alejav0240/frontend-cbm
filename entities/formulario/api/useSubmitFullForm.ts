import {useMutation} from "@apollo/client/react";
import {SUBMIT_FULL_FORM} from "./mutaciones";
import type {
    SubmitFullFormMutation,
    SubmitFullFormMutationVariables,
} from "@/shared/api/generated/graphql";

export function useSubmitFullForm() {
    const [mutation, {loading, error, data}] = useMutation<
        SubmitFullFormMutation,
        SubmitFullFormMutationVariables
    >(SUBMIT_FULL_FORM);

    const submitFullForm = (variables: SubmitFullFormMutationVariables) =>
        mutation({variables});

    return {
        submitFullForm,
        enviando: loading,
        error,
        data,
    };
}
