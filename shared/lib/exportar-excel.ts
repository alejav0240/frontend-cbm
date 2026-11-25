type ExcelRow = Record<string, unknown>;

export const descargarExcel = async (
  filas: ExcelRow[],
  hoja: string,
  nombreArchivo: string,
) => {
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(hoja);
  const columnas = Object.keys(filas[0] ?? {});

  worksheet.columns = columnas.map((key) => ({ header: key, key }));
  filas.forEach((fila) => worksheet.addRow(fila));

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${nombreArchivo}_${Date.now()}.xlsx`;
  anchor.click();
  URL.revokeObjectURL(url);
};
