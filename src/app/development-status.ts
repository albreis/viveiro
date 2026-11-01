import type { FamilyWorld } from "../modules/colonies/types.ts";
import { colonyWorlds } from "../modules/colonies/types.ts";
export function renderDevelopmentStatus(w: FamilyWorld): void {
  const target = document.getElementById("development-status");
  if (!target) return;
  const brood = w.brood.filter((b) => b.development),
    losses = colonyWorlds(w).reduce(
      (n, c) => n + (c.colony.broodLosses || 0),
      0,
    );
  target.hidden = !brood.length && !losses;
  if (target.hidden) {
    target.textContent = "";
    return;
  }
  const paused = brood.filter((b) => b.development!.lastRate <= 1e-9).length,
    stressed = brood.filter((b) => b.development!.stress > 0.1).length;
  const temperatures = brood.map((b) => b.development!.lastTemperature),
    format = (x: number) =>
      x.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  target.textContent =
    brood.length +
    " cria(s) com maturação térmica · " +
    paused +
    " com crescimento parado · " +
    stressed +
    " sob estresse · " +
    losses +
    " perda(s). " +
    (temperatures.length
      ? "Entorno: " +
        format(Math.min(...temperatures)) +
        "–" +
        format(Math.max(...temperatures)) +
        " °C. "
      : "") +
    "Modelo demonstrativo; água no solo é um proxy, não umidade do ar da câmara.";
}
