import { SesionDetalladaDTO } from "../model/dto";

export function mapearSesionADTO(
  session: any,
  pacienteNombre: string,
): SesionDetalladaDTO {
  return {
    id: session.id || "",
    databaseId: session.databaseId || 0,
    sessionNumber: session.sessionNumber || 0,
    sessionDate: session.sessionDate || "",
    durationMinutes: session.durationMinutes || 0,
    cycleNumber: session.cycleNumber || 0,
    notes: session.notes || "",
    createdAt: session.createdAt || "",
    pacienteNombre,
    therapistName: session.therapist?.fullname || "No asignado",
    resources: (session.sessionResources || []).map(
      (r: any) => r.resource?.title || "",
    ),
    inventory: (session.sessionInventory || []).map((i: any) => ({
      name: i.item?.name || "",
      room: i.item?.room || "",
    })),
    scaleEvaluations: (session.scaleEvaluations || []).map((e: any) => ({
      id: e.id || "",
      evaluatedAt: e.evaluatedAt || "",
      totalScore: e.totalScore || 0,
      scaleName: e.scale?.name || "",
      subscaleResponses: (e.subscaleResponses || []).map((s: any) => ({
        name: s.subscale?.name || "",
        score: s.score || 0,
        maxValue: s.subscale?.maxValue || 0,
      })),
      valueResponses: (e.valueResponses || []).map((v: any) => ({
        label: v.scaleValue?.label || "",
        value: v.scaleValue?.value || 0,
      })),
    })),
    formAssignments: (session.formAssignments || []).map((a: any) => ({
      createdAt: a.createdAt || "",
      completionRatio: a.completionRatio || 0,
      responses: (a.responses || []).map((r: any) => ({
        question: r.question?.question || "",
        response: r.response || "",
      })),
    })),
    planSteps: (session.sessionPlanSteps || []).map((ps: any) => ({
      id: ps.id || "",
      isCompleted: ps.isCompleted || false,
      actualDuration: ps.actualDuration || 0,
      moment: ps.planStep?.moment || "",
      objective: ps.planStep?.objective || "",
      focus: ps.planStep?.focus || "",
      musicalResources: ps.planStep?.musicalResources || "",
      musicalEmphasis: ps.planStep?.musicalEmphasis || "",
      mltMethod: ps.planStep?.mltMethod || "",
      durationMinutes: ps.planStep?.durationMinutes || 0,
      approach: ps.planStep?.approach || "",
    })),
  };
}
