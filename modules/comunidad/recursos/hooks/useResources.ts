import { useMutation, useSuspenseQuery } from "@apollo/client/react";
import {GET_DIGITAL_RESOURCES} from "@/modules/comunidad/recursos/graphql/query";
import {
    CREATE_DIGITAL_RESOURCE,
    DELETE_DIGITAL_RESOURCE,
    UPDATE_DIGITAL_RESOURCE
} from "@/modules/comunidad/recursos/graphql/mutations";
import {CreateDigitalResourceInput, UpdateDigitalResourceInput} from "@/modules/comunidad/recursos/schemas";
import {RecursoData, RecursoFilters} from "@/modules/comunidad/recursos/types";

interface Props {
    filters:RecursoFilters
}

export function useResources({filters}: Props) {
    const { data: resourcesData, refetch: refetchResources } = useSuspenseQuery<RecursoData>(GET_DIGITAL_RESOURCES, {
        variables: { type:filters.type, search:filters.search, page:filters.page, pageSize:filters.pageSize }
    });

    const [createResource] = useMutation(CREATE_DIGITAL_RESOURCE, { onCompleted: () => refetchResources() });
    const [updateResource] = useMutation(UPDATE_DIGITAL_RESOURCE, { onCompleted: () => refetchResources() });
    const [deleteResource] = useMutation(DELETE_DIGITAL_RESOURCE, { onCompleted: () => refetchResources() });

    return {
        resources: resourcesData?.digitalResources?.results ?? [],
        totalCount: resourcesData?.digitalResources?.totalCount ?? 0,
        totalPages: resourcesData?.digitalResources?.totalPages ?? 1,
        currentPage: resourcesData?.digitalResources?.currentPage ?? 1,
        createResource: (variables: CreateDigitalResourceInput) => createResource({ variables }),
        updateResource: (variables: UpdateDigitalResourceInput) => updateResource({ variables }),
        deleteResource: (id: string | number) => deleteResource({ variables: { id } }),
        refetchResources
    };
}
