import { useMutation } from "@apollo/client/react";
import { CREATE_LEAD } from "./mutaciones";
import { OBTENER_LEADS } from "./consultas";

export function useCrearLead() {
  const [crearLead, { loading }] = useMutation(CREATE_LEAD, {
    refetchQueries: [{ query: OBTENER_LEADS }],
  });

  const crear = (variables: {
    name: string;
    phone?: string;
    email?: string;
    campaignId?: string;
  }) => crearLead({ variables });

  return {
    crear,
    loading,
  };
}
