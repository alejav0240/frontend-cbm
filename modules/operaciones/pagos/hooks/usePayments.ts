import { useSuspenseQuery } from "@apollo/client/react";
import { GET_PAYMENTS } from "@/modules/operaciones/pagos/graphql/queries";
import { paymentFilters, paymentResponse } from "@/modules/operaciones/pagos/types";

interface Props {
  filters: paymentFilters;
}

export function usePayments({ filters }: Props) {
  const { data, refetch } = useSuspenseQuery<paymentResponse>(GET_PAYMENTS, {
    variables: {
      patientId: filters.patientId,
      patientStatus: filters.paymentStatus,
      page: filters.page,
      pageSize: filters.pageSize,
      search: filters.search,
    },
  });

  return {
    payments: data?.payments?.objects ?? [],
    pagination: {
      totalCount: data?.payments?.totalCount ?? 0,
      totalPages: data?.payments?.totalPages ?? 0,
      currentPage: data?.payments?.currentPage ?? 1,
    },
    refetch,
  };
}
