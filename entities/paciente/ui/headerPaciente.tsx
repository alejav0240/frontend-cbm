"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, ClipboardList, PenTool, Download } from "lucide-react";
import Image from "next/image";
import { PacienteDetalleSerializado } from "@/entities/paciente";

interface PatientHeaderProps {
  patient: PacienteDetalleSerializado;
  onBack: () => void;
  onShowQuestionnaire: () => void;
  onShowClinicalForm: () => void;
  onExport: () => void;
}

export function HeaderPaciente({
  patient,
  onBack,
  onShowQuestionnaire,
  onShowClinicalForm,
  onExport,
}: PatientHeaderProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all text-gray-500 hover:text-[#008080]"
          title="Volver a la lista de pacientes"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold dark:text-white serif">
          Expediente <span className="text-[#008080]">Clínico</span>
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#008080] rounded-[32px] p-8 text-white relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold relative overflow-hidden">
              {patient?.image ? (
                <Image
                  src={patient.image}
                  alt={patient.name}
                  fill
                  className="object-cover"
                />
              ) : (
                patient?.name?.charAt(0) || "?"
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">{patient?.name}</h1>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest border border-white/20">
                  {patient?.age} años
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest border border-white/20">
                  ID: {patient?.idNumber || "1234567"}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest border border-white/20">
                  {patient?.status}
                </span>
                {patient?.tutorPhone && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest border border-white/20">
                    Tel: {patient?.tutorPhone}
                  </span>
                )}
                {patient?.contactEmail && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest border border-white/20">
                    Email: {patient?.contactEmail}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onShowQuestionnaire}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-2xl transition-all backdrop-blur-md border border-white/20 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
              title="Llenar Cuestionario de Ingreso"
            >
              <ClipboardList size={18} />
              <span className="hidden sm:inline">Cuestionario</span>
            </button>
            <button
              onClick={onShowClinicalForm}
              className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all backdrop-blur-md border border-white/20"
            >
              <PenTool size={20} />
            </button>
            <button
              onClick={onExport}
              className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all backdrop-blur-md border border-white/20"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
