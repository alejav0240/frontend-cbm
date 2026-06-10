import { NormalizedSession } from "@/modules/atencion/sesiones/types/session";

const TEAL = "#008080";
const TEAL_RGB: [number, number, number] = [0, 128, 128];

// ─── PDF ─────────────────────────────────────────────────────────────────────

/** Genera el documento jsPDF — listo para preview o descarga */
export const generateSessionPDFDoc = async (session: NormalizedSession) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  doc.setFillColor(...TEAL_RGB);
  doc.rect(0, 0, pageW, 30, "F");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("Informe de Sesión", 14, 12);
  doc.setFontSize(10);
  doc.text(
    `Centro Boliviano de Musicoterapia — ${new Date().toLocaleDateString("es-BO")}`,
    14,
    22,
  );

  doc.setTextColor(40, 40, 40);
  doc.setFontSize(14);
  doc.text(`Sesión N° ${session.sessionNum} — ${session.patientName}`, 14, 44);

  autoTable(doc, {
    startY: 52,
    theme: "plain",
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 55 } },
    body: [
      ["Paciente", session.patientName],
      ["Institución", session.institutionName ?? "—"],
      ["N° de Sesión", String(session.sessionNum)],
      ["Fecha", session.date],
      ["Hora", session.time],
      ["Duración", session.duration],
      ["Terapeuta", session.therapist],
      ["Tipo", session.type],
      ["Estado", session.statusDisplay],
      ["Pago", session.paymentDisplay],
    ],
    styles: { fontSize: 11, cellPadding: 4 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  const notesY = (doc as any).lastAutoTable.finalY + 12;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...TEAL_RGB);
  doc.text("Notas / Observaciones", 14, notesY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  const notes = session.notes?.trim() || "Sin notas registradas.";
  const lines = doc.splitTextToSize(notes, pageW - 28);
  doc.text(lines, 14, notesY + 8);

  if (session.recordingUrl) {
    const linkY = notesY + 8 + lines.length * 6 + 8;
    doc.setFontSize(10);
    doc.setTextColor(...TEAL_RGB);
    doc.textWithLink("Ver grabación", 14, linkY, { url: session.recordingUrl });
  }

  return doc;
};

/** Compatible con PDFExportModal: recibe array, genera doc del primer elemento */
export const generateSessionPDF = (data: NormalizedSession[]) =>
  generateSessionPDFDoc(data[0]);

export const exportSessionPDF = async (
  session: NormalizedSession,
): Promise<void> => {
  const doc = await generateSessionPDFDoc(session);
  doc.save(
    `sesion_${session.sessionNum}_${session.patientName.replace(/\s+/g, "_")}.pdf`,
  );
};

// ─── Word ────────────────────────────────────────────────────────────────────

export const exportSessionWord = async (
  session: NormalizedSession,
): Promise<void> => {
  const {
    Document,
    Packer,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    TextRun,
    HeadingLevel,
    WidthType,
    ShadingType,
    BorderStyle,
    AlignmentType,
  } = await import("docx");

  const row = (label: string, value: string) =>
    new TableRow({
      children: [
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.SOLID, color: "F0F0F0" },
          children: [
            new Paragraph({
              children: [new TextRun({ text: label, bold: true, size: 22 })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 70, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [new TextRun({ text: value, size: 22 })],
            }),
          ],
        }),
      ],
    });

  const noBorder = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Informe de Sesión",
                color: TEAL.replace("#", ""),
                bold: true,
                size: 36,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Centro Boliviano de Musicoterapia — ${new Date().toLocaleDateString("es-BO")}`,
                color: "888888",
                size: 18,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: `Sesión N° ${session.sessionNum} — ${session.patientName}`,
                color: TEAL.replace("#", ""),
                size: 28,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: noBorder,
            rows: [
              row("Paciente", session.patientName),
              row("Institución", session.institutionName ?? "—"),
              row("N° de Sesión", String(session.sessionNum)),
              row("Fecha", session.date),
              row("Hora", session.time),
              row("Duración", session.duration),
              row("Terapeuta", session.therapist),
              row("Tipo", session.type),
              row("Estado", session.statusDisplay),
              row("Pago", session.paymentDisplay),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "Notas / Observaciones",
                color: TEAL.replace("#", ""),
                size: 26,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: session.notes?.trim() || "Sin notas registradas.",
                size: 22,
              }),
            ],
          }),
          ...(session.recordingUrl
            ? [
                new Paragraph({ text: "" }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Grabación: ${session.recordingUrl}`,
                      size: 20,
                      color: TEAL.replace("#", ""),
                    }),
                  ],
                }),
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sesion_${session.sessionNum}_${session.patientName.replace(/\s+/g, "_")}.docx`;
  a.click();
  URL.revokeObjectURL(url);
};

/** Compatible con PDFExportModal: recibe array, descarga Word del primer elemento */
export const generateSessionWord = (data: NormalizedSession[]) =>
  exportSessionWord(data[0]);
