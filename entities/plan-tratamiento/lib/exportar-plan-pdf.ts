import type { PlanTarjeta } from "@/views/planes/ui/tipos";

export async function generarPlanIntervencionPDF(plan: PlanTarjeta) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF() as InstanceType<typeof jsPDF> & {
    lastAutoTable: { finalY: number };
  };
  const pagX = 14;
  let y = 22;

  // Encabezado principal
  doc.setFontSize(20);
  doc.setTextColor(0, 128, 128);
  doc.text("Plan de Intervención Terapéutico", pagX, y);
  y += 7;

  doc.setFontSize(10);
  doc.setTextColor(130);
  doc.text(
    `Fecha de Emisión: ${new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })}`,
    pagX,
    y,
  );
  y += 12;

  // Información General
  doc.setFontSize(12);
  doc.setTextColor(0, 128, 128);
  doc.text("Información General", pagX, y);
  y += 4;

  const fechaInicioFormateada = plan.fechaInicio
    ? new Date(plan.fechaInicio).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "No especificada";

  const fechaFinFormateada = plan.fechaFin
    ? new Date(plan.fechaFin).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "En curso";

  autoTable(doc, {
    body: [
      ["Paciente:", plan.patientName, "Estado:", plan.status],
      [
        "Fecha de Inicio:",
        fechaInicioFormateada,
        "Progreso:",
        `${plan.progress}%`,
      ],
      [
        "Fecha de Fin:",
        fechaFinFormateada,
        "Total de Pasos:",
        `${plan.steps?.length ?? 0}`,
      ],
    ],
    startY: y,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [100, 100, 100], cellWidth: 32 },
      1: { textColor: [40, 40, 40], cellWidth: 60 },
      2: { fontStyle: "bold", textColor: [100, 100, 100], cellWidth: 32 },
      3: { textColor: [40, 40, 40], cellWidth: 60 },
    },
  });
  y = doc.lastAutoTable.finalY + 8;

  // Objetivo Principal
  doc.setFontSize(12);
  doc.setTextColor(0, 128, 128);
  doc.text("Objetivo Principal", pagX, y);
  y += 6;

  doc.setFontSize(10);
  doc.setTextColor(60);
  const objetivoLines = doc.splitTextToSize(
    plan.objective || "Sin objetivo especificado.",
    180,
  );
  doc.text(objetivoLines, pagX, y);
  y += objetivoLines.length * 5 + 10;

  // Pasos del Plan
  doc.setFontSize(12);
  doc.setTextColor(0, 128, 128);
  doc.text("Pasos del Plan de Intervención", pagX, y);
  y += 4;

  if (plan.steps && plan.steps.length > 0) {
    const tableData = plan.steps.map((p, idx) => [
      String(idx + 1),
      p.momento || "—",
      p.objetivo || "—",
      p.foco || "—",
      p.recursosMusicales || "—",
      p.enfasisMusical || "—",
      p.enfoque || "—",
      p.duracion ? `${p.duracion} min` : "—",
      p.completed ? "Completado" : "Pendiente",
    ]);

    autoTable(doc, {
      head: [
        [
          "#",
          "Momento",
          "Objetivo",
          "Foco",
          "Recursos",
          "Énfasis",
          "Enfoque",
          "Duración",
          "Estado",
        ],
      ],
      body: tableData,
      startY: y,
      theme: "striped",
      headStyles: {
        fillColor: [0, 128, 128],
        fontSize: 8,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 2.5,
      },
      columnStyles: {
        0: { cellWidth: 8, halign: "center" },
        1: { cellWidth: 20 },
        2: { cellWidth: 32 },
        3: { cellWidth: 24 },
        4: { cellWidth: 26 },
        5: { cellWidth: 24 },
        6: { cellWidth: 22 },
        7: { cellWidth: 16, halign: "center" },
        8: { cellWidth: 18, halign: "center" },
      },
      margin: { left: pagX, right: 14 },
    });
  } else {
    doc.setFontSize(10);
    doc.setTextColor(140);
    doc.text(
      "No hay pasos configurados en este plan de intervención.",
      pagX,
      y + 4,
    );
  }

  return doc;
}
