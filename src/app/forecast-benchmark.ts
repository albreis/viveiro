import type {
  ErrorSummary,
  EvaluationRow,
} from "../modules/forecast/evaluation-metrics.ts";
interface BenchmarkReport {
  version: number;
  modelVersion: string;
  generatedAt: string;
  seeds: string[];
  origins: number[];
  horizons: number[];
  summary: ErrorSummary[];
  rows: EvaluationRow[];
  runtime: { node: string; elapsedMs: number };
}
const get = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const number = (n: number) =>
  n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
export function installForecastBenchmark(): void {
  const details = get<HTMLDetailsElement>("forecast-benchmark");
  if (!details) return;
  let report: BenchmarkReport | undefined,
    loading = false;
  const metric = get<HTMLSelectElement>("forecast-metric");
  const render = () => {
    if (!report) return;
    const chosen = metric.value as "mae" | "rmse" | "coverage",
      body = get("forecast-benchmark-rows");
    body.replaceChildren();
    for (const days of report.horizons) {
      const row = document.createElement("tr"),
        head = document.createElement("th");
      head.scope = "row";
      head.textContent = days + " d";
      row.append(head);
      for (const method of ["complete", "counts", "persistence"]) {
        const cell = document.createElement("td"),
          value = report.summary.find(
            (s) => s.days === days && s.method === method,
          );
        cell.textContent = value
          ? chosen === "coverage" && method === "persistence"
            ? "—"
            : number(value[chosen] * (chosen === "coverage" ? 100 : 1)) +
              (chosen === "coverage" ? "%" : "")
          : "—";
        row.append(cell);
      }
      body.append(row);
    }
    const n = report.seeds.length * report.origins.length,
      unique = new Map(
        report.rows.map((row) => [row.seed + ":" + row.originTick, row]),
      );
    const meanFull =
        [...unique.values()].reduce((sum, row) => sum + row.fullActiveMs, 0) /
        Math.max(1, unique.size),
      meanCounts =
        report.rows.reduce((sum, row) => sum + row.countActiveMs, 0) /
        Math.max(1, report.rows.length);
    get("forecast-benchmark-note").textContent =
      n +
      " origens em " +
      report.seeds.length +
      " seeds sintéticas; origens da mesma seed são correlacionadas. Base = contagem constante. Métodos distintos; comparação descritiva. Faixa não calibrada; base não tem intervalo.";
    get("forecast-benchmark-cost").textContent =
      "Modelo " +
      report.modelVersion +
      " · " +
      new Date(report.generatedAt).toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      }) +
      ". " +
      number(meanFull / 1000) +
      " s de cálculo completo por origem (todos os horizontes) vs " +
      number(meanCounts) +
      " ms de contagem por horizonte, em " +
      report.runtime.node +
      " sem desenho 3D. Não mede o erro deste terrário.";
  };
  metric.onchange = render;
  details.ontoggle = async () => {
    if (!details.open || report || loading) return;
    loading = true;
    try {
      const response = await fetch(
        import.meta.env.BASE_URL + "benchmarks/previsoes-v1.json",
      );
      if (!response.ok) throw new Error("unavailable");
      const value = (await response.json()) as BenchmarkReport;
      if (
        value.version !== 1 ||
        !Array.isArray(value.summary) ||
        !Array.isArray(value.rows)
      )
        throw new Error("invalid");
      report = value;
      render();
    } catch {
      get("forecast-benchmark-note").textContent =
        "Relatório indisponível nesta versão. A previsão do terrário continua independente.";
    } finally {
      loading = false;
    }
  };
}
