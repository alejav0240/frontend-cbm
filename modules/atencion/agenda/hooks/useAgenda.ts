"use client";

interface SessionsVariables {
  patientId?: string;
  therapistId?: string;
  sessionStatus?: string;
  sessionType?: string;
  paymentStatus?: string;
}

export function useAgenda(variables: SessionsVariables = {}) {
  return {};
}
