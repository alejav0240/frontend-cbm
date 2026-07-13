import { SesionDetalladaDTO } from "../model/dto";

export async function generarSesionDetalladaPDF(dto: SesionDetalladaDTO) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  const pagX = 14;
  let y = 22;

  const header = (text: string) => {
    if (y > 250) {
      doc.addPage();
      y = 22;
    }
    doc.setFontSize(13);
    doc.setTextColor(0, 128, 128);
    doc.text(text, pagX, y);
    y += 8;
  };

  const bodyText = (text: string, maxWidth = 180) => {
    if (y > 250) {
      doc.addPage();
      y = 22;
    }
    doc.setFontSize(10);
    doc.setTextColor(60);
    const lines = doc.splitTextToSize(text || "—", maxWidth);
    doc.text(lines, pagX, y);
    y += lines.length * 5 + 4;
  };

  // Title
  doc.setFontSize(20);
  doc.setTextColor(0, 128, 128);
  doc.text(`Informe de Sesión #${dto.sessionNumber}`, pagX, y);
  y += 6;

  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(`Generado el: ${new Date().toLocaleDateString("es-ES")}`, pagX, y);
  y += 12;

  // General info table
  header("Información General de la Sesión");
  const formattedDate = dto.sessionDate
    ? new Date(dto.sessionDate).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  autoTable(doc, {
    body: [
      ["Paciente:", dto.pacienteNombre, "Fecha Sesión:", formattedDate],
      [
        "Terapeuta:",
        dto.therapistName,
        "Duración:",
        `${dto.durationMinutes} minutos`,
      ],
      [
        "Ciclo Número:",
        `Ciclo #${dto.cycleNumber}`,
        "Fecha Registro:",
        new Date(dto.createdAt).toLocaleDateString("es-ES"),
      ],
    ],
    startY: y,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [100, 100, 100], cellWidth: 30 },
      1: { textColor: [50, 50, 50], cellWidth: 60 },
      2: { fontStyle: "bold", textColor: [100, 100, 100], cellWidth: 30 },
      3: { textColor: [50, 50, 50], cellWidth: 60 },
    },
  });
  y = (doc as any).lastAutoTable.finalY + 12;

  // Notes
  header("Notas Clínicas");
  bodyText(dto.notes || "No hay notas clínicas registradas para esta sesión.");
  y += 4;

  // Resources
  if (dto.resources.length > 0 || dto.inventory.length > 0) {
    header("Recursos y Materiales Utilizados");
    if (dto.resources.length > 0) {
      bodyText(`Recursos Digitales: ${dto.resources.join(", ")}`);
    }
    if (dto.inventory.length > 0) {
      bodyText(
        `Materiales de Aula: ${dto.inventory.map((i) => `${i.name}${i.room ? ` (${i.room})` : ""}`).join(", ")}`,
      );
    }
    y += 4;
  }

  // Treatment Plan Steps
  if (dto.planSteps.length > 0) {
    header("Planificación y Objetivos de la Sesión");
    const rows = dto.planSteps.map((step, idx) => [
      String(idx + 1),
      step.moment || "—",
      step.objective || "—",
      step.focus || "—",
      step.mltMethod || "—",
      `${step.actualDuration || 0}/${step.durationMinutes || 0} min`,
      step.isCompleted ? "Sí" : "No",
    ]);

    autoTable(doc, {
      head: [
        [
          "#",
          "Momento",
          "Objetivo",
          "Enfoque",
          "Método MLT",
          "Duración",
          "Completado",
        ],
      ],
      body: rows,
      startY: y,
      theme: "striped",
      headStyles: { fillColor: [0, 128, 128] },
      styles: { fontSize: 8, cellPadding: 2.5 },
      margin: { left: pagX, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // Scale evaluations
  if (dto.scaleEvaluations.length > 0) {
    header("Evaluaciones Clínicas Realizadas");
    for (const evalData of dto.scaleEvaluations) {
      if (y > 230) {
        doc.addPage();
        y = 22;
      }
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(50);
      doc.text(
        `${evalData.scaleName} — Puntuación Total: ${evalData.totalScore}/10`,
        pagX,
        y,
      );
      y += 6;
      doc.setFont("helvetica", "normal");

      const rows: string[][] = [];
      evalData.subscaleResponses.forEach((r) => {
        rows.push([
          r.name || "Subescala",
          `${r.score} (máx: ${r.maxValue || 10})`,
        ]);
      });
      evalData.valueResponses.forEach((v) => {
        rows.push([v.label || "Respuesta", String(v.value)]);
      });

      if (rows.length > 0) {
        autoTable(doc, {
          head: [["Indicador / Subescala", "Valor obtenido"]],
          body: rows,
          startY: y,
          theme: "striped",
          headStyles: { fillColor: [100, 100, 100] },
          styles: { fontSize: 8.5, cellPadding: 2 },
          margin: { left: pagX + 6, right: 20 },
        });
        y = (doc as any).lastAutoTable.finalY + 8;
      } else {
        y += 4;
      }
    }
    y += 4;
  }

  // Form Assignments
  if (dto.formAssignments.length > 0) {
    header("Respuestas a Cuestionarios Clínicos");
    for (const formAssign of dto.formAssignments) {
      if (y > 230) {
        doc.addPage();
        y = 22;
      }
      const completionPct = Math.round(formAssign.completionRatio * 100);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(50);
      doc.text(`Cuestionario — Completado: ${completionPct}%`, pagX, y);
      y += 6;
      doc.setFont("helvetica", "normal");

      if (formAssign.responses.length > 0) {
        const rows = formAssign.responses.map((r) => [r.question, r.response]);
        autoTable(doc, {
          head: [["Pregunta", "Respuesta"]],
          body: rows,
          startY: y,
          theme: "striped",
          headStyles: { fillColor: [0, 128, 128] },
          styles: { fontSize: 8.5, cellPadding: 3 },
          margin: { left: pagX + 6, right: 20 },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      } else {
        y += 4;
      }
    }
  }

  return doc;
}
