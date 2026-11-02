import { World } from "../simulation/world.js";
import type { FamilyWorld } from "../colonies/types.ts";
import type { ObservationWorld } from "../observations/types.ts";
import { dailyCsv } from "../observations/csv.ts";
import { normalizeExperiment } from "./plan.ts";
import { experimentResult } from "./result.ts";
export interface ExperimentHooks {
  cancelled?(): boolean;
  progress?(tick: number, totalTicks: number): void;
  pause?(): Promise<void>;
}
/** Runs the production model, in isolation. Hooks only schedule work; they never choose model steps. */
export async function runExperiment(
  value: unknown,
  hooks: ExperimentHooks = {},
) {
  const plan = normalizeExperiment(value),
    total = plan.days * 100;
  const w = new World(
    plan.seed,
    { ...plan.parameters },
    {
      founding: plan.startMode === "founding",
      biologicalProfile: { ...plan.biologicalProfile },
    },
  ) as unknown as FamilyWorld & ObservationWorld & { step(): void };
  const check = () => {
    if (hooks.cancelled?.()) throw Error("Experimento cancelado.");
  };
  check();
  while (w.tick < total) {
    check();
    w.step();
    if (w.tick % 25 === 0) {
      hooks.progress?.(w.tick, total);
      await hooks.pause?.();
    }
  }
  check();
  return experimentResult(plan, dailyCsv([{ id: "a", world: w }]), w.rng);
}
