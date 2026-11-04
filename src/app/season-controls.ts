import { locale, t, messageSource } from "../i18n/runtime.ts";
import type { MessageKey } from "../i18n/catalogs.ts";
import type { FamilyWorld } from "../modules/colonies/types.ts";
import { colonyWorlds } from "../modules/colonies/types.ts";
import { seasonFactors } from "../modules/seasons/update.ts";
import { SEASON_PARAMETERS } from "../modules/seasons/types.ts";
import { TICKS_PER_DAY } from "../modules/simulation/constants.js";
export function installSeasonControls(
  intervene: (type: string, x: number, z: number, value: number) => void,
): void {
  const input = document.getElementById("photoperiod") as HTMLInputElement;
  input.oninput = () =>
    intervene("photoperiodHours", 0, 0, Number(input.value));
}
export function renderSeasonStatus(w: FamilyWorld): void {
  const panel = document.getElementById("season-panel")!,
    status = document.getElementById("season-status")!;
  const colonies = colonyWorlds(w).filter((c) => c.colony.season);
  panel.hidden = !colonies.length;
  if (panel.hidden) return;
  const input = document.getElementById("photoperiod") as HTMLInputElement;
  if (document.activeElement !== input)
    input.value = String(w.params.photoperiodHours ?? 12);
  input.style.setProperty("--range", (Number(input.value) / 24) * 100 + "%");
  document.getElementById("photoperiod-value")!.textContent =
    input.value + " h";
  const format = (x: number) =>
    x.toLocaleString(locale.locale, { maximumFractionDigits: 1 });
  messageSource(
    status,
    colonies
      .map((c) => {
        const state = c.colony.season!,
          factors = seasonFactors(c);
        return t("panels.season", {
          id: c.colonyId || 1,
          phase: t(("panels.season." + state.phase) as MessageKey),
          temperature: format(state.lastTemperature),
          active: format(state.activeTicks / TICKS_PER_DAY),
          activeDays: SEASON_PARAMETERS.activeDays,
          chill: format(state.chillTicks / TICKS_PER_DAY),
          chillDays: SEASON_PARAMETERS.chillDays,
          laying: format(100 * factors.laying),
          cycles: state.cycles,
        });
      })
      .join(" ") + t("panels.season.note"),
  );
}
