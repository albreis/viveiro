interface Census {
  tick: number;
  population: number;
}
export function chartSummary(
  history: readonly Census[],
  tick: number,
  scenario: string,
) {
  const start = Math.max(0, Math.max(100, tick) - 3000);
  const points = history.filter((p) => p.tick >= start);
  if (!points.length)
    return `Cenário ${scenario}: sem censos retidos neste intervalo.`;
  const first = points[0],
    last = points.at(-1)!;
  const counts = points.map((p) => p.population);
  const day = (value: number) =>
    (value / 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 });
  return `Cenário ${scenario}: ${points.length} ${points.length === 1 ? "censo" : "censos"} entre os dias ${day(first.tick)} e ${day(last.tick)}. Adultos: ${first.population} no primeiro, ${last.population} no último; mínimo ${Math.min(...counts)}, máximo ${Math.max(...counts)}. Valores observados no modelo, sem previsão.`;
}
export function renderChartSummary(
  world: { tick: number; history: Census[] },
  comparison: { tick: number; history: Census[] } | null,
) {
  const target = document.getElementById("chart-summary");
  if (!target) return;
  const text =
    chartSummary(world.history, world.tick, "A") +
    (comparison ? " " + chartSummary(comparison.history, world.tick, "B") : "");
  if (target.textContent !== text) target.textContent = text;
}
