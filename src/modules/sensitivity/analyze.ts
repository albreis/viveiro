import type { MorrisDesign } from "./design.ts";
import type { ExperimentParameter } from "../experiments/parameters.ts";
import { finalMetrics, morrisMetrics, type MorrisMetric } from "./metrics.ts";
import type { SweepRecord } from "../sweeps/checkpoint.ts";
export function elementaryStatistics(values: number[]) {
  const n = values.length;
  if (!n) return { n, mu: null, muStar: null, sigma: null };
  if (values.some((v) => !Number.isFinite(v)))
    throw Error("Efeito elementar não finito.");
  const mu = values.reduce((a, b) => a + b, 0) / n;
  return {
    n,
    mu,
    muStar: values.reduce((a, b) => a + Math.abs(b), 0) / n,
    sigma:
      n < 2
        ? null
        : Math.sqrt(
            values.reduce((a, b) => a + (b - mu) * (b - mu), 0) / (n - 1),
          ),
  };
}
export function analyzeMorris(design: MorrisDesign, records: SweepRecord[]) {
  if (records.length !== design.jobs.length)
    throw Error("Morris requer todas as execuções.");
  const byId = new Map(records.map((r) => [r.id, r]));
  if (byId.size !== records.length) throw Error("Resultado duplicado.");
  const response = design.jobs.map((job) => {
    const result = byId.get(job.id);
    if (!result) throw Error("Execução ausente: " + job.id);
    return { ...job, metrics: finalMetrics(result.result.csv) };
  });
  const averages = new Map<string, Record<MorrisMetric, number | null>>();
  for (const point of design.points) {
    const runs = response.filter(
      (r) => r.trajectory === point.trajectory && r.point === point.point,
    );
    const means = {} as Record<MorrisMetric, number | null>;
    for (const key of Object.keys(morrisMetrics) as MorrisMetric[]) {
      const values = runs.map((r) => r.metrics[key]);
      means[key] = values.some((v) => v === null)
        ? null
        : (values as number[]).reduce((a, b) => a + b, 0) / values.length;
    }
    averages.set(point.trajectory + ":" + point.point, means);
  }
  const effects: Record<
    string,
    {
      trajectory: number;
      parameter: ExperimentParameter;
      value: number | null;
    }[]
  > = {};
  for (const metric of Object.keys(morrisMetrics) as MorrisMetric[]) {
    effects[metric] = [];
    for (let i = 0; i < design.points.length; i++) {
      const next = design.points[i];
      if (!next.changed) continue;
      const previous = design.points[i - 1],
        key = next.changed;
      const a = averages.get(previous.trajectory + ":" + previous.point)![
          metric
        ],
        b = averages.get(next.trajectory + ":" + next.point)![metric];
      const step = next.normalized[key] - previous.normalized[key];
      if (Math.abs(step) < 1e-12) throw Error("Passo Morris nulo.");
      effects[metric].push({
        trajectory: next.trajectory,
        parameter: key,
        value: a === null || b === null ? null : (b - a) / step,
      });
    }
  }
  const rankings = Object.fromEntries(
    Object.entries(effects).map(([metric, values]) => [
      metric,
      design.dimensions
        .map((parameter) => ({
          parameter,
          ...elementaryStatistics(
            values
              .filter((v) => v.parameter === parameter && v.value !== null)
              .map((v) => v.value!),
          ),
        }))
        .sort(
          (a, b) =>
            (b.muStar ?? -1) - (a.muStar ?? -1) ||
            (a.parameter < b.parameter ? -1 : 1),
        ),
    ]),
  );
  return {
    schema: "viveiro-morris-results-v1",
    modelVersion: design.modelVersion,
    designId: design.id,
    calibrated: false,
    primaryMetric: "population",
    rankings,
    effects,
    responses: response.map(
      ({ id, trajectory, point, replicate, metrics }) => ({
        id,
        trajectory,
        point,
        replicate,
        metrics,
      }),
    ),
  };
}
