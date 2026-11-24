import { z } from "zod";

export function hoyISO() {
  const hoy = new Date();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${month}-${day}`;
}

export function fechaMinimaNacimientoISO() {
  const fecha = new Date();
  fecha.setFullYear(fecha.getFullYear() - 90);
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${month}-${day}`;
}

export function fechaISO(mensaje: string) {
  return z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, mensaje)
    .refine((value) => {
      const [year, month, day] = value.split("-").map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));

      return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
      );
    }, mensaje);
}

export function fechaNoFutura(mensaje: string) {
  return fechaISO(mensaje).refine(
    (value) => value <= hoyISO(),
    "La fecha no puede ser futura",
  );
}

export function fechaNacimiento() {
  return fechaNoFutura("Introduce una fecha de nacimiento válida")
    .refine(
      (value) => value >= fechaMinimaNacimientoISO(),
      "La edad no puede superar los 90 años",
    );
}
