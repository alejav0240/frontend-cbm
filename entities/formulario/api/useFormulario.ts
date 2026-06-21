import {useQuery} from "@apollo/client/react";
import {OBTENER_FORMULARIO} from "./consultas";
import type {ObtenerFormularioQuery, ObtenerFormularioQueryVariables} from "@/shared/api/generated/graphql";

export const useFormulario = (id?: string) => {
    const {data, loading, error, refetch} =
        useQuery<ObtenerFormularioQuery, ObtenerFormularioQueryVariables>(
            OBTENER_FORMULARIO,
            {
                variables: {id: id!},
                skip: !id,
                notifyOnNetworkStatusChange: true,
            },
        );

    return {
        formulario: data?.form ?? null,
        cargando: loading,
        error,
        refetch,
    };
};
