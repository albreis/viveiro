import type { SoilClimate } from "../modules/microclimate/types.ts";
import { cellIndex } from "../modules/microclimate/grid.ts";
export type ClimateMode = "water" | "heat";
export function drawClimateMap(s: SoilClimate | undefined, mode: ClimateMode) {
  const canvas = document.getElementById(
      "climate-map",
    ) as HTMLCanvasElement | null,
    ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!s) return;
  const dx = canvas.width / s.width,
    dy = canvas.height / s.layers,
    z = Math.floor(s.rows / 2);
  for (let y = 0; y < s.layers; y++)
    for (let x = 0; x < s.width; x++) {
      const i = cellIndex(s, x, y, z),
        v =
          mode === "water"
            ? s.water[i] / s.capacity
            : Math.max(0, Math.min(1, (s.temperature[i] + 5) / 50));
      ctx.fillStyle =
        mode === "water"
          ? "hsl(195 " + (35 + v * 35) + "% " + (92 - v * 50) + "%)"
          : "hsl(" + (240 - v * 240) + " 52% 59%)";
      ctx.fillRect(x * dx, y * dy, Math.ceil(dx), Math.ceil(dy));
    }
  canvas.setAttribute(
    "aria-label",
    mode === "water"
      ? "Corte central do solo: saturação dos poros por água, de zero a cem por cento"
      : "Corte central do solo: temperatura de menos cinco a quarenta e cinco graus Celsius",
  );
  const caption = document.getElementById("climate-map-caption");
  if (caption)
    caption.textContent =
      (mode === "water"
        ? "Água nos poros: claro 0% → azul 100%"
        : "Temperatura: azul ≤−5 °C → vermelho ≥45 °C") +
      " · superfície acima, fundo abaixo.";
}
