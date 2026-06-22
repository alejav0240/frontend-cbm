"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Calendar as CalendarIcon, Clock, Plus } from "lucide-react";
import { AgendaHeader } from "@/views/agenda/ui/components/AgendaHeader";
import { AgendaSidebar } from "@/views/agenda/ui/components/AgendaSider";
import { AnimatePresence } from "motion/react";
import { CalendarView } from "@/views/agenda/ui/components/CalendarView";
import { HourlyView } from "@/views/agenda/ui/components/HourlyView";
import { TherapistView } from "@/views/agenda/ui/components/TherapistView";
import {
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useAgendaSessions } from "@/entities/sesion/api/useAgendaSessions";
import { useCrearSesionAgenda } from "@/entities/sesion/api/useCrearSesionAgenda";
import { useActualizarSesion } from "@/entities/sesion/api/useActualizarSesion";
import { FormNuevaCita } from "@/views/agenda/ui/components/FormNuevaCita";
import { DetalleSesion } from "@/views/agenda/ui/components/DetalleSesion";
import { SesionAgenda } from "@/entities/sesion/model/tipos-agenda";
import Modal from "@/shared/ui/components/Modal";
import { DatosCita } from "@/views/agenda/model/esquema-cita";
import { useSesionActivaStore } from "@/entities/sesion/model/useSesionActiva";
import { useRouter } from "next/navigation";
import {
  FormSesionPrueba,
  FormSesionPruebaData,
} from "@/features/gestion-sesion/ui/FormSesionPrueba";
import { useUsuarios } from "@/entities/usuario";

type FormMode = "create" | "edit" | "reschedule";

