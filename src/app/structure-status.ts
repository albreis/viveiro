import { locale, message } from "../i18n/runtime.ts";
import type { SoilWorld } from "../modules/soil/types.ts";
export function renderStructureStatus(w: SoilWorld) {
  const target = document.getElementById("structure-status"),
    button = document.getElementById(
      "focus-structure",
    ) as HTMLButtonElement | null;
  if (!target) return;
  const s = w.soil.structure;
  if (button) button.disabled = !s?.patches.length;
  if (!s?.patches.length) {
    message(target, "panels.structure.wait");
    return;
  }
  const unstable = s.patches.filter((p) => p.safety < 1).length,
    min = Math.min(...s.patches.map((p) => p.safety));
  message(target, "panels.structure", {
    samples: s.patches.length,
    unstable,
    margin: locale.number(min, { maximumFractionDigits: 2 }),
    failures: s.failures,
  });
}
