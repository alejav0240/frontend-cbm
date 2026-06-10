import { NormalizedSession } from "@/modules/atencion/sesiones/types/session";

export const generateSessionsListPDF = async (
  sessions: NormalizedSession[],
) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Reporte de Sesiones", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);
  autoTable(doc, {
    head: [
      [
        "#",
        "Paciente",
        "Fecha",
        "Hora",
        "Terapeuta",
        "Estado",
        "Pago",
        "Duración",
      ],
    ],
    body: sessions.map((s) => [
      s.sessionNum,
      s.patientName,
      s.date,
      s.time,
      s.therapist,
      s.statusDisplay,
      s.paymentDisplay,
      s.duration,
    ]),
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: "#008080" },
  });
  return doc;
};

export const generateSessionSummaryPDF = async (session: NormalizedSession) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Resumen de Sesión", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  autoTable(doc, {
    body: [
      ["Paciente", session.patientName],
      ["Sesión N°", String(session.sessionNum)],
      ["Fecha", session.date],
      ["Hora", session.time],
      ["Terapeuta", session.therapist],
      ["Estado", session.statusDisplay],
      ["Pago", session.paymentDisplay],
      ["Duración", session.duration],
      ["Notas", session.notes || "—"],
    ],
    startY: 35,
    theme: "plain",
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 50 } },
  });
  return doc;
};

export const generateSessionsExcel = async (
  sessions: NormalizedSession[],
  fileName = "reporte_sesiones",
) => {
  const XLSX = await import("xlsx");
  const rows = sessions.map((s) => ({
    "#": s.sessionNum,
    Paciente: s.patientName,
    Institución: s.institutionName ?? "",
    Fecha: s.date,
    Hora: s.time,
    Terapeuta: s.therapist,
    Tipo: s.type,
    Estado: s.statusDisplay,
    Pago: s.paymentDisplay,
    Duración: s.duration,
    Notas: s.notes,
    Grabación: s.recordingUrl ?? "",
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sesiones");
  XLSX.writeFile(wb, `${fileName}_${Date.now()}.xlsx`);
};
