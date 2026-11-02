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
    ? "sem leitura"
    : v.toLocaleString("pt-BR", { maximumFractionDigits: 3 });
export function installDailyControls(context: DailyContext) {
  const host = document.querySelector<HTMLDetailsElement>("#daily-data");
  if (!host) return { render() {} };
  host.innerHTML = `
    <summary id="daily-summary">Dados observados · CSV diário</summary>
    <p id="daily-description">Uma amostra ao final de cada dia do modelo (100 ticks), sem médias temporais nem previsões. A/B são exportados juntos. Vazios indicam ausência de leitura.</p>
    <button id="export-daily" type="button" aria-describedby="daily-description">Baixar CSV diário</button>
    <p id="daily-status" role="status"></p>
    <p id="daily-coverage"></p>
    <div id="daily-table" class="daily-table" role="region" tabindex="0" aria-label="Tabela de observações; use as setas para ver todas as colunas"><table>
      <caption>Até 10 amostras mais recentes por cenário. Totais de todas as colônias; dados completos no CSV.</caption>
      <thead><tr><th scope="col">Cenário</th><th scope="col">Dia</th><th scope="col">Amostra</th><th scope="col">Adultos</th><th scope="col">Prole</th><th scope="col">Alimento (u.)</th><th scope="col">Ar (°C)</th><th scope="col">Solo médio (°C)</th><th scope="col">O₂ (% vol.)</th><th scope="col">CO₂ (% vol.)</th></tr></thead>
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
    const next = JSON.stringify(
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
    coverage.textContent = scenarios
      .map(({ id, world: w }) => {
        const s = w.dailyObservations;
        return `Cenário ${id.toUpperCase()}: ${s?.points.length ?? 0} amostras diárias registradas; coleta desde D${number((s?.startedTick ?? w.tick) / 100)}; ${s?.discarded ?? 0} dias antigos descartados. Histórico anterior sem leituras não é reconstruído.`;
      })
      .join(" ");
    for (const { id, samples } of readings)
      for (const { point: p, kind } of samples.slice(-10)) {
        const tr = document.createElement("tr");
        for (const text of [
          id.toUpperCase(),
          number(p.tick / 100),
          kind === "estado_inicial"
            ? "Inicial"
            : kind === "fechamento_diario"
              ? "Fechamento diário"
              : "Agora",
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
    host.querySelector("#daily-status")!.textContent =
      "CSV gerado com dias observados e amostra atual. Ao importar em planilha, use UTF-8, vírgula como separador e ponto decimal.";
  };
  return { render };
}
