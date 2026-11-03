import { locale, t, messageSource, clearMessage } from "../i18n/runtime.ts";
import type { FamilyWorld } from "../modules/colonies/types.ts";
import { colonyWorlds } from "../modules/colonies/types.ts";
export function renderDevelopmentStatus(w: FamilyWorld): void {
  const inspect = document.getElementById(
    "focus-brood",
  ) as HTMLButtonElement | null;
  if (inspect) inspect.disabled = !w.brood.length;
  const target = document.getElementById("development-status");
  if (!target) return;
  const brood = w.brood.filter((b) => b.development),
    losses = colonyWorlds(w).reduce(
      (n, c) => n + (c.colony.broodLosses || 0),
      0,
    ),
    cocoons = brood.filter((b) => b.cocoon?.built).length;
  target.hidden = !brood.length && !losses;
  if (target.hidden) {
    clearMessage(target);
    return;
  }
  const paused = brood.filter((b) => b.development!.lastRate <= 1e-9).length,
    stressed = brood.filter((b) => b.development!.stress > 0.1).length;
  const temperatures = brood.map((b) => b.development!.lastTemperature),
    format = (x: number) =>
      x.toLocaleString(locale.locale, { maximumFractionDigits: 1 });
  messageSource(
    target,
    t("panels.development", {
      brood: brood.length,
      paused,
      stressed,
      losses,
      cocoons,
    }) +
      (temperatures.length
        ? t("panels.development.temperature", {
            min: format(Math.min(...temperatures)),
            max: format(Math.max(...temperatures)),
          })
        : "") +
      t("panels.development.note"),
  );
}

export function installBroodInspection(
  scene: () => { focusBrood(): string; showInterior: boolean } | null,
  notice: (message: string) => void,
): void {
  const button = document.getElementById("focus-brood") as HTMLButtonElement;
  button.onclick = () => {
    const current = scene();
    if (!current) return;
    notice(current.focusBrood());
    (document.getElementById("interior") as HTMLInputElement).checked =
      current.showInterior;
    document
      .getElementById("viewport")
      ?.scrollIntoView({ block: "center", behavior: "smooth" });
  };
}
