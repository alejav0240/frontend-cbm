import { z } from "zod";

export const esquemaInstitucion = z.object({
  nombre: z
    .string()
    .min(2, "El nombre de la institución debe tener al menos 2 caracteres"),
  direccion: z.string().optional(),
  nombreContacto: z.string().optional(),
  telefonoContacto: z.string().optional(),
  emailContacto: z
    .string()
    .email("Ingresa un email válido")
    .optional()
    .or(z.literal("")),
});

export type DatosFormularioInstitucion = z.infer<typeof esquemaInstitucion>;

export const esquemaGrupo = z.object({
  nombre: z
    .string()
    .min(2, "El nombre del grupo debe tener al menos 2 caracteres"),
  descripcion: z.string().optional(),
});

export type DatosFormularioGrupo = z.infer<typeof esquemaGrupo>;
