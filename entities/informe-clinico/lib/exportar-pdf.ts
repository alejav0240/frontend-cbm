import type { InformeClinicoDTO } from "../model/dto";
import { renderChartToCanvas } from "./renderChart";

export async function generarInformeClinicoPDF(datos: InformeClinicoDTO[]) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const informe = datos[0];
  if (!informe) throw new Error("No hay datos para exportar");

  const doc = new jsPDF() as InstanceType<typeof jsPDF> & {
    lastAutoTable: { finalY: number };
  };
  const p = informe.paciente;
  const pagX = 14;
  let y = 22;

  // ── Helper ──
  const header = (text: string) => {
    doc.setFontSize(13);
    doc.setTextColor(0, 128, 128);
    doc.text(text, pagX, y);
    y += 8;
  };
  const field = (label: string, value: string) => {
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`${label}:`, pagX, y);
    doc.setTextColor(50);
    doc.text(value || "—", pagX + 40, y);
    y += 6;
  };
  const bodyText = (text: string, maxWidth = 180) => {
    doc.setFontSize(10);
    doc.setTextColor(60);
    const lines = doc.splitTextToSize(text || "—", maxWidth);
    doc.text(lines, pagX, y);
    y += lines.length * 5 + 4;
  };
  const label = (text: string) => {
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(text, pagX, y);
    y += 5;
  };
  const ensureSpace = (extra = 0) => {
    if (y > 260 - extra) {
      doc.addPage();
      y = 22;
    }
  };
  const smallTable = (
    head: string[],
    body: string[][],
    startY: number,
  ): number => {
    autoTable(doc, {
      head: [head],
      body,
      startY,
      theme: "striped",
      headStyles: { fillColor: [0, 128, 128] },
      margin: { left: pagX, right: 14 },
    });
    return doc.lastAutoTable.finalY + 6;
  };

  // ── Title ──
  doc.setFontSize(20);
  doc.setTextColor(0, 128, 128);
  doc.text("Informe Clínico", pagX, y);
  y += 6;
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(`Generado el: ${new Date().toLocaleDateString("es-ES")}`, pagX, y);
  y += 14;

  // ── 1. Datos del Paciente ──
  header("Datos del Paciente");
  field("Nombre", p.nombre);
  field("Cédula", p.cedula);
  field("Edad", p.edad);
  field("Diagnóstico", p.diagnostico);
  field("Residencia", p.residencia);
  field("Tutor", p.tutor);
  field("Teléfono", p.telefono);
  y += 4;

  // ── 2. Perfil Clínico ──
  if (y > 250) {
    doc.addPage();
    y = 22;
  }
  header("Perfil Clínico");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Objetivos Generales:", pagX, y);
  y += 5;
  bodyText(p.objetivosGenerales);

  const perfiles: [string, string][] = [
    ["Físico", p.fisico],
    ["Emocional", p.emocional],
    ["Cognitivo", p.cognitivo],
    ["Social", p.social],
  ];
  for (const [labelName, val] of perfiles) {
    if (y > 260) {
      doc.addPage();
      y = 22;
    }
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`${labelName}:`, pagX, y);
    y += 5;
    bodyText(val, 170);
  }

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Métodos a Usar:", pagX, y);
  y += 5;
  bodyText(p.metodosAUsar);

  if (p.notas) {
    if (y > 260) {
      doc.addPage();
      y = 22;
    }
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Notas:", pagX, y);
    y += 5;
    bodyText(p.notas);
  }

  // ── 3. Sesiones ──
  if (y > 240) {
    doc.addPage();
    y = 22;
  }
  header("Historial de Sesiones");
  if (informe.sesiones.length > 0) {
    const rows = informe.sesiones.map((s) => [
      String(s.numero),
      s.fecha,
      s.terapeuta,
      s.duracion,
      s.estado,
      String(s.ciclo || ""),
    ]);
    autoTable(doc, {
      head: [["#", "Fecha", "Terapeuta", "Duración", "Estado", "Ciclo"]],
      body: rows,
      startY: y,
      theme: "striped",
      headStyles: { fillColor: [0, 128, 128] },
      margin: { left: pagX, right: 14 },
    });
    y = doc.lastAutoTable.finalY + 10;

    // Detalle de cada sesión
    for (const s of informe.sesiones) {
      if (s.notas) {
        ensureSpace();
        label(`Notas - Sesión #${s.numero}:`);
        bodyText(s.notas, 170);
      }
      if (s.recursos.length > 0) {
        ensureSpace();
        label(`Recursos - Sesión #${s.numero}:`);
        bodyText(s.recursos.join(", "), 170);
      }
      if (s.materiales.length > 0) {
        ensureSpace();
        label(`Materiales - Sesión #${s.numero}:`);
        bodyText(s.materiales.join(", "), 170);
      }
      for (const ev of s.evaluaciones) {
        ensureSpace(10);
        label(
          `Evaluación (${ev.escala || "Escala"}) - Sesión #${s.numero}: ${
            ev.puntuacion !== null ? ev.puntuacion : "—"
          }`,
        );
        if (ev.subescalas.length > 0) {
          y = smallTable(
            ["Subescala", "Categoría", "Puntuación"],
            ev.subescalas.map((sub) => [
              sub.nombre,
              sub.categoria,
              String(sub.puntuacion),
            ]),
            y,
          );
        }
        if (ev.valores.length > 0) {
          y = smallTable(
            ["Etiqueta", "Valor"],
            ev.valores.map((v) => [v.label, String(v.value)]),
            y,
          );
        }
        if (y > 260) {
          doc.addPage();
          y = 22;
        }
      }
    }
  } else {
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("No hay sesiones registradas.", pagX, y);
    y += 8;
  }

  // ── 4. Escalas ──
  if (informe.escalas?.length) {
    for (const escala of informe.escalas) {
      if (y > 240) {
        doc.addPage();
        y = 22;
      }
      header(`${escala.nombre} (${escala.etiqueta})`);
      if (escala.puntuaciones.length > 0) {
        // Table
        autoTable(doc, {
          head: [["Sesión", "Puntuación"]],
          body: escala.puntuaciones.map((p) => [
            p.sesion,
            p.valor !== null ? String(p.valor) : "—",
          ]),
          startY: y,
          theme: "striped",
          headStyles: { fillColor: [0, 128, 128] },
          margin: { left: pagX, right: 14 },
        });
        y = doc.lastAutoTable.finalY + 8;

        // Chart
        if (escala.puntuaciones.length > 1) {
          const color = escala.color || "#008080";
          const canvas = renderChartToCanvas(
            `Evolución ${escala.nombre}`,
            escala.puntuaciones,
            color,
            500,
            200,
          );
          const imgW = 180;
          const imgH = (200 / 500) * imgW;
          const cx = (doc.internal.pageSize.width - imgW) / 2;
          if (y + imgH > 270) {
            doc.addPage();
            y = 22;
          }
          doc.addImage(canvas, "PNG", cx, y, imgW, imgH);
          y += imgH + 14;
        }
      }

      // Detalle por evaluación
      if (escala.detalle?.length) {
        for (const d of escala.detalle) {
          ensureSpace(10);
          label(`Evaluación: ${d.fecha} — Total: ${d.total ?? "—"}`);
          if (d.subescalas.length > 0) {
            y = smallTable(
              ["Subescala", "Categoría", "Puntuación"],
              d.subescalas.map((sub) => [
                sub.nombre,
                sub.categoria,
                String(sub.puntuacion),
              ]),
              y,
            );
          }
          if (d.valores.length > 0) {
            y = smallTable(
              ["Etiqueta", "Valor"],
              d.valores.map((v) => [v.label, String(v.value)]),
              y,
            );
          }
        }
      }
    }
  }

  return doc;
}
