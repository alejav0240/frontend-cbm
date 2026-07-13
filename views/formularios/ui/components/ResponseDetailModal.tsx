"use client";

import React from "react";
import { Modal } from "@/shared/ui/components/Modal";
import type {
  FormResponse,
  FormAssignment,
  FormTemplate,
} from "@/entities/formulario";

interface ResponseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedResponse: FormResponse | null;
  assignments: FormAssignment[];
  templates: FormTemplate[];
}

export function ResponseDetailModal({
  isOpen,
  onClose,
  selectedResponse,
  assignments,
  templates,
}: ResponseDetailModalProps) {
  if (!selectedResponse) return null;

  const assignment = assignments.find(
    (a) => a.id === selectedResponse.assignmentId,
  );
  const template = templates.find((t) => t.id === assignment?.templateId);

  console.log("Selected Response:", selectedResponse);
  console.log("Associated Assignment:", assignment);
  console.log("Associated Template:", template);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de Respuesta"
      maxWidth="max-w-3xl"
    >
      {!template ? (
        <p className="text-center text-gray-500 py-8 italic">
          Plantilla no encontrada
        </p>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-8 bg-gray-50 dark:bg-white/5 rounded-[40px] border border-gray-100 dark:border-white/10">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Usuario
              </p>
              <p className="text-lg font-bold dark:text-white">
                {selectedResponse.patientName}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Fecha de Envío
              </p>
              <p className="text-lg font-bold dark:text-white">
                {selectedResponse.submittedAt}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold text-[#008080] uppercase tracking-widest px-4">
              Respuestas
            </h4>
            <div className="grid gap-4">
              {selectedResponse.answers.map((field: any) => (
                <div
                  key={field.id}
                  className="p-6 bg-white dark:bg-white/2 rounded-[32px] border border-gray-100 dark:border-white/5 hover:border-[#008080]/30 transition-all group"
                >
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 group-hover:text-[#008080] transition-colors">
                    {field.question?.question}
                  </p>
                  <div className="text-sm dark:text-white font-medium leading-relaxed">
                    {field.response === "true" || field.response === "false" ? (
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${field.response === "true" ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <span>{field.response === "true" ? "Sí" : "No"}</span>
                      </div>
                    ) : (
                      field.response || (
                        <span className="text-gray-400 italic">
                          Sin respuesta
                        </span>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
