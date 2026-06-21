import {useMutation} from "@apollo/client/react";
import {ASSIGN_FORM} from "./mutaciones";
import type {
    AssignFormMutation,
    AssignFormMutationVariables,
} from "@/shared/api/generated/graphql";

export function useAssignForm() {
    const [mutation, {loading, error, data}] = useMutation<
        AssignFormMutation,
        AssignFormMutationVariables
    >(ASSIGN_FORM);

    const assignForm = (variables: AssignFormMutationVariables) =>
        mutation({variables});

    return {
        assignForm,
        asignando: loading,
        error,
        data,
    };
}
