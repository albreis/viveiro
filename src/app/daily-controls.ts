import { locale, t, message, messageSource } from "../i18n/runtime.ts";
import {
  dailyCsv,
  scenarioSamples,
  type ObservationScenario,
} from "../modules/observations/csv.ts";
interface DailyContext {
  scenarios(): ObservationScenario[];
  lesson(): string;
}
const number = (v: number | null) =>
  v === null
    ? t("data.daily.missing")
    : v.toLocaleString(locale.locale, { maximumFractionDigits: 3 });
export function installDailyControls(context: DailyContext) {
  const host = document.querySelector<HTMLDetailsElement>("#daily-data");
  if (!host) return { render() {} };
  host.innerHTML = `
    <summary id="daily-summary" data-i18n="interface.daily.title"></summary>
    <p id="daily-description" data-i18n="interface.daily.description"></p>
    <button id="export-daily" type="button" aria-describedby="daily-description" data-i18n="interface.daily.download"></button>
    <p id="daily-status" role="status"></p>
    <p id="daily-coverage"></p>
    <div id="daily-table" class="daily-table" role="region" tabindex="0" data-i18n-aria-label="interface.daily.label"><table>
      <caption data-i18n="interface.daily.caption"></caption>
      <thead><tr><th scope="col" data-i18n="interface.daily.scenario"></th><th scope="col" data-i18n="interface.daily.day"></th><th scope="col" data-i18n="interface.daily.sample"></th><th scope="col" data-i18n="interface.daily.adults"></th><th scope="col" data-i18n="interface.daily.brood"></th><th scope="col" data-i18n="interface.daily.food"></th><th scope="col" data-i18n="interface.daily.air"></th><th scope="col" data-i18n="interface.daily.soil"></th><th scope="col">O₂ (% vol.)</th><th scope="col">CO₂ (% vol.)</th></tr></thead>
      <tbody id="daily-rows"></tbody>
    </table></div>`;
  const rows = host.querySelector<HTMLTableSectionElement>("#daily-rows")!;
  const coverage = host.querySelector<HTMLElement>("#daily-coverage")!;
  let signature = "";
  const render = () => {
    if (!host.open) return;
    const scenarios = context.scenarios();
    const readings = scenarios.map(({ id, world }) => ({
      id,
      world,
      samples: scenarioSamples(world, 10),
    }));
    const next =
      locale.locale +
      JSON.stringify(
        readings.map(({ id, world, samples }) => ({
          id,
          seed: world.seed,
          started: world.dailyObservations?.startedTick,
          discarded: world.dailyObservations?.discarded,
          samples,
        })),
      );
    if (next === signature) return;
    signature = next;
    rows.replaceChildren();
    messageSource(
      coverage,
      scenarios
        .map(({ id, world: w }) => {
          const s = w.dailyObservations;
          return t("data.daily.coverage", {
            scenario: id.toUpperCase(),
            count: s?.points.length ?? 0,
            day: number((s?.startedTick ?? w.tick) / 100),
            discarded: s?.discarded ?? 0,
          });
        })
        .join(" "),
    );
    for (const { id, samples } of readings)
      for (const { point: p, kind } of samples.slice(-10)) {
        const tr = document.createElement("tr");
        for (const text of [
          id.toUpperCase(),
          number(p.tick / 100),
          kind === "estado_inicial"
            ? t("data.daily.initial")
            : kind === "fechamento_diario"
              ? t("data.daily.closing")
              : t("data.daily.now"),
          p.population,
          p.brood,
          number(p.food),
          number(p.airTemperatureC),
          number(p.soilTemperatureC),
          number(p.oxygenPercent),
          number(p.carbonDioxidePercent),
        ]) {
          const td = document.createElement("td");
          td.textContent = String(text);
          tr.append(td);
        }
        rows.append(tr);
      }
  };
  host.addEventListener("toggle", () => {
    signature = "";
    render();
  });
  host.querySelector<HTMLButtonElement>("#export-daily")!.onclick = () => {
    const scenarios = context.scenarios();
    const url = URL.createObjectURL(
      new Blob([dailyCsv(scenarios, context.lesson())], {
        type: "text/csv;charset=utf-8",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download =
      "viveiro-diario-" +
      scenarios[0].world.seed.replace(/[^a-z0-9_-]/gi, "_").slice(0, 64) +
      ".csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    message(host.querySelector("#daily-status")!, "data.daily.exported");
  };
  return { render };
}
