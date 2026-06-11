import { create } from "zustand";

interface PacienteSeleccionado {
  id: string;
  nombre: string;
  documento?: string;
}

interface PacienteSeleccionadoEstado {
  paciente: PacienteSeleccionado | null;
  setPaciente: (paciente: PacienteSeleccionado | null) => void;
  limpiarPaciente: () => void;
}

export const usePacienteSeleccionadoStore = create<PacienteSeleccionadoEstado>((set) => ({
  paciente: null,
  setPaciente: (paciente) => set({ paciente }),
  limpiarPaciente: () => set({ paciente: null }),
}));
