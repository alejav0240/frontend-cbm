import {useMutation} from "@apollo/client/react";
import {OBTENER_CAMPANAS_MARKETING} from "./consultas";
import {CREATE_CAMPAIGN} from "@/entities/marketing/api/mutaciones";

export function useCrearCampana() {
    const [crearCampana, {loading}] = useMutation(CREATE_CAMPAIGN, {
        refetchQueries: [{query: OBTENER_CAMPANAS_MARKETING}],
    });

    const crear = (variables: {
        name: string;
        platform: string;
        budget: number;
        status?: string;
    }) => crearCampana({variables});

    return {
        crear,
        loading,
    };
}
