/**
 * Normaliza un texto eliminando acentos/diacríticos y caracteres especiales,
 * retornando únicamente letras y dígitos en mayúsculas.
 */
export function limpiarTextoAlfanumerico(texto: string): string {
  if (!texto) return "";
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remueve tildes y diacríticos
    .replace(/[^a-zA-Z0-9]/g, "") // Filtra todo lo que no sea alfanumérico
    .toUpperCase();
}

/**
 * Genera un nombre de usuario corto, fácil y único en formato:
 * [3 letras de primer nombre][4 letras de primer apellido][combinación numérica aleatoria]
 * Ejemplo: Alejandro Chipana -> ALECHIP384
 *
 * @param firstName Primer nombre o nombres
 * @param lastName Primer apellido o apellidos
 * @param digitsLength Longitud de la combinación numérica (por defecto 3 dígitos: 100-999)
 */
export function generarUsername(
  firstName: string = "",
  lastName: string = "",
  digitsLength: number = 3
): string {
  const primerNombre = firstName.trim().split(/\s+/)[0] || "";
  const primerApellido = lastName.trim().split(/\s+/)[0] || "";

  const fnLimpio = limpiarTextoAlfanumerico(primerNombre);
  const lnLimpio = limpiarTextoAlfanumerico(primerApellido);

  const fnPart = fnLimpio.slice(0, 3);
  const lnPart = lnLimpio.slice(0, 4);

  let base = `${fnPart}${lnPart}`;

  if (!base) {
    base = "USER";
  } else if (base.length < 4) {
    const completo = limpiarTextoAlfanumerico(`${firstName}${lastName}`);
    base = completo.slice(0, 6) || base;
  }

  // Generar combinación numérica aleatoria (ej. entre 100 y 999 para 3 dígitos)
  const min = Math.pow(10, digitsLength - 1);
  const max = Math.pow(10, digitsLength) - 1;
  const numero = Math.floor(min + Math.random() * (max - min + 1));

  return `${base}${numero}`;
}
