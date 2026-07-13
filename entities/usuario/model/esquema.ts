import { z } from "zod";

export const esquemaUsuario = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  ci: z.string().min(1, "El carnet es requerido"),
  celular: z.string().min(1, "El celular es requerido"),
  username: z.string().optional(),
  password: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  tipo: z.enum([
    "TERAPEUTA",
    "ADMINISTRADOR",
    "SECRETARIA",
    "RECEPCION",
    "TUTOR",
  ]),
  isActive: z.boolean().default(true),
  visibility: z.enum(["VISIBLE", "NO VISIBLE"]).default("VISIBLE"),
});

export type DatosFormularioUsuario = z.infer<typeof esquemaUsuario>;

export const esquemaEditarPerfil = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Email inválido"),
  celular: z.string().min(1, "El celular es requerido"),
  ci: z.string().min(1, "El carnet es requerido"),
});

export type DatosEditarPerfil = z.infer<typeof esquemaEditarPerfil>;

export const esquemaCambiarContrasena = z
  .object({
    oldPassword: z.string().min(6, "Mínimo 6 caracteres"),
    newPassword: z.string().min(6, "Mínimo 6 caracteres"),
    confirmarPassword: z.string().min(6, "Mínimo 6 caracteres"),
  })
  .refine((data) => data.newPassword === data.confirmarPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarPassword"],
  });

export type DatosCambiarContrasena = z.infer<typeof esquemaCambiarContrasena>;
