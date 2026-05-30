import { useQuery } from '@apollo/client/react';
import { GET_GROWTH } from '@/modules/atencion/pacientes';
import { GrowthResponse } from '@/modules/atencion/pacientes/types/patient';

export function usePatientGrowth() {
    const { data, loading } = useQuery<GrowthResponse>(GET_GROWTH);
    return {
        growthData: data?.patientGrowth || [],
        isLoading: loading,
    };
}
