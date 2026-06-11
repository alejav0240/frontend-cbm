import { useQuery } from "@apollo/client/react";
import { GET_INTERVENTION_PLANS } from "@/modules/clinica/planes/graphql/query";
import { PlanData, PlanFilters } from "@/modules/clinica/planes/types";

interface Props {
  filters: PlanFilters;
}

export function usePlanes({ filters }: Props) {
  const { data, refetch, loading } = useQuery<PlanData>(GET_INTERVENTION_PLANS, {
    variables: {
      patientId: filters.patientId,
      search: filters.search || undefined,
      page: filters.page || 1,
      pageSize: filters.pageSize || 10,
    },
    notifyOnNetworkStatusChange: true
  });

  return {
    interventionPlans: data?.interventionPlans.results ?? [],
    totalPlansCount: data?.interventionPlans?.totalCount ?? 0,
    totalPlansPages: data?.interventionPlans?.totalPages ?? 0,
    currentPlansPage: data?.interventionPlans?.currentPage ?? 1,
    isLoadingPlans: loading,
    refetchPlans: refetch,
  };
}
