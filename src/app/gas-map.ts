import type { GasWorld } from "../modules/ventilation/types.ts";
export function drawGasMap(w: GasWorld) {
  const canvas = document.getElementById("gas-map") as HTMLCanvasElement | null,
    ctx = canvas?.getContext("2d");
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const s = w.gases;
  if (!s || !w.nest.nodes.length) return;
  const nodes = w.nest.nodes,
    projected = nodes.map((n) => ({
      x: n.x + n.z * 0.3,
      y: -n.y + n.z * 0.08,
    }));
  const xs = projected.map((p) => p.x),
    ys = projected.map((p) => p.y),
    minX = Math.min(...xs),
    minY = Math.min(...ys);
  const rangeX = Math.max(0.5, Math.max(...xs) - minX),
    rangeY = Math.max(0.5, Math.max(...ys) - minY);
  const point = (i: number) => ({
    x: 12 + ((projected[i].x - minX) / rangeX) * (canvas.width - 24),
    y: 12 + ((projected[i].y - minY) / rangeY) * (canvas.height - 24),
  });
  w.nest.links.forEach(([a, b], i) => {
    const p = point(a),
      q = point(b);
    ctx.strokeStyle = "#a2ad8b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(q.x, q.y);
    ctx.stroke();
    const flow = s.flow[i] ?? 0;
    if (Math.abs(flow) < 1e-9) return;
    const angle = Math.atan2(q.y - p.y, q.x - p.x) + (flow < 0 ? Math.PI : 0),
      x = (p.x + q.x) / 2,
      y = (p.y + q.y) / 2;
    ctx.strokeStyle = "#4c6e64";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 5 * Math.cos(angle - 0.5), y - 5 * Math.sin(angle - 0.5));
    ctx.lineTo(x, y);
    ctx.lineTo(x - 5 * Math.cos(angle + 0.5), y - 5 * Math.sin(angle + 0.5));
    ctx.stroke();
  });
  nodes.forEach((n, i) => {
    const p = point(i),
      cell = s.cells[i],
      co2 = cell ? cell.carbon / cell.volume : 0;
    ctx.fillStyle = "hsl(" + Math.max(12, 95 - co2 * 1600) + " 40% 49%)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, n.type === "entrance" ? 5 : 3.5, 0, Math.PI * 2);
    ctx.fill();
    if (n.type === "entrance") {
      ctx.strokeStyle = "#344c3b";
      ctx.stroke();
    }
  });
}
