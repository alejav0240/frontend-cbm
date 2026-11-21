export interface RadarChartDatum {
  label: string;
  value: number;
}

export interface TimelineSeries {
  name: string;
  color: string;
  values: Array<{ label: string; value: number | null }>;
}

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export function renderRadarChartToCanvas(
  title: string,
  data: RadarChartDatum[],
  width = 500,
  height = 360,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const centerX = width / 2;
  const centerY = height / 2 + 12;
  const radius = Math.min(width, height) * 0.3;
  const levels = 5;

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#333";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, centerX, 22);

  if (data.length < 3) {
    ctx.fillStyle = "#999";
    ctx.font = "12px sans-serif";
    ctx.fillText("Datos insuficientes para el gráfico", centerX, centerY);
    return canvas;
  }

  const point = (index: number, value: number) => {
    const angle = -Math.PI / 2 + (index / data.length) * Math.PI * 2;
    return {
      x: centerX + Math.cos(angle) * radius * (value / 100),
      y: centerY + Math.sin(angle) * radius * (value / 100),
    };
  };

  ctx.strokeStyle = "#d9e5e5";
  ctx.lineWidth = 1;
  for (let level = 1; level <= levels; level++) {
    ctx.beginPath();
    data.forEach((_, index) => {
      const p = point(index, (level / levels) * 100);
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.stroke();
  }

  data.forEach((item, index) => {
    const axis = point(index, 100);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(axis.x, axis.y);
    ctx.stroke();

    const angle = -Math.PI / 2 + (index / data.length) * Math.PI * 2;
    const labelX = centerX + Math.cos(angle) * (radius + 24);
    const labelY = centerY + Math.sin(angle) * (radius + 24);
    ctx.fillStyle = "#555";
    ctx.font = "10px sans-serif";
    ctx.textAlign =
      labelX < centerX - 5 ? "right" : labelX > centerX + 5 ? "left" : "center";
    ctx.fillText(item.label.slice(0, 22), labelX, labelY);
  });

  ctx.beginPath();
  data.forEach((item, index) => {
    const p = point(index, clamp(item.value));
    if (index === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(0, 128, 128, 0.22)";
  ctx.fill();
  ctx.strokeStyle = "#008080";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  data.forEach((item, index) => {
    const p = point(index, clamp(item.value));
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#008080";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  return canvas;
}

export function renderTimelineChartToCanvas(
  title: string,
  series: TimelineSeries[],
  width = 700,
  height = 280,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const pad = { top: 34, right: 30, bottom: 42, left: 45 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const labels = Array.from(
    new Set(series.flatMap((item) => item.values.map((value) => value.label))),
  );

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#333";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, width / 2, 18);

  if (labels.length < 2 || series.length === 0) {
    ctx.fillStyle = "#999";
    ctx.font = "12px sans-serif";
    ctx.fillText("Datos insuficientes para el gráfico", width / 2, height / 2);
    return canvas;
  }

  const x = (index: number) =>
    pad.left + (index / (labels.length - 1)) * chartW;
  const numericValues = series
    .flatMap((item) => item.values.map((value) => value.value))
    .filter((value): value is number => value !== null);
  const minValue = Math.min(...numericValues);
  const maxValue = Math.max(...numericValues);
  const range = maxValue - minValue || 1;
  const yMin = Math.floor(minValue - range * 0.1);
  const yMax = Math.ceil(maxValue + range * 0.1);
  const y = (value: number) =>
    pad.top + chartH - ((value - yMin) / (yMax - yMin)) * chartH;

  ctx.strokeStyle = "#eee";
  ctx.fillStyle = "#888";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "right";
  for (let level = 0; level <= 5; level++) {
    const value = yMax - (level / 5) * (yMax - yMin);
    const lineY = y(value);
    ctx.beginPath();
    ctx.moveTo(pad.left, lineY);
    ctx.lineTo(width - pad.right, lineY);
    ctx.stroke();
    ctx.fillText(String(Math.round(value)), pad.left - 6, lineY + 4);
  }

  ctx.textAlign = "center";
  labels.forEach((label, index) => {
    if (labels.length <= 8 || index % Math.ceil(labels.length / 8) === 0) {
      ctx.fillText(label.slice(0, 12), x(index), height - 18);
    }
  });

  series.forEach((item) => {
    const points = item.values
      .map((value) => ({
        index: labels.indexOf(value.label),
        value: value.value,
      }))
      .filter((value) => value.index >= 0 && value.value !== null) as Array<{
      index: number;
      value: number;
    }>;

    if (points.length < 2) return;
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(x(point.index), y(point.value));
      else ctx.lineTo(x(point.index), y(point.value));
    });
    ctx.strokeStyle = item.color;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(x(point.index), y(point.value), 3.5, 0, Math.PI * 2);
      ctx.fillStyle = item.color;
      ctx.fill();
    });
  });

  return canvas;
}
