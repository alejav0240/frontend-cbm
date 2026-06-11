import {GET_INTERVENTION_PLANS} from "@/modules/clinica/planes/graphql/query";
import {useMutation, useQuery} from "@apollo/client/react";
import {PlanData, PlanFilters} from "@/modules/clinica/planes/types";
import {
    CREATE_INTERVENTION_PLAN, CREATE_STEP_PLAN,
    DELETE_INTERVENTION_PLAN, DELETE_STEP_PLAN,
    UPDATE_INTERVENTION_PLAN, UPDATE_STEP_PLAN, UPDATE_STEP_PROGRESS
} from "@/modules/clinica/planes/graphql/mutations";
import {
    CreateInterventionPlanInput,
    CreateStepPlanInput,
    UpdateInterventionPlanInput, UpdateStepPlanInput
} from "@/modules/clinica/planes/schemas";

interface Props {
    filters: PlanFilters
}

export function usePlanes({filters}: Props) {
    const { data: plansData, refetch: refetchPlans, loading: isLoadingPlans } = useQuery<PlanData>(GET_INTERVENTION_PLANS, {
        variables: {
            patientId: filters.patientId,
            search: filters.search || undefined,
            page: filters.page || 1,
            pageSize: filters.pageSize || 10,
        },
        notifyOnNetworkStatusChange: true
    });

    const [createPlan] = useMutation(CREATE_INTERVENTION_PLAN, { onCompleted: () => refetchPlans() });
    const [updatePlan] = useMutation(UPDATE_INTERVENTION_PLAN, { onCompleted: () => refetchPlans() });
    const [deletePlan] = useMutation(DELETE_INTERVENTION_PLAN, { onCompleted: () => refetchPlans() });

    const [createStep] = useMutation(CREATE_STEP_PLAN, { onCompleted: () => refetchPlans() });
    const [updateStep] = useMutation(UPDATE_STEP_PLAN, { onCompleted: () => refetchPlans() });
    const [deleteStep] = useMutation(DELETE_STEP_PLAN, { onCompleted: () => refetchPlans() });
    const [updateStepProgress] = useMutation(UPDATE_STEP_PROGRESS, { onCompleted: () => refetchPlans() });

    return {
        interventionPlans: plansData?.interventionPlans.results ?? [],
        totalPlansCount: plansData?.interventionPlans?.totalCount ?? 0,
        totalPlansPages: plansData?.interventionPlans?.totalPages ?? 0,
        currentPlansPage: plansData?.interventionPlans?.currentPage ?? 1,
        isLoadingPlans,
        createPlan: (variables: CreateInterventionPlanInput) => createPlan({ variables }),
        updatePlan: (variables: UpdateInterventionPlanInput) => updatePlan({ variables }),
        deletePlan: (id: string | number) => deletePlan({ variables: { id } }),
        createStep: (variables: CreateStepPlanInput) => createStep({ variables }),
        updateStep: (variables: UpdateStepPlanInput) => updateStep({ variables }),
        deleteStep: (id: string | number) => deleteStep({ variables: { id } }),
        updateStepProgress: (stepId: string | number, isCompleted: boolean) => updateStepProgress({ variables: { stepId, isCompleted } }),
        refetchPlans,
    }
}