export const AgendaPage = () => {
  const router = useRouter();
  const { setSesion: setSesionActiva } = useSesionActivaStore();

  const [viewMode, setViewMode] = useState<"calendar" | "hourly" | "therapist">(
    "calendar",
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editingSession, setEditingSession] = useState<SesionAgenda | null>(
    null,
  );
  const [showTestForm, setShowTestForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SesionAgenda | null>(
    null,
  );
  const [activeId, setActiveId] = useState<number | null>(null);
  const [pendingSlotHour, setPendingSlotHour] = useState<number | undefined>(
    undefined,
  );

  const hours = Array.from({ length: 13 }, (_, i) => i + 8);

  const { sesiones, cargando, refetch } = useAgendaSessions({
    month: selectedDate,
  });

  const { crearSesion } = useCrearSesionAgenda();
  const { actualizarSesion } = useActualizarSesion();

  const sessions = sesiones;
  const filteredSessions = sesiones;

  const getSessionsForDay = useCallback(
    (day: number) => {
      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const dateStr = `${year}-${month}-${day.toString().padStart(2, "0")}`;
      return filteredSessions.filter((s) => s.date === dateStr);
    },
    [filteredSessions, selectedDate],
  );

  const getSessionsForSelectedDate = useCallback(() => {
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = selectedDate.getDate().toString().padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    return filteredSessions.filter((s) => s.date === dateStr);
  }, [filteredSessions, selectedDate]);

  const onSessionClick = useCallback((session: SesionAgenda) => {
    setSelectedSession(session);
    setShowDetails(true);
  }, []);

  const onStartSession = useCallback((session: SesionAgenda) => {
    setSelectedSession(session);
    setShowDetails(true);
  }, []);

  const onSlotClick = useCallback(
    (hour: number) => {
      const date = new Date(selectedDate);
      date.setHours(hour, 0, 0, 0);
      setPendingSlotHour(hour);
      setSelectedSession({ sessionDate: date.toISOString() } as any);
      setFormMode("create");
      setEditingSession(null);
      setShowForm(true);
    },
    [selectedDate],
  );

  const handleCreateSession = useCallback(
    async (data: DatosCita) => {
      await crearSesion({
        patientId: data.patientId,
        therapistId: data.therapistId,
        sessionDate: data.sessionDate,
        sessionType: data.sessionType,
        durationMinutes: data.durationMinutes,
        notes: data.notes,
      });
      setShowForm(false);
      setEditingSession(null);
      setPendingSlotHour(undefined);
      refetch();
    },
    [crearSesion, refetch],
  );

  const handleUpdateSession = useCallback(
    async (data: DatosCita) => {
      if (!editingSession) return;
      const isReschedule = formMode === "reschedule";
      await actualizarSesion(editingSession.id, {
        notes: data.notes || null,
        durationMinutes: data.durationMinutes || null,
        ...(isReschedule && {
          therapistId: data.therapistId,
          sessionDate: data.sessionDate,
          sessionType: data.sessionType,
        }),
      });
      setShowForm(false);
      setEditingSession(null);
      setPendingSlotHour(undefined);
      refetch();
    },
    [actualizarSesion, editingSession, formMode, refetch],
  );

  const handleCloseDetail = useCallback(() => {
    setShowDetails(false);
    setSelectedSession(null);
  }, []);

  const handleDeleted = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleEditSession = useCallback((session: SesionAgenda) => {
    setShowDetails(false);
    setEditingSession(session);
    setFormMode("edit");
    setPendingSlotHour(undefined);
    setShowForm(true);
  }, []);

  const handleRescheduleSession = useCallback((session: SesionAgenda) => {
    setShowDetails(false);
    setEditingSession(session);
    setFormMode("reschedule");
    setPendingSlotHour(undefined);
    setShowForm(true);
  }, []);

  const handleStartSession = useCallback(
    (session: SesionAgenda) => {
      setSesionActiva({
        id: session.id,
        pacienteId: session.patientId || "",
        pacienteNombre: session.patientName,
        inicio: new Date(),
      });
      router.push("/dashboard/sesion-en-progreso");
    },
    [setSesionActiva, router],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { usuarios: terapeutas, cargando: cargandoT } = useUsuarios({
    pagina: 1,
    pageSize: 50,
    nombreRol: "TERAPEUTA",
  });

  const opcionesTerapeutas = useMemo(
    () =>
      terapeutas
        .filter((t): t is { id: string; fullName: string } & typeof t =>
          Boolean(t.id && t.fullName),
        )
        .map((t) => ({ label: t.fullName, value: t.id })),
    [terapeutas],
  );

  const therapistsList = useMemo(() => {
    const unique = new Set<string>();
    sesiones.forEach((s) => {
      if (s.therapist) unique.add(s.therapist);
    });
    return Array.from(unique);
  }, [sesiones]);

  const handleTestSubmit = useCallback(
    async (data: FormSesionPruebaData) => {
      try {
        await crearSesion({
          patientId: "",
          therapistId: data.testTherapist,
          sessionDate: `${data.testDate}T${data.testTime}:00`,
          sessionType: data.testType === "Grupal" ? "GROUP" : "INDIVIDUAL",
          durationMinutes: 45,
          notes: `Sesión de prueba — Paciente: ${data.testPatientName}, Tel: ${data.testFatherPhone}`,
        });
        setShowTestForm(false);
        refetch();
      } catch {
        // error toast handled by crearSesion
      }
    },
    [crearSesion, refetch],
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = () => {
    setActiveId(null);
  };

  const formTitle =
    formMode === "edit"
      ? "Editar Sesión"
      : formMode === "reschedule"
        ? "Reagendar Sesión"
        : "Nueva Cita";

  return (
    <div className="space-y-8">
      <AgendaHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setShowTestForm={setShowTestForm}
        setShowForm={() => {
          setFormMode("create");
          setEditingSession(null);
          setShowForm(true);
        }}
      />
      <div
        className={`flex flex-col lg:flex-row gap-8 ${viewMode === "calendar" ? "block" : ""}`}
      >
        {viewMode !== "calendar" && (
          <AgendaSidebar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {viewMode === "calendar" ? (
              <CalendarView
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                setViewMode={setViewMode}
                getSessionsForDay={getSessionsForDay}
                onSessionClick={onSessionClick}
                onStartSession={onStartSession}
              />
            ) : viewMode === "hourly" ? (
              <HourlyView
                selectedDate={selectedDate}
                hours={hours}
                getSessionsForSelectedDate={getSessionsForSelectedDate}
                onSessionClick={onSessionClick}
                onStartSession={onStartSession}
                onSlotClick={onSlotClick}
              />
            ) : (
              <TherapistView
                therapists={therapistsList}
                hours={hours}
                getSessionsForSelectedDate={getSessionsForSelectedDate}
                onSessionClick={onSessionClick}
                sensors={sensors}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                activeId={activeId}
                sessions={sessions}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingSession(null);
          setPendingSlotHour(undefined);
        }}
        title={formTitle}
      >
        <FormNuevaCita
          mode={formMode}
          defaultDate={
            formMode === "reschedule"
              ? undefined
              : selectedDate.toISOString().split("T")[0]
          }
          defaultHour={formMode === "reschedule" ? undefined : pendingSlotHour}
          editingSession={
            formMode !== "create" ? editingSession || undefined : undefined
          }
          onClose={() => {
            setShowForm(false);
            setEditingSession(null);
            setPendingSlotHour(undefined);
          }}
          onSubmit={
            formMode === "create" ? handleCreateSession : handleUpdateSession
          }
        />
      </Modal>
      <FormSesionPrueba
        isOpen={showTestForm}
        onClose={() => setShowTestForm(false)}
        onSubmit={handleTestSubmit}
        therapists={opcionesTerapeutas}
        onSearchTherapist={() => {}}
        isLoadingTherapists={cargandoT}
      />
      <Modal
        isOpen={showDetails}
        onClose={handleCloseDetail}
        title="Detalle de Sesión"
      >
        {selectedSession && (
          <DetalleSesion
            session={selectedSession}
            onClose={handleCloseDetail}
            onDeleted={handleDeleted}
            onEdit={handleEditSession}
            onReschedule={handleRescheduleSession}
            onStartSession={handleStartSession}
          />
        )}
      </Modal>
    </div>
  );
};
