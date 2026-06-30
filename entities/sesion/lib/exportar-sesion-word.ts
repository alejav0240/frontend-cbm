import { SesionDetalladaDTO } from "../model/dto";

export async function generarSesionDetalladaWord(dto: SesionDetalladaDTO, nombreArchivo: string) {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    HeadingLevel,
    AlignmentType,
    WidthType,
  } = await import("docx");

  const bold = (text: string) =>
    new TextRun({ text, bold: true, size: 22, font: "Calibri" });
  const normal = (text: string) =>
    new TextRun({ text: text || "—", size: 22, font: "Calibri" });

  const labelValue = (label: string, value: string) =>
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `${label}: `,
          bold: true,
          size: 22,
          font: "Calibri",
          color: "666666",
        }),
        new TextRun({ text: value || "—", size: 22, font: "Calibri" }),
      ],
    });

  const title = (text: string) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text,
          color: "008080",
          bold: true,
          size: 28,
          font: "Calibri",
        }),
      ],
    });

  const subTitle = (text: string) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [
        new TextRun({
          text,
          color: "008080",
          bold: true,
          size: 24,
          font: "Calibri",
        }),
      ],
    });

  const bodyText = (text: string) =>
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: text || "—", size: 22, font: "Calibri" })],
    });

  const emptyLine = () =>
    new Paragraph({ spacing: { after: 80 }, children: [] });

  const children: any[] = [];

  // Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `Informe de Sesión #${dto.sessionNumber}`,
          bold: true,
          size: 36,
          color: "008080",
          font: "Calibri",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: `Generado el: ${new Date().toLocaleDateString("es-ES")}`,
          size: 20,
          color: "999999",
          font: "Calibri",
        }),
      ],
    }),
  );

  // General info
  children.push(title("Información General"));
  children.push(labelValue("Paciente", dto.pacienteNombre));
  children.push(labelValue("Terapeuta", dto.therapistName));

  const formattedDate = dto.sessionDate 
    ? new Date(dto.sessionDate).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "—";

  children.push(labelValue("Fecha de Sesión", formattedDate));
  children.push(labelValue("Duración", `${dto.durationMinutes} minutos`));
  children.push(labelValue("Ciclo Número", `Ciclo #${dto.cycleNumber}`));

  // Notes
  children.push(title("Notas Clínicas"));
  children.push(bodyText(dto.notes || "No hay notas clínicas registradas."));

  // Resources
  if (dto.resources.length > 0 || dto.inventory.length > 0) {
    children.push(title("Recursos y Materiales"));
    if (dto.resources.length > 0) {
      children.push(labelValue("Recursos Digitales", dto.resources.join(", ")));
    }
    if (dto.inventory.length > 0) {
      children.push(labelValue("Materiales de Aula", dto.inventory.map(i => `${i.name}${i.room ? ` (${i.room})` : ""}`).join(", ")));
    }
  }

  // Treatment Plan Steps
  if (dto.planSteps.length > 0) {
    children.push(title("Planificación y Objetivos"));

    const tableHeader = (text: string, width: number) =>
      new TableCell({
        width: { size: width, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text,
                bold: true,
                size: 20,
                font: "Calibri",
                color: "FFFFFF",
              }),
            ],
          }),
        ],
        shading: { fill: "008080" },
      });

    const tableCell = (text: string, width: number) =>
      new TableCell({
        width: { size: width, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: text || "—", size: 20, font: "Calibri" }),
            ],
          }),
        ],
      });

    const headerRow = new TableRow({
      children: [
        tableHeader("#", 5),
        tableHeader("Momento", 15),
        tableHeader("Objetivo", 25),
        tableHeader("Enfoque", 15),
        tableHeader("Método MLT", 15),
        tableHeader("Duración", 15),
        tableHeader("Completado", 10),
      ],
    });

    const dataRows = dto.planSteps.map((step, idx) =>
      new TableRow({
        children: [
          tableCell(String(idx + 1), 5),
          tableCell(step.moment || "—", 15),
          tableCell(step.objective || "—", 25),
          tableCell(step.focus || "—", 15),
          tableCell(step.mltMethod || "—", 15),
          tableCell(`${step.actualDuration || 0}/${step.durationMinutes || 0} min`, 15),
          tableCell(step.isCompleted ? "Sí" : "No", 10),
        ],
      })
    );

    children.push(
      new Table({
        rows: [headerRow, ...dataRows],
        width: { size: 100, type: WidthType.PERCENTAGE },
      }),
      emptyLine()
    );
  }

  // Clinical Evaluations
  if (dto.scaleEvaluations.length > 0) {
    children.push(title("Evaluaciones Clínicas"));

    for (const evalData of dto.scaleEvaluations) {
      children.push(subTitle(`${evalData.scaleName} (Puntuación: ${evalData.totalScore}/10)`));

      const rows: string[][] = [];
      evalData.subscaleResponses.forEach(r => {
        rows.push([r.name || "Subescala", `${r.score} (máx: ${r.maxValue || 10})`]);
      });
      evalData.valueResponses.forEach(v => {
        rows.push([v.label || "Indicador", String(v.value)]);
      });

      if (rows.length > 0) {
        const cellH = (t: string) =>
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: t,
                    bold: true,
                    size: 20,
                    font: "Calibri",
                    color: "FFFFFF",
                  }),
                ],
              }),
            ],
            shading: { fill: "666666" },
          });
        const cellD = (t: string) =>
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: t || "—", size: 20, font: "Calibri" }),
                ],
              }),
            ],
          });

        children.push(
          new Table({
            rows: [
              new TableRow({
                children: [cellH("Indicador / Subescala"), cellH("Valor obtenido")],
              }),
              ...rows.map(
                (p) =>
                  new TableRow({
                    children: [cellD(p[0]), cellD(p[1])],
                  }),
              ),
            ],
            width: { size: 90, type: WidthType.PERCENTAGE },
          }),
          emptyLine()
        );
      }
    }
  }

  // Clinical Questionnaires
  if (dto.formAssignments.length > 0) {
    children.push(title("Cuestionarios Clínicos"));

    for (const formAssign of dto.formAssignments) {
      const pct = Math.round(formAssign.completionRatio * 100);
      children.push(subTitle(`Respuestas Cuestionario (${pct}% completado)`));

      if (formAssign.responses.length > 0) {
        const cellH = (t: string) =>
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: t,
                    bold: true,
                    size: 20,
                    font: "Calibri",
                    color: "FFFFFF",
                  }),
                ],
              }),
            ],
            shading: { fill: "008080" },
          });
        const cellD = (t: string) =>
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: t || "—", size: 20, font: "Calibri" }),
                ],
              }),
            ],
          });

        children.push(
          new Table({
            rows: [
              new TableRow({
                children: [cellH("Pregunta"), cellH("Respuesta")],
              }),
              ...formAssign.responses.map(
                (r) =>
                  new TableRow({
                    children: [cellD(r.question), cellD(r.response)],
                  }),
              ),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          emptyLine()
        );
      }
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nombreArchivo}_${Date.now()}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
