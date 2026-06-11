import { useQuery } from "@apollo/client/react";
import { OBTENER_INSTITUCIONES } from "./consultas";
import { Institucion } from "../model/tipos";
import { useMemo } from "react";

export const useInstituciones = () => {
  const { data, loading, error, refetch } = useQuery<any>(OBTENER_INSTITUCIONES);

  const instituciones: Institucion[] = useMemo(() => {
    return (data?.institutions || []).map((inst: any) => ({
      id: inst.id,
      nombre: inst.name,
      direccion: inst.address,
      nombreContacto: inst.contactName,
      emailContacto: inst.contactEmail,
      telefonoContacto: inst.contactPhone,
      grupos: (inst.groups || []).map((g: any) => ({
        id: g.id,
        nombre: g.name,
      })),
    }));
  }, [data]);

  return {
    instituciones,
    cargando: loading,
    error,
    refetch,
  };
};
