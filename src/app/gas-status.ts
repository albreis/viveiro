import type { GasWorld } from "../modules/ventilation/types.ts";
import { gasFractions } from "../modules/ventilation/sensing.ts";
import { agentGasCell } from "../modules/ventilation/respiration.ts";
import { drawGasMap } from "./gas-map.ts";
import type { ColonyAgent } from "../modules/colony/types.ts";
const format = (n: number, digits = 2) =>
  n.toLocaleString("pt-BR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
export function installGasControls(
  intervene: (type: string, x: number, z: number, value: number) => void,
) {
  const input = document.getElementById("wind") as HTMLInputElement | null;
  if (!input) return;
  input.oninput = () => {
    input.style.setProperty(
      "--range",
      ((Number(input.value) + 4) / 8) * 100 + "%",
    );
    document.getElementById("wind-value")!.textContent = input.value + " u.";
  };
  input.onchange = () => intervene("windX", 0, 0, Number(input.value));
}
export function renderGasStatus(w: GasWorld) {
  const target = document.getElementById("gas-status");
  if (!target) return;
  const s = w.gases;
  const input = document.getElementById("wind") as HTMLInputElement | null;
  if (input && document.activeElement !== input) {
    input.value = String(w.params.windX ?? 0);
    input.style.setProperty(
      "--range",
      ((Number(input.value) + 4) / 8) * 100 + "%",
    );
    document.getElementById("wind-value")!.textContent = input.value + " u.";
  }
  if (!s || !s.cells.length) {
    target.textContent =
      "Sem galerias abertas. O ar externo envolve os alados.";
    return;
  }
  const air = s.cells.map((_, i) => gasFractions(s, i));
  target.textContent =
    "O₂: " +
    format(Math.min(...air.map((c) => c.oxygen)) * 100) +
    "–" +
    format(Math.max(...air.map((c) => c.oxygen)) * 100) +
    "% · CO₂: " +
    format(Math.min(...air.map((c) => c.carbon)) * 100) +
    "–" +
    format(Math.max(...air.map((c) => c.carbon)) * 100) +
    "%. " +
    w.nest.nodes.filter((n) => n.type === "entrance").length +
    " entrada(s) · respiração acumulada: " +
    format(s.consumed, 3) +
    " u. de O₂.";
  drawGasMap(w);
}
export function localGasLabel(w: GasWorld, a: ColonyAgent) {
  const i = agentGasCell(w, a),
    g = gasFractions(w.gases, i);
  return (
    "Ar " +
    (i == null ? "externo" : "local") +
    ": O₂ " +
    format(g.oxygen * 100) +
    "% · CO₂ " +
    format(g.carbon * 100) +
    "%"
  );
}
