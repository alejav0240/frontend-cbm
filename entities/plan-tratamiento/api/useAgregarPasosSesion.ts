import {useMutation} from "@apollo/client/react";
import {BULK_ADD_STEPS_TO_SESSION} from "./mutaciones";

export function useAgregarPasosSesion() {
    const [mutation, {loading}] = useMutation(BULK_ADD_STEPS_TO_SESSION);

    const agregarPasosSesion = (variables: {
        planStepIds: string[];
        sessionId: string;
    }) => mutation({variables});

    return {agregarPasosSesion, agregando: loading};
}
