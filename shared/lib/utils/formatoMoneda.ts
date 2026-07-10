export function formatBs(value: number): string {
  return `Bs. ${value.toLocaleString("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
