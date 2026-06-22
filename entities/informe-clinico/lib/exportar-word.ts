import type { InformeClinicoDTO } from "../model/dto";
import { renderChartToCanvas } from "./renderChart";

export async function generarInformeClinicoWord(
  datos: InformeClinicoDTO[],
  nombreArchivo: string,
) {
  const informe = datos[0];
  if (!informe) throw new Error("No hay datos para exportar");

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
    BorderStyle,
    ImageRun,
  } = await import("docx");

  const p = informe.paciente;

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

  // ── Title ──
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "Informe Clínico",
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

  // ── 1. Datos del Paciente ──
  children.push(title("Datos del Paciente"));
  children.push(labelValue("Nombre", p.nombre));
  children.push(labelValue("Cédula", p.cedula));
  children.push(labelValue("Edad", p.edad));
  children.push(labelValue("Diagnóstico", p.diagnostico));
  children.push(labelValue("Residencia", p.residencia));
  children.push(labelValue("Tutor", p.tutor));
  children.push(labelValue("Teléfono", p.telefono));

  // ── 2. Perfil Clínico ──
  children.push(subTitle("Perfil Clínico"));
  children.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [bold("Objetivos Generales:")],
    }),
  );
  children.push(bodyText(p.objetivosGenerales));

  const perfiles: [string, string][] = [
    ["Físico", p.fisico],
    ["Emocional", p.emocional],
    ["Cognitivo", p.cognitivo],
    ["Social", p.social],
  ];
  for (const [label, val] of perfiles) {
    children.push(
      new Paragraph({ spacing: { after: 80 }, children: [bold(`${label}:`)] }),
    );
    children.push(bodyText(val));
  }

  children.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [bold("Métodos a Usar:")],
    }),
  );
  children.push(bodyText(p.metodosAUsar));

  if (p.notas) {
    children.push(
      new Paragraph({ spacing: { after: 80 }, children: [bold("Notas:")] }),
    );
    children.push(bodyText(p.notas));
  }

  // ── 3. Sesiones ──
  children.push(title("Historial de Sesiones"));
  if (informe.sesiones.length > 0) {
    const sesionHeader = (text: string, width: number) =>
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
    const sesionCell = (text: string, width: number) =>
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
        sesionHeader("#", 10),
        sesionHeader("Fecha", 25),
        sesionHeader("Terapeuta", 25),
        sesionHeader("Duración", 15),
        sesionHeader("Estado", 25),
      ],
    });

    const dataRows = informe.sesiones.map(
      (s) =>
        new TableRow({
          children: [
            sesionCell(String(s.numero), 10),
            sesionCell(s.fecha, 25),
            sesionCell(s.terapeuta, 25),
            sesionCell(s.duracion, 15),
            sesionCell(s.estado, 25),
          ],
        }),
    );

    children.push(
      new Table({
        rows: [headerRow, ...dataRows],
        width: { size: 100, type: WidthType.PERCENTAGE },
      }),
      emptyLine(),
    );

    // Session notes
    for (const s of informe.sesiones) {
      if (s.notas) {
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [bold(`Notas - Sesión #${s.numero}:`)],
          }),
          bodyText(s.notas),
        );
      }
    }
  } else {
    children.push(bodyText("No hay sesiones registradas."));
  }

  // ── 4. Escalas ──
  if (informe.escalas?.length) {
    children.push(title("Evaluaciones por Escalas"));

    for (const escala of informe.escalas) {
      children.push(subTitle(`${escala.nombre} (${escala.etiqueta})`));

      if (escala.puntuaciones.length > 0) {
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
                children: [cellH("Sesión"), cellH("Puntuación")],
              }),
              ...escala.puntuaciones.map(
                (p) =>
                  new TableRow({
                    children: [
                      cellD(p.sesion),
                      cellD(p.valor !== null ? String(p.valor) : "—"),
                    ],
                  }),
              ),
            ],
          }),
          emptyLine(),
        );

        // Chart
        if (escala.puntuaciones.length > 1) {
          const color = escala.nombre === "ERI" ? "#008080" : "#3b82f6";
          const canvas = renderChartToCanvas(
            `Evolución ${escala.nombre}`,
            escala.puntuaciones,
            color,
            600,
            240,
          );
          const dataUrl = canvas.toDataURL("image/png");
          const base64 = dataUrl.split(",")[1];
          const chartW = 500;
          const chartH = Math.round((240 / 600) * chartW);
          children.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 200 },
              children: [
                new ImageRun({
                  type: "png",
                  data: base64,
                  transformation: { width: chartW, height: chartH },
                }),
              ],
            }),
          );
        }
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
