import metadata from "../../../package.json" with { type: "json" };
import {
  parameterRanges,
  type ExperimentParameter,
} from "../experiments/parameters.ts";
import {
  normalizeExperiment,
  type ExperimentPlan,
} from "../experiments/plan.ts";
import { hashSeed } from "../simulation/seed.ts";
import { sha256 } from "../sweeps/jobs.ts";
export const morrisRanges = {
  humidity: [45, 85],
  light: [35, 85],
  randomness: [10, 60],
  reposeAngle: [20, 50],
  temperatureC: [18, 30],
  windX: [-1.5, 1.5],
  windZ: [-1.5, 1.5],
  photoperiodHours: [8, 16],
  initialFood: [10, 24],
  initialRainPulse: [0, 0.4],
  surfaceDiffusionScale: [0.5, 1.5],
  surfaceEvaporationScale: [0.5, 1.5],
} as const;
export interface MorrisOptions {
  seed: string;
  levels: number;
  trajectories: number;
  replicates: number;
  days: number;
}
export interface MorrisPoint {
  trajectory: number;
  point: number;
  normalized: Record<ExperimentParameter, number>;
  parameters: ExperimentPlan["parameters"];
  changed: ExperimentParameter | null;
}
export interface MorrisJob {
  id: string;
  trajectory: number;
  point: number;
  replicate: number;
  plan: ExperimentPlan;
}
export interface MorrisDesign {
  schema: "viveiro-morris-v1";
  modelVersion: string;
  id: string;
  options: MorrisOptions;
  dimensions: ExperimentParameter[];
  bounds: typeof morrisRanges;
  points: MorrisPoint[];
  jobs: MorrisJob[];
}
function random(seed: string) {
  let s = hashSeed(seed);
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export async function morrisDesign(
  value: Partial<MorrisOptions> = {},
): Promise<MorrisDesign> {
  const o = {
    seed: "MORRIS-42",
    levels: 4,
    trajectories: 4,
    replicates: 2,
    days: 10,
    ...value,
  };
  if (
    typeof o.seed !== "string" ||
    !o.seed.length ||
    o.seed.length > 128 ||
    /[\u0000-\u001f]/.test(o.seed) ||
    !Number.isInteger(o.levels) ||
    o.levels < 4 ||
    o.levels > 12 ||
    o.levels % 2 ||
    !Number.isInteger(o.trajectories) ||
    o.trajectories < 2 ||
    o.trajectories > 20 ||
    !Number.isInteger(o.replicates) ||
    o.replicates < 1 ||
    o.replicates > 10 ||
    !Number.isInteger(o.days) ||
    o.days < 1 ||
    o.days > 30
  )
    throw Error(
      "Plano Morris inválido (níveis pares 4–12, trajetórias 2–20, réplicas 1–10, dias 1–30).",
    );
  const dimensions = Object.keys(parameterRanges) as ExperimentParameter[];
  if (
    o.trajectories * o.replicates * (dimensions.length + 1) * o.days * 100 >
    500000
  )
    throw Error("Plano Morris excede 500.000 ticks de orçamento.");
  const rng = random(o.seed),
    points: MorrisPoint[] = [],
    jobs: MorrisJob[] = [];
  for (let t = 0; t < o.trajectories; t++) {
    const sign = dimensions.map(() => (rng() < 0.5 ? -1 : 1)),
      grid = dimensions.map(
        (_, j) =>
          Math.floor(rng() * (o.levels / 2)) + (sign[j] < 0 ? o.levels / 2 : 0),
      );
    const order = dimensions.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const seeds = await Promise.all(
      Array.from({ length: o.replicates }, (_, r) =>
        sha256(JSON.stringify(["morris-replica-v1", o.seed, t + 1, r + 1])),
      ),
    );
    for (let p = 0; p <= dimensions.length; p++) {
      const changed = p === 0 ? null : dimensions[order[p - 1]];
      if (p > 0) {
        const j = order[p - 1];
        grid[j] += (sign[j] * o.levels) / 2;
      }
      const normalized = {} as MorrisPoint["normalized"],
        parameters = {} as ExperimentPlan["parameters"];
      dimensions.forEach((key, j) => {
        normalized[key] = grid[j] / (o.levels - 1);
        const [min, max] = morrisRanges[key];
        parameters[key] = min + (max - min) * normalized[key];
      });
      points.push({
        trajectory: t + 1,
        point: p,
        normalized,
        parameters,
        changed,
      });
      for (let r = 0; r < o.replicates; r++)
        jobs.push({
          id: `t${String(t + 1).padStart(3, "0")}-p${String(p).padStart(3, "0")}-r${String(r + 1).padStart(3, "0")}`,
          trajectory: t + 1,
          point: p,
          replicate: r + 1,
          plan: normalizeExperiment({
            schema: "viveiro-experiment-v1",
            seed: "MORRIS-" + seeds[r],
            days: o.days,
            startMode: "established",
            biologicalProfile: { schema: 1, id: "generic-demo", version: 5 },
            parameters,
          }),
        });
    }
  }
  const id = await sha256(
    JSON.stringify([
      "viveiro-morris-v1",
      metadata.version,
      o,
      dimensions,
      points,
      morrisRanges,
    ]),
  );
  return {
    schema: "viveiro-morris-v1",
    modelVersion: metadata.version,
    id,
    options: o,
    dimensions,
    bounds: morrisRanges,
    points,
    jobs,
  };
}
