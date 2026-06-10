"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { sessionSchema } from "@/modules/atencion/sesiones/schemas/schema";
import type { SessionFormData } from "@/modules/atencion/sesiones/schemas/schema";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";
import { useSessionsModals } from "./useSessionsModals";
import { useSessions } from "./useSession";
import { useSearchPatients } from "@/modules/atencion/pacientes/hooks/usePatient";
import { useSearchUsers } from "@/modules/sistema/usuarios/hooks/useUsers";
import { NormalizedSession } from "@/modules/atencion/sesiones/types/session";
import {
  exportSessionPDF,
  exportSessionWord,
} from "@/modules/atencion/sesiones/services/sessionExport";

const ITEMS_PER_PAGE = 10;

export function useSessionsData() {
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [filterTherapist, setFilterTherapist] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [editedNotes, setEditedNotes] = useState("");
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [therapistSearchTerm, setTherapistSearchTerm] = useState("");

  const debouncedPatientSearch = useDebounce(patientSearchTerm, 500);
  const debouncedTherapistSearch = useDebounce(therapistSearchTerm, 500);

  const modals = useSessionsModals();

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      patientId: "",
      therapistId: "",
      sessionDate: new Date().toISOString().split("T")[0],
      sessionTime: "09:00",
      sessionType: "individual",
      durationMinutes: 45,
      notes: "",
      executionDescription: "",
    },
  });

  const {
    sessions: rawSessions,
    isCreating,
    addSession,
    updateSession,
    deleteSession,
    refetch,
  } = useSessions({
    patientId: "",
    paymentStatus: "",
    sessionStatus: "",
    therapistId: "",
    sessionType: "",
  });

  const { patient: patientResults, isLoading: isLoadingPatients } =
    useSearchPatients({ search: debouncedPatientSearch });
  const { users: therapistResults, loading: isLoadingTherapists } =
    useSearchUsers({ search: debouncedTherapistSearch, roleName: "TERAPEUTA" });

  const patientOptions = useMemo(
    () =>
      (patientResults ?? []).map((p) => ({ label: p.fullName, value: p.id })),
    [patientResults],
  );

  const therapistOptions = useMemo(
    () =>
      (therapistResults ?? []).map((t) => ({ label: t.fullName, value: t.id })),
    [therapistResults],
  );

  const therapistsList = useMemo(
    () => (therapistResults ?? []).map((t) => t.fullName),
    [therapistResults],
  );

  const normalizedSessions: NormalizedSession[] = useMemo(
    () =>
      rawSessions.map((s) => {
        const status = (s.sessionStatus || "").toLowerCase();
        const payment = (s.paymentStatus || "").toLowerCase();
        return {
          id: s.id,
          patientId: s.patient?.id ?? null,
          patientName:
            s.patient?.fullName ?? (s.group ? `Grupo: ${s.group.name}` : "N/A"),
          institutionName: s.group?.institution?.name,
          sessionNum: s.sessionNumber,
          date: s.sessionDate
            ? new Date(s.sessionDate).toLocaleDateString()
            : "N/A",
          time: s.sessionDate
            ? new Date(s.sessionDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A",
          status: s.sessionStatus || "agendada",
          statusDisplay:
            status === "completa"
              ? "Completa"
              : status === "confirma"
                ? "Confirma"
                : status === "agendada"
                  ? "Agendada"
                  : status === "reprograma"
                    ? "Reprograma"
                    : status === "cancelada"
                      ? "Cancelada"
                      : "Pendiente",
          payment: s.paymentStatus || "pending",
          paymentDisplay:
            s.paymentStatusDisplay ||
            (payment === "paid"
              ? "Pagada"
              : payment === "exempt"
                ? "Exenta"
                : "Pendiente"),
          duration: `${s.durationMinutes || 0} min`,
          therapist: s.therapist?.fullName || "N/A",
          type: s.sessionType || "individual",
          notes: Array.isArray(s.notes) ? s.notes.join("\n") : s.notes || "",
          recordingUrl: s.videoUrl,
        };
      }),
    [rawSessions],
  );

  const filteredSessions = useMemo(
    () =>
      normalizedSessions.filter((s) => {
        const matchesStatus =
          filterStatus === "Todos" || s.status === filterStatus;
        const matchesTherapist =
          filterTherapist === "Todos" || s.therapist === filterTherapist;
        return matchesStatus && matchesTherapist;
      }),
    [normalizedSessions, filterStatus, filterTherapist],
  );

  const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleFormSubmit = async (data: SessionFormData) => {
    try {
      await addSession({
        patientId: data.patientId,
        therapistId: data.therapistId,
        sessionDate: `${data.sessionDate}T${data.sessionTime}:00`,
        sessionType: data.sessionType,
        durationMinutes: data.durationMinutes,
        notes:
          `${data.executionDescription ?? ""}\n\n${data.notes ?? ""}`.trim(),
      });
      toast.success("Sesión registrada correctamente");
      modals.setShowForm(false);
      form.reset();
      await refetch();
    } catch {
      toast.error("Error al registrar la sesión");
    }
  };

  const handleDeleteSession = async () => {
    if (!modals.sessionToDelete) return;
    try {
      await deleteSession(modals.sessionToDelete);
      toast.success("Sesión eliminada correctamente");
      modals.setShowDeleteConfirm(false);
      modals.setSessionToDelete(null);
      await refetch();
    } catch {
      toast.error("Error al eliminar la sesión");
    }
  };

  const handleSaveNotes = async () => {
    if (!modals.selectedSession) return;
    try {
      await updateSession({
        id: modals.selectedSession.id,
        notes: editedNotes,
      });
      modals.setIsEditingNotes(false);
      toast.success("Notas actualizadas correctamente");
      await refetch();
    } catch {
      toast.error("Error al actualizar las notas");
    }
  };

  return {
    // data
    sessions: normalizedSessions,
    filteredSessions,
    paginatedSessions,
    totalPages,
    currentPage,
    setCurrentPage,
    isSubmitting: isCreating,
    therapistsList,
    // form
    form,
    patientOptions,
    therapistOptions,
    isLoadingPatients,
    isLoadingTherapists,
    setPatientSearchTerm,
    setTherapistSearchTerm,
    // filters
    filterStatus,
    setFilterStatus,
    filterTherapist,
    setFilterTherapist,
    // notes
    editedNotes,
    setEditedNotes,
    // handlers
    handleFormSubmit: form.handleSubmit(handleFormSubmit),
    handleDeleteSession,
    handleSaveNotes,
    // Abre el modal de exportación para una sesión individual
    handleOpenSessionExport: (session: NormalizedSession) => {
      modals.setSelectedSessionForSummary(session);
      modals.setShowSessionExportModal(true);
    },
    // Descarga directa usada dentro del modal
    handleExportSessionPDF: async (data: NormalizedSession[]) => {
      try {
        const doc = await exportSessionPDF(data[0]);
        return doc;
      } catch {
        toast.error("Error al generar el PDF");
      }
    },
    handleExportSessionWord: async (data: NormalizedSession[]) => {
      try {
        await exportSessionWord(data[0]);
      } catch {
        toast.error("Error al generar el Word");
      }
    },
    handleSendReminder: (session: NormalizedSession) => {
      toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
        loading: "Enviando recordatorio...",
        success: `Recordatorio enviado a ${session.patientName}`,
        error: "Error al enviar el recordatorio",
      });
    },
    refetch,
    // modals (spread all modal state)
    ...modals,
  };
}
