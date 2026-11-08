export type Point = [number, number];
export interface Series {
  name: string;
  points: Point[];
  color: string;
  dash?: boolean;
}
const W = 924,
  INK = "#203c34",
  GRID = "#d9e0d6";
export const C = {
  green: "#008474",
  purple: "#9473aa",
  gold: "#a16e28",
  gray: "#9ca8a1",
  blue: "#387ba2",
};
export const num = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
const esc = (s: string) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
export function legend(series: Pick<Series, "name" | "color" | "dash">[]) {
  return `<div class="legend">${series.map((s) => `<span style="--key:${s.color}"><i class="${s.dash ? "dashed" : ""}"></i>${esc(s.name)}</span>`).join("")}</div>`;
}
export function lineChart(
  series: Series[],
  maxY: number,
  height = 450,
  compact = false,
  readingBand = false,
) {
  const left = 72,
    right = 25,
    top = 20,
    bottom = compact ? 46 : 64,
    ph = height - top - bottom,
    pw = W - left - right;
  const x = (v: number) => left + (v / 72) * pw,
    y = (v: number) => top + ph - (v / maxY) * ph;
  const yticks = [0, maxY / 2, maxY],
    xticks = compact ? [0, 36, 72] : [0, 12, 24, 36, 48, 60, 72];
  const grid = yticks
    .map(
      (v) =>
        `<line x1="${left}" y1="${y(v)}" x2="${W - right}" y2="${y(v)}" stroke="${GRID}"/><text x="${left - 14}" y="${y(v) + 9}" text-anchor="end">${num(v, Number.isInteger(v) ? 0 : 1)}</text>`,
    )
    .join("");
  const xt = xticks
    .map(
      (v) =>
        `<text x="${x(v)}" y="${height - (compact ? 9 : 31)}" text-anchor="middle">${v}</text>`,
    )
    .join("");
  const observation = series.find((s) => s.name.includes("Buhl"));
  const band =
    readingBand && observation
      ? `<polygon points="${[...observation.points.map(([t, v]) => `${x(t)},${y(t === 0 ? 0 : Math.max(0, v - 3))}`), ...observation.points.toReversed().map(([t, v]) => `${x(t)},${y(t === 0 ? 0 : Math.min(maxY, v + 3))}`)].join(" ")}" fill="${C.gold}" opacity=".13"/>`
      : "";
  const paths = series
    .map(
      (s) =>
        `<polyline points="${s.points.map(([t, v]) => `${x(t)},${y(v)}`).join(" ")}" stroke="${s.color}" stroke-width="${compact ? 5 : 6}" fill="none" ${s.dash ? 'stroke-dasharray="9 9"' : ""}/>${s.points.map(([t, v]) => `<circle cx="${x(t)}" cy="${y(v)}" r="${compact ? 4 : 5}" fill="${s.color}"/>`).join("")}`,
    )
    .join("");
  return `<svg class="chart" viewBox="0 0 ${W} ${height}" role="img" aria-label="Curvas de volume escavado"><g fill="${INK}" font-family="Arial,sans-serif" font-size="${compact ? 23 : 26}">${grid}${xt}${band}${paths}${compact ? "" : `<text x="${W / 2}" y="${height - 2}" text-anchor="middle">Tempo (horas)</text>`}</g></svg>`;
}
export interface BarRow {
  label: string;
  values: { value: number; color: string; name: string }[];
}
export function bars(
  rows: BarRow[],
  max: number,
  height = 450,
  reference?: number,
  precision = 2,
) {
  const left = 220,
    right = 90,
    pw = W - left - right,
    top = 25,
    bottom = 30,
    rowH = (height - top - bottom) / rows.length;
  const labelRows = rows
    .map((row, i) => {
      const mid = top + rowH * (i + 0.5),
        bw = Math.min(34, (rowH - 26) / row.values.length);
      const labels = row.label.split("|");
      return (
        `<text x="0" y="${mid + 9 - (labels.length - 1) * 15}" font-size="28">${labels.map((t, k) => `<tspan x="0" dy="${k ? 32 : 0}">${esc(t)}</tspan>`).join("")}</text>` +
        row.values
          .map((v, j) => {
            const y =
              mid + (j - (row.values.length - 1) / 2) * (bw + 8) - bw / 2;
            return `<rect x="${left}" y="${y}" width="${(v.value / max) * pw}" height="${bw}" fill="${v.color}"/><text x="${left + (v.value / max) * pw + 12}" y="${y + bw * 0.78}" font-size="26">${num(v.value, precision)}</text>`;
          })
          .join("")
      );
    })
    .join("");
  const ref =
    reference === undefined
      ? ""
      : `<line x1="${left + (reference / max) * pw}" y1="10" x2="${left + (reference / max) * pw}" y2="${height - bottom}" stroke="${C.gold}" stroke-width="3" stroke-dasharray="8 7"/>`;
  return `<svg class="chart" viewBox="0 0 ${W} ${height}" role="img" aria-label="Comparação de volumes"><g fill="${INK}" font-family="Arial,sans-serif">${ref}${labelRows}</g></svg>`;
}
