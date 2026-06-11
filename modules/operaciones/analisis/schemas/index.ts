// Auto-generated schemas index
import { z } from 'zod';

// Ejemplo de esquema base
export const baseSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
});

export type BaseSchemaType = z.infer<typeof baseSchema>;
