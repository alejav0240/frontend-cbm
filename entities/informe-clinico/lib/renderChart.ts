interface Puntuacion {
  sesion: string;
  valor: number | null;
}

export function renderChartToCanvas(
  label: string,
  data: Puntuacion[],
  color: string,
  width = 500,
  height = 200,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  const pad = { top: 20, right: 20, bottom: 40, left: 45 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  // Background
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);

  // Title
  ctx.fillStyle = "#333";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, width / 2, 14);

  const validData = data.filter((d) => d.valor !== null) as { sesion: string; valor: number }[];

  if (validData.length < 2) {
    ctx.fillStyle = "#999";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Datos insuficientes para el gráfico", width / 2, height / 2);
    return canvas;
  }

  const values = validData.map((d) => d.valor);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;
  const padding = range * 0.1;
  const yMin = Math.floor(minVal - padding);
  const yMax = Math.ceil(maxVal + padding);

  const xScale = (i: number) => pad.left + (i / (validData.length - 1)) * chartW;
  const yScale = (v: number) => pad.top + chartH - ((v - yMin) / (yMax - yMin)) * chartH;

  // Grid lines
  ctx.strokeStyle = "#eee";
  ctx.lineWidth = 1;
  const gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    const y = pad.top + (i / gridLines) * chartH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
  }

  // Y axis labels
  ctx.fillStyle = "#888";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "right";
  for (let i = 0; i <= gridLines; i++) {
    const y = pad.top + (i / gridLines) * chartH;
    const val = yMax - (i / gridLines) * (yMax - yMin);
    ctx.fillText(String(Math.round(val)), pad.left - 6, y + 4);
  }

  // X axis labels (show a subset to avoid crowding)
  ctx.textAlign = "center";
  const maxLabels = Math.min(validData.length, 8);
  const step = Math.max(1, Math.floor(validData.length / maxLabels));
  for (let i = 0; i < validData.length; i += step) {
    const x = xScale(i);
    ctx.fillStyle = "#888";
    ctx.font = "9px sans-serif";
    ctx.fillText(validData[i].sesion, x, height - pad.bottom + 18);
  }

  // Axes
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, pad.top + chartH);
  ctx.lineTo(width - pad.right, pad.top + chartH);
  ctx.stroke();

  // Line
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i < validData.length; i++) {
    const x = xScale(i);
    const y = yScale(validData[i].valor);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Dots
  for (let i = 0; i < validData.length; i++) {
    const x = xScale(i);
    const y = yScale(validData[i].valor);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  return canvas;
}
