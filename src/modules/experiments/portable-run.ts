import { installPortableMath } from "../../libs/portable-math.ts";
import { runExperiment, type ExperimentHooks } from "./run.ts";
/** Only imported by dedicated experiment workers. Never bootstrap in the live terrarium. */
export function runPortableExperiment(
  value: unknown,
  hooks: ExperimentHooks = {},
) {
  installPortableMath();
  return runExperiment(value, hooks);
}
