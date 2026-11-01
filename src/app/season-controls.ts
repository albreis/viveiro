import type { FamilyWorld } from "../modules/colonies/types.ts";
import { colonyWorlds } from "../modules/colonies/types.ts";
import { seasonFactors } from "../modules/seasons/update.ts";
import { SEASON_PARAMETERS } from "../modules/seasons/types.ts";
import { TICKS_PER_DAY } from "../modules/simulation/constants.js";
const labels = {
  active: "Ativa",
  preparing: "Preparando repouso",
  dormant: "Diapausa reprodutiva",
  resuming: "Retomada gradual",
};
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
  document.getElementById("photoperiod-value")!.textContent =
    input.value + " h";
  const format = (x: number) =>
    x.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  status.textContent =
    colonies
      .map((c) => {
        const s = c.colony.season!,
          f = seasonFactors(c);
        return (
          "Colônia " +
          (c.colonyId || 1) +
          ": " +
          labels[s.phase] +
          " · " +
          format(s.lastTemperature) +
          " °C locais · atividade " +
          format(s.activeTicks / TICKS_PER_DAY) +
          "/" +
          SEASON_PARAMETERS.activeDays +
          " dias do modelo · frio " +
          format(s.chillTicks / TICKS_PER_DAY) +
          "/" +
          SEASON_PARAMETERS.chillDays +
          " dias do modelo · postura " +
          format(100 * f.laying) +
          "% sazonal · ciclo " +
          s.cycles +
          "."
        );
      })
      .join(" ") +
    " Aquecer sozinho não apaga a memória. Fotoperíodo é duração da luz, separado da intensidade solar. Por enquanto é um sinal sazonal, sem ciclo visual de dia/noite.";
}
