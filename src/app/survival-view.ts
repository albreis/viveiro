import { survivalPopulation } from "../modules/survival/population.ts";
import { survivalMarkup } from "./survival-markup.ts";
import { deathLabels as labels } from "../modules/survival/labels.ts";
import type { FamilyWorld } from "../modules/colonies/types.ts";
import { colonyWorlds } from "../modules/colonies/types.ts";
import { ageScale, ageSurvival } from "../modules/survival/curves.ts";
import { DEATH_CAUSES } from "../modules/survival/types.ts";
export function installSurvivalControls(
  intervene: (type: string, x: number, z: number, value: number) => void,
): void {
  const panel = document.getElementById("survival-panel");
  if (!panel) return;
  panel.innerHTML = survivalMarkup;
  document.getElementById("survival-caste")!.onchange = renderCurve;
  document.getElementById("survival-challenge")!.onclick = () => {
    const selected = document.getElementById(
      "ant-select",
    ) as HTMLSelectElement | null;
    if (selected && selected.value)
      intervene("healthChallenge", 0, 0, Number(selected.value));
  };
}
function renderCurve(): void {
  const select = document.getElementById(
      "survival-caste",
    ) as HTMLSelectElement | null,
    svg = document.getElementById("survival-curve");
  if (!select || !svg) return;
  const kind = select.value;
  if (svg.dataset.caste === kind) return;
  const scale = ageScale(kind),
    points = Array.from({ length: 61 }, (_, i) => {
      const age = (2 * scale * i) / 60;
      return (
        (25 + (260 * i) / 60).toFixed(2) +
        "," +
        (95 - 80 * ageSurvival(age, kind)).toFixed(2)
      );
    }).join(" ");
  svg.dataset.caste = kind;
  svg.innerHTML =
    '<path d="M25 15 V95 H285" stroke="#a6b298" fill="none"/><polyline points="' +
    points +
    '" fill="none" stroke="#607e43" stroke-width="2"/><g fill="#61714e" font-size="9"><text x="0" y="18">100%</text><text x="8" y="98">0</text><text x="25" y="111">0</text><text x="150" y="111">' +
    scale +
    '</text><text x="255" y="111">' +
    scale * 2 +
    " dias</text></g>";
}
export function renderSurvivalStatus(w: FamilyWorld): void {
  const panel = document.getElementById("survival-panel");
  if (!panel) return;
  const worlds = colonyWorlds(w).filter((c) => c.colony.survival);
  panel.hidden = worlds.length === 0;
  if (!worlds.length) return;
  const status = document.getElementById("survival-status");
  if (!status) return;
  const ants = survivalPopulation(w),
    hurt = ants.filter((a) => (a.health ?? 100) < 99.9).length,
    infected = ants.filter((a) => (a.life?.infection ?? 0) > 0.0001).length;
  const causes = DEATH_CAUSES.map((k) => {
    const n = worlds.reduce((n, c) => n + c.colony.survival!.causes[k], 0);
    return n ? labels[k] + ": " + n : "";
  }).filter(Boolean);
  status.textContent =
    ants.length +
    " adulta(s) acompanhadas · " +
    hurt +
    " ferida(s) · " +
    infected +
    " com carga infecciosa modelada. Mortes: " +
    (causes.join(" · ") || "nenhuma registrada") +
    ". Energia e ferimentos são estados diferentes.";
  renderCurve();
  const button = document.getElementById(
      "survival-challenge",
    ) as HTMLButtonElement | null,
    selected = (
      document.getElementById("ant-select") as HTMLSelectElement | null
    )?.value;
  if (button) button.disabled = !ants.some((a) => String(a.id) === selected);
}
