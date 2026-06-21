import { z } from "zod";

export const esquemaCrearPago = z.object({
  patientId: z.string().min(1, "El ID del paciente es obligatorio"),
  sessionsCount: z
    .number()
    .int()
    .positive("La cantidad de sesiones debe ser mayor a 0"),
  pricePerSession: z
    .number()
    .positive("El precio por sesión debe ser mayor a 0"),
  amountPaid: z.number().nonnegative("El monto pagado no puede ser negativo"),
  paymentMethod: z.string().min(1, "El método de pago es obligatorio"),
  discountId: z.string().optional().nullable(),
});

export const esquemaActualizarPago = z.object({
  id: z.string().min(1, "El ID del pago es obligatorio"),
  amountPaid: z
    .number()
    .nonnegative("El monto pagado no puede ser negativo")
    .optional(),
  paymentStatus: z
    .string()
    .min(1, "El estado de pago no puede estar vacío")
    .optional(),
});

export type DatosFormularioPago = z.infer<typeof esquemaCrearPago>;

export const esquemaCrearDescuento = z.object({
  name: z.string().min(1, "El nombre del descuento es obligatorio"),
  type: z.string().min(1, "El tipo de descuento es obligatorio"),
  value: z.number().positive("El valor del descuento debe ser mayor a 0"),
  description: z.string().optional().nullable(),
});
