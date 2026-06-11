import {
    CREATE_DISCOUNT,
    CREATE_PAYMENT,
    DELETE_PAYMENT, UPDATE_DISCOUNT,
    UPDATE_PAYMENT
} from "@/modules/operaciones/pagos/graphql/mutations";
import {useMutation, useSuspenseQuery} from "@apollo/client/react";
import {GET_DISCOUNTS, GET_PAYMENTS} from "@/modules/operaciones/pagos/graphql/queries";
import {discountResponse, paymentFilters, paymentResponse} from "@/modules/operaciones/pagos/types";
import {
    CreateDiscountInput,
    CreatePaymentInput,
    UpdateDiscountInput,
    UpdatePaymentInput
} from "@/modules/operaciones/pagos/schemas";

interface Props {
    filters: paymentFilters
}

export function usePago({filters}: Props) {

    const { data: paymentsData, refetch: refetchPayments } = useSuspenseQuery<paymentResponse>(GET_PAYMENTS, {
        variables: {
            patientId:filters.patientId,
            patientStatus:filters.paymentStatus,
            page: filters.page,
            pageSize: filters.pageSize,
            search: filters.search,
        },
    });


    const { data: discountsData, refetch: refetchDisccounts } = useSuspenseQuery<discountResponse>(GET_DISCOUNTS);

    const [createPayment] = useMutation(CREATE_PAYMENT, { onCompleted: () => refetchPayments() });
    const [updatePayment] = useMutation(UPDATE_PAYMENT, { onCompleted: () => refetchPayments() });
    const [deletePayment] = useMutation(DELETE_PAYMENT, { onCompleted: () => refetchPayments() });

    const [createDiscount] = useMutation(CREATE_DISCOUNT, { onCompleted: () => refetchDisccounts()});
    const [updateDiscount] = useMutation(UPDATE_DISCOUNT, {onCompleted: () => refetchDisccounts()});

    return{
        payments: paymentsData?.payments?.objects ?? [],
        pagination: {
            totalCount: paymentsData?.payments?.totalCount ?? 0,
            totalPages: paymentsData?.payments?.totalPages ?? 0,
            currentPage: paymentsData?.payments?.currentPage ?? 1,
        },
        discounts: discountsData?.discounts ?? [],
        createPayment: (variables: CreatePaymentInput) => createPayment({ variables }),
        updatePayment: (variables: UpdatePaymentInput) => updatePayment({ variables }),
        deletePayment: (id: string | number) => deletePayment({ variables: { id } }),
        createDiscount: (variables: CreateDiscountInput) => createDiscount({ variables }),
        updateDiscount: (variables: UpdateDiscountInput) => updateDiscount({ variables }),
        refetchPayments,
        refetchDisccounts
    }

}