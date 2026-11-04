import { writeStatusMetrics } from "./status-metrics.ts";
import { locale, t, message } from "../i18n/runtime.ts";
import type { GasWorld } from "../modules/ventilation/types.ts";
import { gasFractions } from "../modules/ventilation/sensing.ts";
import { agentGasCell } from "../modules/ventilation/respiration.ts";
import { drawGasMap } from "./gas-map.ts";
import type { ColonyAgent } from "../modules/colony/types.ts";
const format = (n: number, digits = 2) =>
  n.toLocaleString(locale.locale, {
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
  const entrances = w.nest.nodes.filter((n) => n.type === "entrance").length;
  if (!s || !s.cells.length) {
    writeStatusMetrics("gas", { entrances });
    message(target, "panels.gas.empty");
    return;
  }
  const air = s.cells.map((_, i) => gasFractions(s, i));
  const limits = {
    oxygenMin: format(Math.min(...air.map((c) => c.oxygen)) * 100),
    oxygenMax: format(Math.max(...air.map((c) => c.oxygen)) * 100),
    carbonMin: format(Math.min(...air.map((c) => c.carbon)) * 100),
    carbonMax: format(Math.max(...air.map((c) => c.carbon)) * 100),
  };
  writeStatusMetrics("gas", {
    oxygen: limits.oxygenMin + "–" + limits.oxygenMax + "%",
    carbon: limits.carbonMin + "–" + limits.carbonMax + "%",
    entrances,
  });
  message(target, "panels.gas.summary", {
    ...limits,
    entrances,
    consumed: format(s.consumed, 3),
  });
  drawGasMap(w);
}
export function localGasLabel(w: GasWorld, a: ColonyAgent) {
  const i = agentGasCell(w, a),
    g = gasFractions(w.gases, i);
  return t("panels.gas.agent", {
    location: t(i == null ? "panels.gas.external" : "panels.gas.local"),
    oxygen: format(g.oxygen * 100),
    carbon: format(g.carbon * 100),
  });
}
