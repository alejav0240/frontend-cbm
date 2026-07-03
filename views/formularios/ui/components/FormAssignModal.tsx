"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Clock } from "lucide-react";
import { Modal } from "@/shared/ui/components/Modal";
import { SearchableSelect } from "@/shared/ui/components/SearchableSelect";
import type { FormTemplate } from "@/entities/formulario";
import {
  esquemaAsignarFormulario,
  type DatosAsignarFormulario,
} from "@/entities/formulario";

const ROLES = [
  { label: "Tutores de Pacientes", value: "Tutor" },
  { label: "Terapeutas", value: "Terapeuta" },
  { label: "Administradores", value: "Admin" },
  { label: "Estudiantes de Cursos", value: "Estudiante" },
];

interface FormAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedForm: FormTemplate | null;
  onAssign: (data: DatosAsignarFormulario) => void;
  asignando?: boolean;
}

export function FormAssignModal({
  isOpen,
  onClose,
  selectedForm,
  onAssign,
  asignando = false,
}: FormAssignModalProps) {
  const { handleSubmit, watch, setValue, formState } =
    useForm<DatosAsignarFormulario>({
      resolver: zodResolver(esquemaAsignarFormulario),
      defaultValues: { role: "Tutor" },
    });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asignar Formulario">
      <form className="space-y-6" onSubmit={handleSubmit(onAssign)}>
        <div className="p-6 bg-[#008080]/5 rounded-3xl border border-[#008080]/10">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Estás asignando:
          </p>
          <h4 className="text-xl font-bold text-[#008080] serif">
            {selectedForm?.name}
          </h4>
        </div>

        <div className="space-y-2">
          <SearchableSelect
            label="Seleccionar Rol de Usuario"
            value={watch("role")}
            onChange={(val) => setValue("role", val)}
            options={ROLES}
            clearable={false}
          />
          {formState.errors.role && (
            <p className="text-xs text-red-500">
              {formState.errors.role.message}
            </p>
          )}
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10 flex gap-3">
          <Clock size={20} className="text-blue-500 shrink-0" />
          <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
            Al asignar este formulario, todos los usuarios con el rol
            seleccionado recibirán una notificación y podrán responderlo desde
            su portal.
          </p>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={asignando}
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Send size={18} />
            {asignando ? "Asignando..." : "Confirmar Asignación"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
