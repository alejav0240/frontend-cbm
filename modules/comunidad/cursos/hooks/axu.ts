
interface Institution {
    id: string;
    name: string;
    address: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    groups: {
        id: string;
        name: string;
    }[];
}

interface InstitutionsData {
    institutions: Institution[];
}

export function useInstitutions() {
    const { data, error, loading } = useQuery<InstitutionsData>(GET_INSTITUTIONS);

    const institutions = useMemo(() => {
        return data?.institutions || [];
    }, [data]);

    return {
        institutions,
        isLoading: loading,
        error
    };
}