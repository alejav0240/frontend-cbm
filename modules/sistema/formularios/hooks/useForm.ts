import {useMutation, useSuspenseQuery} from "@apollo/client/react";
import {GET_FORM_ASSIGNMENTS, GET_FORMS} from "@/modules/sistema/formularios/graphql/queries";
import {FormAsignment, FormDataResponse, FormFilter} from "@/modules/sistema/formularios/types";
import {ASSIGN_FORM, CREATE_FORM, DELETE_FORM, SUBMIT_FULL_FORM} from "@/modules/sistema/formularios/graphql/mutations";
import {AssignFormInput, CreateFormInput, SubmitFullFormInput} from "@/modules/sistema/formularios/schemas";

interface Props {
    filters: FormFilter;
}

export function useForm({filters}:Props) {

    const { data: formsData, refetch: refetchForms } = useSuspenseQuery<FormDataResponse>(GET_FORMS);

    const { data: assignmentsData, refetch: refetchAssignments } = useSuspenseQuery<FormAsignment>(GET_FORM_ASSIGNMENTS, {
        variables: {
            search:filters.search,
        },
    });

    const [submitFullForm, { loading: isSubmittingForm }] = useMutation(SUBMIT_FULL_FORM, {
        onCompleted: () => { refetchAssignments(); }
    });

    const [createForm, { loading: isCreatingForm }] = useMutation(CREATE_FORM, {
        onCompleted: () => refetchForms()
    });

    const [deleteForm] = useMutation(DELETE_FORM, {
        onCompleted: () => refetchForms()
    });

    const [assignForm, { loading: isAssigningForm }] = useMutation(ASSIGN_FORM, {
        onCompleted: () => refetchAssignments()
    });

    return {
        forms: formsData?.forms ?? [],
        submitFullForm: (variables: SubmitFullFormInput) => submitFullForm({ variables }),
        createForm: (variables: CreateFormInput) => createForm({ variables }),
        deleteForm: (id: string | number) => deleteForm({ variables: { id } }),
        assignForm: (variables: AssignFormInput) => assignForm({ variables }),
        refetchForms,
        refetchAssignments,
        isLoading: isSubmittingForm || isCreatingForm || isAssigningForm
    };
}