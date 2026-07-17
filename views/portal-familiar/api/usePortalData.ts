import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_THERAPY_REPORTS } from "@/entities/informes/api/consultas";
import { OBTENER_SESIONES } from "@/entities/sesion/api/consultas";
import { OBTENER_ASIGNACIONES_FORMULARIO } from "@/entities/formulario/api/consultas";
import type { ObtenerInformesQuery, ObtenerSesionesQuery, ObtenerAsignacionesFormularioQuery } from "@/shared/api/generated/graphql";
import type { TherapyReport } from "@/entities/informes/model/tipos";

export interface SesionPortal {
  id: string;
  sessionNum: number;
  date: string;
  therapist: string;
  recordingUrl?: string;
  sessionDate: string;
}

export interface ProximaSesion {
  id: string;
  sessionDate: string;
  therapist?: { fullName: string };
}

export interface FormularioPendiente {
  id: string;
  template: { name: string };
}

export const usePortalData = (patientId?: string | null) => {
  const { data: informesData, loading: cargandoInformes } = useQuery<ObtenerInformesQuery>(
    GET_THERAPY_REPORTS,
    {
      variables: {
        patientId: patientId || undefined,
      },
      skip: !patientId,
    },
  );

  const { data: sesionesData, loading: cargandoSesiones } = useQuery<ObtenerSesionesQuery>(OBTENER_SESIONES, {
    variables: {
      patientId: patientId || undefined,
      pageSize: 50,
    },
    skip: !patientId,
  });

  const { data: formsData, loading: cargandoForms } = useQuery<ObtenerAsignacionesFormularioQuery>(
    OBTENER_ASIGNACIONES_FORMULARIO,
    {
      variables: {
        patientId: patientId || undefined,
        pageSize: 50,
      },
      skip: !patientId,
    },
  );

  const informes: TherapyReport[] = useMemo(
    () =>
      (informesData?.therapyReports ?? [])
        .filter((r): r is NonNullable<typeof r> => r != null)
        .map((r) => ({
          id: r.id,
          title: `Informe - ${r.patient?.fullName ?? "Sin paciente"}`,
          patientName: r.patient?.fullName ?? "Sin paciente",
          date: r.createdAt
            ? new Date(r.createdAt as string).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "—",
          status: "Enviado" as const,
          tutorName: "",
          therapistName: r.generatedBy?.fullName ?? "",
          content: "",
          reportUrl: r.reportUrl ?? "",
        })),
    [informesData],
  );

  const sesiones: SesionPortal[] = useMemo(() => {
    const raw = sesionesData?.sessions?.sessions ?? [];
    return raw
      .filter((s): s is NonNullable<typeof s> => s != null)
      .map((s) => ({
        id: s.id,
        sessionNum: s.numeroSesion ?? 0,
        date: s.fechaSesion
          ? new Date(s.fechaSesion as string).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
            })
          : "—",
        therapist: s.terapeuta?.fullName ?? "",
        recordingUrl: s.videoUrl ?? undefined,
        sessionDate: String(s.fechaSesion ?? ""),
      }));
  }, [sesionesData]);

  const proximaSesion: ProximaSesion | null = useMemo(() => {
    const ahora = new Date();
    const futuras = sesiones
      .filter((s) => new Date(s.sessionDate) > ahora)
      .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime());
    const next = futuras[0];
    if (!next) return null;
    const raw = (sesionesData?.sessions?.sessions ?? []).find((s) => s?.id === next.id);
    return {
      id: next.id,
      sessionDate: next.sessionDate,
      therapist: raw?.terapeuta ? { fullName: raw.terapeuta.fullName ?? "" } : undefined,
    };
  }, [sesiones, sesionesData]);

  const formulariosPendientes: FormularioPendiente[] = useMemo(() => {
    const raw = formsData?.formAssignments?.results ?? [];
    return raw
      .filter((f) => f != null && (!f.responses || f.responses.length === 0))
      .map((f) => ({
        id: f!.id,
        template: { name: f!.form?.name ?? "Formulario" },
      }));
  }, [formsData]);

  const cargando = cargandoInformes || cargandoSesiones || cargandoForms;

  return {
    informes,
    sesiones,
    proximaSesion,
    formulariosPendientes,
    cargando,
  };
};
