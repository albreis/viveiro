import { locale } from "../i18n/runtime.ts";

export function writeStatusMetrics(
  group: string,
  values: Record<string, number | string> = {},
): void {
  const list = document.getElementById(group + "-metrics");
  list?.querySelectorAll<HTMLElement>("[data-metric]").forEach((metric) => {
    const value = values[metric.dataset.metric!];
    const text =
      typeof value === "number" ? locale.number(value) : (value ?? "—");
    if (text !== metric.textContent) metric.textContent = text;
  });
}
