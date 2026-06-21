import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { OBTENER_PACIENTES } from "./consultas";
import { Paciente, PacienteFiltro, PacienteNormalizado } from "../model/tipos";
import { ObtenerPacientesQuery } from "@/shared/api/generated/graphql";

export const usePacientes = (filtros?: PacienteFiltro) => {
  const { data, loading, error, refetch } = useQuery<ObtenerPacientesQuery>(
    OBTENER_PACIENTES,
    {
      variables: {
        page: filtros?.page || 1,
        pageSize: filtros?.pageSize || 8,
        search: filtros?.search || undefined,
        status:
          filtros?.status === "Todos"
            ? undefined
            : filtros?.status?.toLowerCase(),
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const pacientes = useMemo(
    () =>
      (data?.patients?.results || []).filter(Boolean) as unknown as Paciente[],
    [data],
  );

  const pacientesNormalizados: PacienteNormalizado[] = useMemo(
    () =>
      pacientes.map((p) => ({
        ...p,
        nombre: p.fullName || p.firstName,
        cedula: p.ci,
        foto: p.imageUrl,
        status:
          p.status === "active"
            ? "Activo"
            : p.status === "inactive"
              ? "Inactivo"
              : p.status === "discharged"
                ? "Alta"
                : "Pendiente",
      })),
    [pacientes],
  );

  return {
    pacientes: pacientesNormalizados,
    total: data?.patients?.totalCount || 0,
    paginas: data?.patients?.totalPages || 0,
    paginaActual: data?.patients?.currentPage || 0,
    cargando: loading,
    error,
    refetch,
  };
};
