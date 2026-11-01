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
    ? value.toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + " ms"
    : (value / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) +
      " s";
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
    Object.assign(document.createElement("span"), { textContent: " formigas" }),
  );
  element("forecast-horizon").textContent =
    "População estimada daqui a " +
    options.days +
    (options.days === 1 ? " dia:" : " dias:");
  let note = "Previsão aguardando início.";
  if (running)
    note =
      "Calculando " +
      (progress?.completedRuns ?? 0) +
      "/" +
      options.runs +
      " futuros · " +
      Math.floor(
        (100 * (progress?.doneTicks ?? 0)) / (progress?.totalTicks || 1),
      ) +
      "%";
  else if (state.status === "complete" && result)
    note =
      "P10–P90 · " +
      result.runs +
      " cenários · início no dia " +
      (result.tick / 100).toLocaleString("pt-BR", {
        maximumFractionDigits: 1,
      }) +
      ". Intervalo exploratório, sem intervenções futuras.";
  else if (state.status === "budget")
    note =
      "Limite de trabalho atingido · " +
      (result?.runs ?? 0) +
      "/" +
      options.runs +
      " futuros concluídos. " +
      (result && result.runs >= 2
        ? "Intervalo provisório; a interrupção pode causar viés."
        : "Amostra insuficiente para exibir intervalo.");
  else if (state.status === "cancelled")
    note = "Previsão cancelada. Recalcule quando quiser.";
  else if (state.status === "error")
    note = state.error ?? "Previsão indisponível.";
  element("forecast-note").textContent = note;
  element("forecast-method-note").textContent =
    options.observation === "counts"
      ? (state.warning ??
          "Extrapolação por contagem e histórico; não simula túneis ou genética.") +
        (state.observedPoints
          ? " " + state.observedPoints + " censos recentes."
          : "")
      : "Estado completo: agentes, prole, habitat e túneis. Faixa não calibrada cientificamente.";
  const bar = element<HTMLProgressElement>("forecast-progress");
  bar.value = (progress?.doneTicks ?? 0) / (progress?.totalTicks || 1);
  bar.hidden = !progress;
  element("forecast-cost").textContent = progress
    ? duration(progress.elapsedMs) +
      " decorridos · " +
      duration(progress.activeMs) +
      " de cálculo"
    : "";
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
