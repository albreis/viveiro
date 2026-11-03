import { locale, message } from "../i18n/runtime.ts";
import type { FamilyWorld } from "../modules/colonies/types.ts";
import {
  readSoilMaterial,
  transportFactors,
} from "../modules/soil-material/coefficients.ts";
const fields = [
  {
    id: "soil-clay",
    key: "soilClayPercent",
    label: "panels.material.clay",
    unit: "%",
  },
  {
    id: "soil-compaction",
    key: "soilCompactionPercent",
    label: "panels.material.compaction",
    unit: "/100",
  },
] as const;
export function installMaterialControls(
  intervene: (type: string, x: number, z: number, value: number) => void,
): void {
  const panel = document.getElementById("soil-material-panel");
  if (!panel) return;
  panel.innerHTML =
    fields
      .map(
        (f) =>
          '<label for="' +
          f.id +
          '"><span data-i18n="' +
          f.label +
          '"></span>' +
          ' <strong id="' +
          f.id +
          '-value"></strong></label><input id="' +
          f.id +
          '" type="range" min="0" max="100" step="1" data-i18n-aria-label="' +
          f.label +
          '">',
      )
      .join("") +
    '<p id="soil-material-status" class="field-note"></p><p class="field-note" data-i18n="panels.material.note"></p>';
  for (const f of fields) {
    const input = document.getElementById(f.id) as HTMLInputElement;
    input.oninput = () => {
      document.getElementById(f.id + "-value")!.textContent =
        input.value + f.unit;
    };
    input.onchange = () => intervene(f.key, 0, 0, Number(input.value));
  }
}
export function renderMaterialStatus(w: FamilyWorld): void {
  const panel = document.getElementById("soil-material-panel")!,
    mix = readSoilMaterial(w);
  panel.hidden = !mix;
  if (!mix) return;
  for (const f of fields) {
    const input = document.getElementById(f.id) as HTMLInputElement | null;
    if (!input) return;
    if (document.activeElement !== input) input.value = String(w.params[f.key]);
    document.getElementById(f.id + "-value")!.textContent =
      input.value + f.unit;
  }
  const factors = transportFactors(mix),
    number = (n: number) =>
      n.toLocaleString(locale.locale, { maximumFractionDigits: 2 });
  message(document.getElementById("soil-material-status")!, "panels.material", {
    capillary: number(factors.capillary),
    drainage: number(factors.drainage),
    heat: number(factors.heat),
  });
}
