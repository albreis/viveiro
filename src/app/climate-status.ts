import { drawClimateMap, type ClimateMode } from "./climate-map.ts";
import type { FamilyWorld } from "../modules/colonies/types.ts";
import type { SoilClimate } from "../modules/microclimate/types.ts";
import { sampleClimate } from "../modules/microclimate/grid.ts";
let mode: ClimateMode = "water",
  lastClimate: SoilClimate | undefined;
export function installClimateControls(
  intervene: (type: string, x: number, z: number, value: number) => void,
) {
  const input = document.getElementById(
    "temperature",
  ) as HTMLInputElement | null;
  if (!input) return;
  input.oninput = () => {
    document.getElementById("temperature-value")!.textContent =
      input.value + " °C";
  };
  document
    .querySelectorAll<HTMLButtonElement>("[data-climate-map]")
    .forEach((button) => {
      button.onclick = () => {
        mode = button.dataset.climateMap === "heat" ? "heat" : "water";
        document
          .querySelectorAll<HTMLButtonElement>("[data-climate-map]")
          .forEach((v) =>
            v.setAttribute(
              "aria-pressed",
              String(v.dataset.climateMap === mode),
            ),
          );
        drawClimateMap(lastClimate, mode);
      };
    });
  input.onchange = () => intervene("temperatureC", 0, 0, Number(input.value));
}
export function renderClimateStatus(w: FamilyWorld) {
  const s = w.microclimate;
  lastClimate = s;
  drawClimateMap(s, mode);
  const input = document.getElementById(
    "temperature",
  ) as HTMLInputElement | null;
  if (input && document.activeElement !== input) {
    input.value = String(w.params.temperatureC ?? 24);
    document.getElementById("temperature-value")!.textContent =
      input.value + " °C";
  }
  const target = document.getElementById("climate-status");
  if (!target) return;
  if (!s) {
    target.textContent =
      "A água e o calor do solo serão acompanhados conforme o tempo avança.";
    return;
  }
  const water = s.water.map((v) => (v / s.capacity) * 100),
    f = (v: number) => v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  target.textContent =
    "Entorno do solo: " +
    f(Math.min(...water)) +
    "–" +
    f(Math.max(...water)) +
    "% de água nos poros · " +
    f(Math.min(...s.temperature)) +
    "–" +
    f(Math.max(...s.temperature)) +
    " °C. Chuva infiltrada: " +
    f(s.rainIn) +
    " u. · evaporação: " +
    f(s.evaporated) +
    " u.";
}
export function localClimateLabel(
  s: SoilClimate | undefined,
  p: { x: number; y: number; z: number },
) {
  const v = sampleClimate(s, p);
  return v
    ? v.temperature.toLocaleString("pt-BR", { maximumFractionDigits: 1 }) +
        " °C · água no entorno " +
        Math.round(v.water * 100) +
        "%"
    : "";
}
