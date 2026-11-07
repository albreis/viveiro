import { WALK_WORK_PER_REFERENCE_SECOND } from "../../fatigue/motion-work.ts";
import { BUHL_CLIMATE_ASSUMPTIONS } from "./microclimate.ts";
import { BUHL_ACTIVITY_IDLE_SECONDS } from "./activity.ts";
import { BUHL_DIG_FATIGUE } from "./dig-fatigue.ts";
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
    ...workers.sample(tick),
  });
  const samples = [sample(0)];
  for (let tick = 1; tick <= total; tick++) {
    workers.step(tick);
    if (tick % every === 0 || tick === total) samples.push(sample(tick));
    if (progress && (tick % progressEvery === 0 || tick === total))
      progress(tick, total);
  }
  const activityByWorker = workers.individualActivity();
  return {
    seed: plan.seed,
    workers: plan.workers,
    samples,
    ...(activityByWorker ? { activityByWorker } : {}),
  };
}

export function describeBuhlLab(plan: ReturnType<typeof normalizeBuhlLabPlan>) {
  return {
    protocol: "disco-fixo-2005",
    model:
      plan.mechanism === "local"
        ? "viveiro-disco-local-v1"
        : "viveiro-disco-contato-v2",
    mechanism: plan.mechanism,
    contactAccess: plan.contactAccess,
    ...(plan.digFatigue
      ? {
          digFatigue: {
            rule: plan.digFatigue,
            ...BUHL_DIG_FATIGUE,
            ...(plan.digFatigue === "action-recovery"
              ? { walkWorkPerReferenceSecond: WALK_WORK_PER_REFERENCE_SECOND }
              : {}),
          },
        }
      : {}),
    ...(plan.observeActivity
      ? {
          activity: {
            schema: "viveiro-buhl-atividade-v1",
            idleSeconds: BUHL_ACTIVITY_IDLE_SECONDS,
          },
        }
      : {}),
    ...(plan.microclimate
      ? { microclimate: { ...plan.microclimate, ...BUHL_CLIMATE_ASSUMPTIONS } }
      : {}),
    calibrated: false,
    geometryMm: BUHL_DISK_MM,
    timeUnit: "s",
    volumeUnit: "cm3",
    secondsPerTick: plan.tickMilliseconds / 1000,
    anchors: BUHL_INDIVIDUAL,
  };
}

export type BuhlLabRun = ReturnType<typeof runBuhlLab>;
