import { locale, t, messageSource } from "../i18n/runtime.ts";
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
  if (!points.length) return t("status.chart.empty", { scenario });
  const first = points[0],
    last = points.at(-1)!;
  const counts = points.map((p) => p.population);
  const day = (value: number) =>
    (value / 100).toLocaleString(locale.locale, { maximumFractionDigits: 2 });
  return t("status.chart.summary", {
    scenario,
    count: points.length,
    census: t(
      points.length === 1 ? "status.chart.singular" : "status.chart.plural",
    ),
    firstDay: day(first.tick),
    lastDay: day(last.tick),
    first: first.population,
    last: last.population,
    min: Math.min(...counts),
    max: Math.max(...counts),
  });
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
  messageSource(target, text);
}
