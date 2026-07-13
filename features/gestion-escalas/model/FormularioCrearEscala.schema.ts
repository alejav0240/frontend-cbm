import { z } from "zod";

const subescalaSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "El nombre es obligatorio"),
  maxScore: z.number().min(1, "Debe ser mayor a 0"),
  description: z.string().optional(),
});

const valorSchema = z.object({
  id: z.number(),
  label: z.string().min(1, "La etiqueta es obligatoria"),
  value: z.number().min(0, "Debe ser un número positivo"),
});

export const esquemaCrearEscala = z
  .object({
    name: z.string().min(1, "El nombre de la escala es obligatorio"),
    description: z.string().optional(),
    type: z.enum(["subscales", "value_list"]),
    subscales: z.array(subescalaSchema).default([]),
    values: z.array(valorSchema).default([]),
  })
  .refine(
    (data) => {
      if (data.type === "subscales") return data.subscales.length > 0;
      return true;
    },
    { message: "Debes añadir al menos una subescala", path: ["subscales"] },
  )
  .refine(
    (data) => {
      if (data.type === "value_list") return data.values.length > 0;
      return true;
    },
    { message: "Debes añadir al menos un valor", path: ["value_list"] },
  );

export type EscalaFormData = z.infer<typeof esquemaCrearEscala>;
