import { z } from "zod";

export const esquemaLogin = z.object({
  username: z.string().min(1, "El nombre de usuario es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type DatosFormularioLogin = z.infer<typeof esquemaLogin>;
