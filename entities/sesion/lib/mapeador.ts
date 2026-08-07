import { SesionDetalladaDTO } from "../model/dto";

export interface SesionDetalleOrigen {
  id?: string | null;
  databaseId?: number | null;
  sessionNumber?: number | null;
  sessionDate?: unknown;
  durationMinutes?: number | null;
  cycleNumber?: number | null;
  notes?: string | null;
  createdAt?: unknown;
  therapist?: { fullname?: string | null } | null;
  sessionResources?: Array<{
    resource?: { title?: string | null } | null;
  } | null> | null;
  sessionInventory?: Array<{
    item?: { name?: string | null; room?: string | null } | null;
  } | null> | null;
  scaleEvaluations?: Array<{
    id?: string | null;
    evaluatedAt?: unknown;
    totalScore?: number | null;
    scale?: { name?: string | null } | null;
    subscaleResponses?: Array<{
      score?: number | null;
      subscale?: { name?: string | null; maxValue?: number | null } | null;
    } | null> | null;
    valueResponses?: Array<{
      scaleValue?: { label?: string | null; value?: number | null } | null;
    } | null> | null;
  } | null> | null;
  formAssignments?: Array<{
    createdAt?: unknown;
    completionRatio?: string | number | null;
    responses?: Array<{
      response?: string | null;
      question?: { question?: string | null } | null;
    } | null> | null;
  } | null> | null;
  sessionPlanSteps?: Array<{
    id?: string | null;
    isCompleted?: boolean | null;
    actualDuration?: number | null;
    planStep?: {
      moment?: string | null;
      objective?: string | null;
      focus?: string | null;
      musicalResources?: string | null;
      musicalEmphasis?: string | null;
      mltMethod?: string | null;
      durationMinutes?: number | null;
      approach?: string | null;
    } | null;
  } | null> | null;
}

export function mapearSesionADTO(
  session: SesionDetalleOrigen,
  pacienteNombre: string,
): SesionDetalladaDTO {
  return {
    id: session.id || "",
    databaseId: session.databaseId || 0,
    sessionNumber: session.sessionNumber || 0,
    sessionDate: session.sessionDate ? String(session.sessionDate) : "",
    durationMinutes: session.durationMinutes || 0,
    cycleNumber: session.cycleNumber || 0,
    notes: session.notes || "",
    createdAt: session.createdAt ? String(session.createdAt) : "",
    pacienteNombre,
    therapistName: session.therapist?.fullname || "No asignado",
    resources: (session.sessionResources || []).map(
      (r) => r?.resource?.title || "",
    ),
    inventory: (session.sessionInventory || []).map((i) => ({
      name: i?.item?.name || "",
      room: i?.item?.room || "",
    })),
    scaleEvaluations: (session.scaleEvaluations || []).map((e) => ({
      id: e?.id || "",
      evaluatedAt: e?.evaluatedAt ? String(e.evaluatedAt) : "",
      totalScore: e?.totalScore || 0,
      scaleName: e?.scale?.name || "",
      subscaleResponses: (e?.subscaleResponses || []).map((s) => ({
        name: s?.subscale?.name || "",
        score: s?.score || 0,
        maxValue: s?.subscale?.maxValue || 0,
      })),
      valueResponses: (e?.valueResponses || []).map((v) => ({
        label: v?.scaleValue?.label || "",
        value: v?.scaleValue?.value || 0,
      })),
    })),
    formAssignments: (session.formAssignments || []).map((a) => ({
      createdAt: a?.createdAt ? String(a.createdAt) : "",
      completionRatio: Number(a?.completionRatio) || 0,
      responses: (a?.responses || []).map((r) => ({
        question: r?.question?.question || "",
        response: r?.response || "",
      })),
    })),
    planSteps: (session.sessionPlanSteps || []).map((ps) => ({
      id: ps?.id || "",
      isCompleted: ps?.isCompleted || false,
      actualDuration: ps?.actualDuration || 0,
      moment: ps?.planStep?.moment || "",
      objective: ps?.planStep?.objective || "",
      focus: ps?.planStep?.focus || "",
      musicalResources: ps?.planStep?.musicalResources || "",
      musicalEmphasis: ps?.planStep?.musicalEmphasis || "",
      mltMethod: ps?.planStep?.mltMethod || "",
      durationMinutes: ps?.planStep?.durationMinutes || 0,
      approach: ps?.planStep?.approach || "",
    })),
  };
}
