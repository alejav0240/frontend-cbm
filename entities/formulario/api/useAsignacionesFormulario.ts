import { useQuery } from "@apollo/client/react";
import { OBTENER_ASIGNACIONES_FORMULARIO } from "./consultas";
import type {
  ObtenerAsignacionesFormularioQuery,
  ObtenerAsignacionesFormularioQueryVariables,
} from "@/shared/api/generated/graphql";
import { useMemo } from "react";

export interface AsignacionNormalizada {
  id: string;
  templateId: string | undefined;
  assignedToRole: string;
  assignedAt: string;
  status: "Completado" | "Activo";
  patientName: string;
  originalData: any;
}

export interface RespuestaFormNormalizada {
  id: string;
  assignmentId: string;
  templateId: string | undefined;
  submittedBy: string | undefined;
  patientName: string | undefined;
  submittedAt: string;
  status: "Revisado";
  answers: any[];
}

export interface AsignacionesFiltros {
  patientId?: string;
}

export const useAsignacionesFormulario = (filtros: AsignacionesFiltros = {}) => {
  const { data, loading, error, refetch } = useQuery<
    ObtenerAsignacionesFormularioQuery,
    ObtenerAsignacionesFormularioQueryVariables
  >(OBTENER_ASIGNACIONES_FORMULARIO, {
    variables: {
      patientId: filtros.patientId,
    },
    skip: !filtros.patientId,
    notifyOnNetworkStatusChange: true,
  });

  const { asignaciones, respuestasForm } = useMemo(() => {
    const rawAssignments = data?.formAssignments?.results;

    if (!rawAssignments) {
      return { asignaciones: [], respuestasForm: [] };
    }

    const asignacionesList: AsignacionNormalizada[] = [];
    const respuestasList: RespuestaFormNormalizada[] = [];

    const cleanAssignments = rawAssignments.filter(
      (a): a is NonNullable<typeof a> => a !== null,
    );

    for (const a of cleanAssignments) {
      const tieneRespuestas = a.responses && a.responses.length > 0;

      const fechaAsignacion = a.createdAt
        ? new Date(a.createdAt as string).toLocaleDateString()
        : "N/A";

      asignacionesList.push({
        id: a.id,
        templateId: a.form?.id ?? undefined,
        assignedToRole: a.assignedTo?.fullName || "Paciente",
        assignedAt: fechaAsignacion,
        status: tieneRespuestas ? "Completado" : "Activo",
        patientName: a.patient?.fullName || "N/A",
        originalData: a,
      });

      if (tieneRespuestas && a.responses[0]) {
        const fechaRespuesta = a.responses[0].respondedAt
          ? new Date(a.responses[0].respondedAt as string).toLocaleDateString()
          : fechaAsignacion;

        respuestasList.push({
          id: a.id,
          assignmentId: a.id,
          templateId: a.form?.id ?? undefined,
          submittedBy: a.assignedTo?.fullName ?? undefined,
          patientName: a.patient?.fullName ?? undefined,
          submittedAt: fechaRespuesta,
          status: "Revisado",
          answers: [...a.responses],
        });
      }
    }

    return {
      asignaciones: asignacionesList,
      respuestasForm: respuestasList,
    };
  }, [data]);

  return {
    asignaciones,
    respuestaForm: respuestasForm,
    total: data?.formAssignments?.totalCount ?? 0,
    paginas: data?.formAssignments?.totalPages ?? 0,
    paginaActual: data?.formAssignments?.currentPage ?? 0,
    cargando: loading,
    error,
    refetch,
  };
};
