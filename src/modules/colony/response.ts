import { weightedSample } from "../../libs/probability.ts";
import { hashSeed } from "../simulation/seed.ts";
import type { ColonyAgent, ColonyWorld, Role } from "./types.ts";
import { senseTaskStimuli } from "./stimuli.ts";

export const TASKS: readonly Role[] = [
  "forager",
  "nurse",
  "cleaner",
  "excavator",
  "defender",
];
export function responseProbability(stimulus: number, threshold: number) {
  const s = Math.max(0, stimulus),
    t = Math.max(1e-8, threshold);
  return s === 0 ? 0 : 1 / (1 + (t / s) ** 2);
}
export function taskThresholds(seed: string, id: number): Record<Role, number> {
  return Object.fromEntries(
    TASKS.map((task) => [
      task,
      0.15 +
        (hashSeed(seed + ":" + id + ":threshold:" + task) / 4294967296) * 0.75,
    ]),
  ) as Record<Role, number>;
}
export function allocateTask(world: ColonyWorld, ant: ColonyAgent): Role {
  if (world.tick < (ant.nextTaskChoice || 0)) return ant.role;
  ant.thresholds ??= taskThresholds(world.seed, ant.id);
  const stimuli = senseTaskStimuli(world, ant);
  const weights = TASKS.map((task) => {
    let threshold = ant.thresholds![task];
    if (task === "nurse") threshold *= ant.age < 1.5 ? 0.55 : 1.8;
    if (task === "forager") threshold *= ant.age > 4 ? 0.55 : 1.1;
    if (task === "cleaner") threshold *= 1.3 - ant.traits.activity * 0.7;
    if (task === "defender") threshold *= ant.caste === "major" ? 0.4 : 2;
    return responseProbability(stimuli[task], threshold);
  });
  ant.nextTaskChoice = world.tick + 20 + (ant.id % 15);
  return TASKS[weightedSample(weights, () => world.random())];
}
