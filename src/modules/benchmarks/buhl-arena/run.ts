import { BuhlArena, BUHL_DISK_MM } from "./geometry.ts";
import { BUHL_INDIVIDUAL, normalizeBuhlLabPlan } from "./settings.ts";
import { BuhlSoilLedger } from "./soil.ts";
import { BuhlLabWorkers } from "./workers.ts";

export function runBuhlLab(
  input: unknown,
  progress?: (tick: number, total: number) => void,
) {
  const plan = normalizeBuhlLabPlan(input);
  const arena = new BuhlArena(plan.pitchMm);
  const soil = new BuhlSoilLedger(arena, plan.dryDensityMgPerMm3);
  const workers = new BuhlLabWorkers(arena, soil, plan);
  const ticksPerSecond = 1000 / plan.tickMilliseconds;
  const total = plan.durationSeconds * ticksPerSecond;
  const every = plan.sampleEverySeconds * ticksPerSecond;
  const progressEvery = Math.max(1, Math.floor(total / 20));
  const sample = (tick: number) => ({
    timeSeconds: tick / ticksPerSecond,
    ...soil.sample(),
    ...workers.sample(),
  });
  const samples = [sample(0)];
  for (let tick = 1; tick <= total; tick++) {
    workers.step(tick);
    if (tick % every === 0 || tick === total) samples.push(sample(tick));
    if (progress && (tick % progressEvery === 0 || tick === total))
      progress(tick, total);
  }
  return { seed: plan.seed, workers: plan.workers, samples };
}

export function describeBuhlLab(plan: ReturnType<typeof normalizeBuhlLabPlan>) {
  return {
    protocol: "disco-fixo-2005",
    model: "viveiro-disco-local-v1",
    calibrated: false,
    geometryMm: BUHL_DISK_MM,
    timeUnit: "s",
    volumeUnit: "cm3",
    secondsPerTick: plan.tickMilliseconds / 1000,
    anchors: BUHL_INDIVIDUAL,
  };
}

export type BuhlLabRun = ReturnType<typeof runBuhlLab>;
