import { modelMath } from "../../libs/model-math.ts";
import { BUHL_GROUPS, BUHL_CURVE_HOURS } from "./buhl-2005-data.ts";
import type { DiggingRun } from "./digging-run.ts";

/** Fraction of the final volume reached at 1/3 and 2/3 of the horizon. */
export interface CurveShape {
  atThird: number | null;
  atTwoThirds: number | null;
}
export interface GroupSummary {
  workers: number;
  runs: number;
  meanFinal: number;
  shape: CurveShape;
  finalWorkersMean: number;
}
export interface Criterion {
  id: "atividade" | "saturacao" | "escala";
  description: string;
  reference: string;
  model: string;
  passed: boolean;
}
export interface BuhlComparison {
  groups: GroupSummary[];
  reference: { slope: number; shapes: CurveShape[] };
  slope: number | null;
  criteria: Criterion[];
  reproduced: boolean;
}

const mean = (values: number[]) =>
  values.reduce((n, v) => n + v, 0) / Math.max(1, values.length);

function at(xs: readonly number[], ys: readonly number[], x: number) {
  for (let i = 1; i < xs.length; i++)
    if (x <= xs[i]) {
      const f = (x - xs[i - 1]) / (xs[i] - xs[i - 1]);
      return ys[i - 1] + f * (ys[i] - ys[i - 1]);
    }
  return ys.at(-1)!;
}

export function curveShape(xs: readonly number[], ys: readonly number[]) {
  const end = xs.at(-1)!,
    final = ys.at(-1)!;
  if (!(final > 0)) return { atThird: null, atTwoThirds: null };
  return {
    atThird: at(xs, ys, end / 3) / final,
    atTwoThirds: at(xs, ys, (2 * end) / 3) / final,
  };
}

/** Least-squares slope of log(volume) against log(workers). */
export function logLogSlope(points: { workers: number; volume: number }[]) {
  const usable = points.filter((p) => p.volume > 0 && p.workers > 0);
  if (usable.length < 2) return null;
  const xs = usable.map((p) => modelMath.log(p.workers)),
    ys = usable.map((p) => modelMath.log(p.volume)),
    mx = mean(xs),
    my = mean(ys);
  const sxx = xs.reduce((n, x) => n + (x - mx) * (x - mx), 0);
  if (sxx === 0) return null;
  return xs.reduce((n, x, i) => n + (x - mx) * (ys[i] - my), 0) / sxx;
}

export function summarizeGroup(runs: DiggingRun[]): GroupSummary {
  const ticks = runs[0].samples.map((s) => s.tick);
  const meanCurve = ticks.map((_, i) =>
    mean(runs.map((r) => r.samples[i].removed)),
  );
  return {
    workers: runs[0].workers,
    runs: runs.length,
    meanFinal: meanCurve.at(-1)!,
    shape: curveShape(ticks, meanCurve),
    finalWorkersMean: mean(runs.map((r) => r.samples.at(-1)!.workers)),
  };
}

const fmt = (v: number | null) => (v === null ? "sem dados" : v.toFixed(2));

/**
 * Compares shapes and ratios only. Model volume units and model days are not
 * converted to cm³ or hours, so absolute values are never compared.
 */
export function compareWithBuhl(runs: DiggingRun[]): BuhlComparison {
  const sizes = [...new Set(runs.map((r) => r.workers))].sort((a, b) => a - b);
  const groups = sizes.map((n) =>
    summarizeGroup(runs.filter((r) => r.workers === n)),
  );
  const referenceShapes = BUHL_GROUPS.map((g) =>
    curveShape(BUHL_CURVE_HOURS, g.curveCm3),
  );
  const referenceSlope = logLogSlope(
    BUHL_GROUPS.map((g) => ({ workers: g.workers, volume: g.volumeCm3 })),
  )!;
  const slope = logLogSlope(
    groups.map((g) => ({ workers: g.workers, volume: g.meanFinal })),
  );
  const thirds = groups.map((g) => g.shape.atThird),
    twoThirds = groups.map((g) => g.shape.atTwoThirds);
  const criteria: Criterion[] = [
    {
      id: "atividade",
      description: "Todos os grupos escavam algum volume no horizonte.",
      reference: "Todos os grupos escavaram (25 a 61 cm³ em 72 h).",
      model: groups.map((g) => g.workers + ": " + fmt(g.meanFinal)).join("; "),
      passed: groups.every((g) => g.meanFinal > 0),
    },
    {
      id: "saturacao",
      description:
        "Curva desacelera: ao menos 40% do volume final em 1/3 do tempo e 70% em 2/3.",
      reference: referenceShapes
        .map((s) => fmt(s.atThird) + " / " + fmt(s.atTwoThirds))
        .join("; "),
      model: groups
        .map((g) => fmt(g.shape.atThird) + " / " + fmt(g.shape.atTwoThirds))
        .join("; "),
      passed:
        thirds.every((v) => v !== null && v >= 0.4) &&
        twoThirds.every((v) => v !== null && v >= 0.7),
    },
    {
      id: "escala",
      description:
        "Volume final cresce com o grupo: inclinação log-log entre 0,4 e 1,0.",
      reference: referenceSlope.toFixed(2),
      model: fmt(slope),
      passed: slope !== null && slope >= 0.4 && slope <= 1,
    },
  ];
  return {
    groups,
    reference: { slope: referenceSlope, shapes: referenceShapes },
    slope,
    criteria,
    reproduced: criteria.every((c) => c.passed),
  };
}
