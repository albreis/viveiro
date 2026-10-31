const $ = (id) => document.getElementById(id);
const format = (n) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(n);
export function drawChart(world, comparison) {
  const canvas = $("chart"),
    r = canvas.getBoundingClientRect();
  if (!r.width || !r.height) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2),
    width = r.width,
    height = r.height;
  if (
    canvas.width !== Math.round(width * dpr) ||
    canvas.height !== Math.round(height * dpr)
  ) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  const left = 24,
    right = 6,
    top = 9,
    bottom = 18,
    w = width - left - right,
    h = height - top - bottom;
  const maxTick = Math.max(100, world.tick),
    minTick = Math.max(0, maxTick - 3000);
  const histories = [
    world.history,
    ...(comparison ? [comparison.history] : []),
  ];
  const maxValue = Math.max(
    5,
    ...histories
      .flat()
      .filter((p) => p.tick >= minTick)
      .map((p) => p.population),
  );
  const max = Math.ceil(maxValue / 5) * 5;
  ctx.font = "8px Arial";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let i = 0; i < 3; i++) {
    const y = top + (h * i) / 2;
    ctx.strokeStyle = "#e3e8d9";
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(width - right, y);
    ctx.stroke();
    ctx.fillStyle = "#a4ad97";
    ctx.fillText(String(Math.round(max * (1 - i / 2))), left - 6, y);
  }
  histories.forEach((history, index) => {
    const points = history.filter((p) => p.tick >= minTick);
    if (points.length < 1) return;
    const coords = points.map((p) => [
      left + ((p.tick - minTick) / (maxTick - minTick)) * w,
      top + h - (p.population / max) * h,
    ]);
    if (!index) {
      const gradient = ctx.createLinearGradient(0, top, 0, height);
      gradient.addColorStop(0, "#9bb67a45");
      gradient.addColorStop(1, "#9bb67a00");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(coords[0][0], top + h);
      coords.forEach((p) => ctx.lineTo(...p));
      ctx.lineTo(coords.at(-1)[0], top + h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = index ? "#bd8c57" : "#698747";
    ctx.lineWidth = 1.7;
    ctx.setLineDash(index ? [4, 3] : []);
    ctx.beginPath();
    coords.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p)));
    ctx.stroke();
    ctx.setLineDash([]);
    const last = coords.at(-1);
    ctx.beginPath();
    ctx.arc(...last, 2.4, 0, Math.PI * 2);
    ctx.fillStyle = index ? "#bd8c57" : "#698747";
    ctx.fill();
  });
  ctx.textAlign = "left";
  ctx.fillStyle = "#a4ad97";
  ctx.fillText(format(minTick / 100), left, height - 5);
  ctx.textAlign = "right";
  ctx.fillText(format(maxTick / 100), width - right, height - 5);
}
