import { z } from "zod";

// ==========================================
// PAYMENT SCHEMAS
// ==========================================

export const createPaymentSchema = z.object({
  patientId: z.string().min(1, "El ID del paciente es obligatorio"),
  sessionsCount: z.number().int().positive("La cantidad de sesiones debe ser mayor a 0"),
  pricePerSession: z.number().positive("El precio por sesión debe ser mayor a 0"),
  amountPaid: z.number().nonnegative("El monto pagado no puede ser negativo"),
  paymentMethod: z.string().min(1, "El método de pago es obligatorio"),
  discountId: z.string().optional().nullable(),
});

export const updatePaymentSchema = z.object({
  id: z.string().min(1, "El ID del pago es obligatorio"),
  amountPaid: z.number().nonnegative("El monto pagado no puede ser negativo").optional(),
  paymentStatus: z.string().min(1, "El estado de pago no puede estar vacío").optional(),
});

export const deletePaymentSchema = z.object({
  id: z.string().min(1, "El ID del pago es obligatorio"),
});


// ==========================================
// DISCOUNT SCHEMAS
// ==========================================

export const createDiscountSchema = z.object({
  name: z.string().min(1, "El nombre del descuento es obligatorio"),
  type: z.string().min(1, "El tipo de descuento es obligatorio"), // ej: "PERCENTAGE", "FIXED"
  value: z.number().positive("El valor del descuento debe ser mayor a 0"),
  description: z.string().optional().nullable(),
});

export const updateDiscountSchema = z.object({
  id: z.string().min(1, "El ID del descuento es obligatorio"),
  name: z.string().min(1, "El nombre no puede estar vacío").optional(),
  type: z.string().min(1, "El tipo no puede estar vacío").optional(),
  value: z.number().positive("El valor debe ser mayor a 0").optional(),
  description: z.string().optional().nullable(),
});


// ==========================================
// TYPES INFERENCE
// ==========================================

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type DeletePaymentInput = z.infer<typeof deletePaymentSchema>;

export type CreateDiscountInput = z.infer<typeof createDiscountSchema>;
export type UpdateDiscountInput = z.infer<typeof updateDiscountSchema>;