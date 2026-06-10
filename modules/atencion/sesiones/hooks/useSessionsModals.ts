import { useState } from "react";
import { NormalizedSession } from "@/modules/atencion/sesiones/types/session";

export function useSessionsModals() {
    const [showForm, setShowForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
    const [selectedSession, setSelectedSession] = useState<NormalizedSession | null>(null);
    const [selectedSessionForSummary, setSelectedSessionForSummary] = useState<NormalizedSession | null>(null);

    return {
        showForm, setShowForm,
        showDeleteConfirm, setShowDeleteConfirm,
        showExportModal, setShowExportModal,
        showSummaryModal, setShowSummaryModal,
        isEditingNotes, setIsEditingNotes,
        sessionToDelete, setSessionToDelete,
        selectedSession, setSelectedSession,
        selectedSessionForSummary, setSelectedSessionForSummary,
    };
}
