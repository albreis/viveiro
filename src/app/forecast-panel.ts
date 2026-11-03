import { locale, t, message, messageSource } from "../i18n/runtime.ts";
import { translateSource } from "../i18n/source.ts";
import type { CountObservation } from "../modules/forecast/observations.ts";
import type { ForecastClient } from "../services/forecast-client.ts";
import type {
  ForecastState,
  ForecastOptions,
  ForecastSnapshot,
} from "../modules/forecast/types.ts";
const element = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const duration = (value: number) =>
  value < 1000
    ? value.toLocaleString(locale.locale, { maximumFractionDigits: 1 }) + " ms"
    : (value / 1000).toLocaleString(locale.locale, {
        maximumFractionDigits: 1,
      }) + " s";
export function renderForecast(
  state: ForecastState,
  scenario: string,
  options: ForecastOptions,
): void {
  const same = state.scenario === scenario,
    result = same ? state.result : null,
    progress = same ? state.progress : undefined;
  const running = state.status === "running",
    value = element("forecast-value");
  value.replaceChildren(
    document.createTextNode(
      result && result.runs >= 2
        ? result.low === result.high
          ? String(result.low)
          : result.low + "–" + result.high
        : "—",
    ),
    Object.assign(document.createElement("span"), {
      textContent: " " + t("terrarium.ants.unit"),
    }),
  );
  message(
    element("forecast-horizon"),
    options.days === 1 ? "forecast.horizon.one" : "forecast.horizon.many",
    { days: options.days },
  );
  let note = t("terrarium.forecast.wait");
  if (running)
    note = t("forecast.running", {
      completed: progress?.completedRuns ?? 0,
      runs: options.runs,
      percent: Math.floor(
        (100 * (progress?.doneTicks ?? 0)) / (progress?.totalTicks || 1),
      ),
    });
  else if (state.status === "complete" && result)
    note = t("forecast.complete", {
      runs: result.runs,
      day: locale.number(result.tick / 100, { maximumFractionDigits: 1 }),
    });
  else if (state.status === "budget")
    note =
      t("forecast.budget", {
        completed: result?.runs ?? 0,
        runs: options.runs,
      }) +
      t(
        result && result.runs >= 2
          ? "forecast.provisional"
          : "forecast.insufficient",
      );
  else if (state.status === "cancelled") note = t("forecast.cancelled");
  else if (state.status === "error")
    note = state.error
      ? translateSource(state.error, locale.locale)
      : t("forecast.unavailable");
  messageSource(element("forecast-note"), note);
  messageSource(
    element("forecast-method-note"),
    options.observation === "counts"
      ? (state.warning
          ? translateSource(state.warning, locale.locale)
          : t("forecast.counts")) +
          (state.observedPoints
            ? t("forecast.censuses", { count: state.observedPoints })
            : "")
      : t("forecast.full"),
  );
  const bar = element<HTMLProgressElement>("forecast-progress");
  bar.value = (progress?.doneTicks ?? 0) / (progress?.totalTicks || 1);
  bar.hidden = !progress;
  messageSource(
    element("forecast-cost"),
    progress
      ? t("forecast.cost", {
          elapsed: duration(progress.elapsedMs),
          active: duration(progress.activeMs),
        })
      : "",
  );
  element<HTMLButtonElement>("forecast-cancel").disabled = !running;
  element<HTMLButtonElement>("forecast-run").disabled = running;
}
export function installForecastControls(
  client: ForecastClient,
  snapshot: () => ForecastSnapshot | CountObservation,
  scenario: () => string,
): void {
  element("forecast-run").onclick = () =>
    client.request(snapshot(), scenario());
  element("forecast-cancel").onclick = () => client.cancel();
  const mode = element<HTMLSelectElement>("forecast-observation");
  mode.value = client.options.observation ?? "complete";
  mode.onchange = () => {
    client.options.observation =
      mode.value === "counts" ? "counts" : "complete";
    client.invalidate();
  };
  for (const [id, key, multiplier] of [
    ["forecast-days", "days", 1],
    ["forecast-runs", "runs", 1],
    ["forecast-budget", "budgetMs", 1000],
  ] as const) {
    const input = element<HTMLSelectElement>(id);
    input.value = String(client.options[key] / multiplier);
    input.onchange = () => {
      client.options[key] = Number(input.value) * multiplier;
      client.invalidate();
    };
  }
}
