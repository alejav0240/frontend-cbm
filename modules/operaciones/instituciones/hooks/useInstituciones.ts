'use client';

import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import {GET_INSTITUTIONS} from "@/modules/atencion/pacientes";
import {GET_GROUP_DETAIL, GET_INSTITUTION_DETAIL} from "@/modules/operaciones/instituciones/graphql/queries";
import {
    groupDetailsResponse,
    institucionDetails,
    institucionResponse
} from "@/modules/operaciones/instituciones/types";

export function useInstitutions() {
    const { data, loading, error, refetch } = useQuery<institucionResponse>(GET_INSTITUTIONS);
    const institutions = useMemo(() => data?.institutions || [], [data]);
    return { institutions, isLoading: loading, error, refetch };
}

export function useInstitutionDetail(id: string | null) {
    const { data, loading, error, refetch } = useQuery<institucionDetails>(GET_INSTITUTION_DETAIL, {
        variables: { id },
        skip: !id
    });
    const institution = useMemo(() => data?.institution || null, [data]);
    return { institution, isLoading: loading, error, refetch };
}

export function useGroupDetail(id: string | null) {
    const { data, loading, error, refetch } = useQuery<groupDetailsResponse>(GET_GROUP_DETAIL, {
        variables: { id },
        skip: !id
    });
    const group = useMemo(() => data?.institutionGroup || null, [data]);
    return { group, isLoading: loading, error, refetch };
}

export function useCreateInstitution() {
    
}
