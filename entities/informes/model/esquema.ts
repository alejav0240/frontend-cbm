import { z } from "zod";

export const esquemaInforme = z.object({
  patientId: z.string().min(1, "Selecciona un paciente"),
  reportUrl: z
    .string()
    .min(1, "Ingresa el link del informe")
    .url("Ingresa una URL válida"),
  type: z.string().min(1, "Selecciona el tipo de informe"),
});

export type DatosFormularioInforme = z.infer<typeof esquemaInforme>;
