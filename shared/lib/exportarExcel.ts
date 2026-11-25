type ExcelRow = Record<string, unknown>;

export async function descargarExcel(
  filas: ExcelRow[],
  nombreHoja: string,
  nombreArchivo: string,
) {
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(nombreHoja);
  const columnas = Object.keys(filas[0] ?? {});

  worksheet.addRow(columnas);
  for (const fila of filas) {
    worksheet.addRow(columnas.map((columna) => fila[columna] ?? ""));
  }

  worksheet.getRow(1).font = { bold: true };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([new Uint8Array(buffer)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = nombreArchivo;
  anchor.click();
  URL.revokeObjectURL(url);
}
