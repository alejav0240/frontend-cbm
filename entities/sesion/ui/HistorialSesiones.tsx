"use client";

import React from "react";
import {motion} from "motion/react";
import {Search, BarChart3, PenTool, Trash2, Music, Video} from "lucide-react";
import {Pagination} from "@/shared/ui/Pagination";
import SessionCard from "@/entities/sesion/ui/SessionCard";

interface SessionHistoryProps {
    patientSessions: any[];
    onViewAIAnalysis: (sessionId: number, mode: "list" | "charts") => void;
    onEditSession: (session: any) => void;
    onDeleteSession: (sessionId: number) => void;
    currentPage: number;
    totalPages: number;
    cicloNumber: number;
    onPageChange: (page: number) => void;
}

export function HistorialSesiones({
                                      patientSessions,
                                      onViewAIAnalysis,
                                      onEditSession,
                                      onDeleteSession,
                                      currentPage,
                                      totalPages,
                                      cicloNumber,
                                      onPageChange,
                                  }: SessionHistoryProps) {
    console.log("Historial sesiones");
    console.log(patientSessions);
    const handleViewAIAnalysis = (id: string | number, type: "list" | "charts") => {
        // Implementación
    };

    const handleEditSession = (session: any) => {
        // Implementación
    };

    const handleDeleteSession = (id: string | number) => {
        // Implementación
    };
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white serif">
                Historial de <span className="text-[#008080]">Sesiones</span>
            </h2>
            <div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gray-300/80 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 font-serif tracking-tight">
                        Ciclo # <span className="text-[#008080] font-bold">{cicloNumber}</span>
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Navegación en orden inverso
                        activo</p>
                </div>

                {/* Ajustamos el mt-8 original de la paginación a mt-0 mediante un contenedor */}
                <div className="[&>div]:mt-0">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        reverse={true}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
            <div className="grid gap-8">
                {patientSessions.length > 0 ? (
                    patientSessions.map((session, idx) => (
                        <SessionCard
                            key={session.databaseId}
                            session={session}
                            idx={idx}
                            onViewAIAnalysis={handleViewAIAnalysis}
                            onEditSession={handleEditSession}
                            onDeleteSession={handleDeleteSession}
                        />
                    ))
                ) : (
                    <div
                        className="text-center py-20 bg-gray-50 dark:bg-white/2 rounded-[48px] border border-dashed border-gray-200 dark:border-white/10">
                        <p className="text-gray-400 italic">
                            No se encontraron sesiones registradas para este paciente.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
