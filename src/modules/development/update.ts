import type { Brood, ColonyWorld } from "../colony/types.ts";
import { TICKS_PER_DAY } from "../simulation/constants.js";
import { broodEnvironment } from "./sensing.ts";
import { thermalRate, waterRate, stageSchedule } from "./curves.ts";
import { DEVELOPMENT_PARAMETERS as p } from "./types.ts";
/** Returns survival; only the resource fraction actually paid can support larval growth. */
export function advanceBroodDevelopment(
  w: ColonyWorld,
  b: Brood,
  paidFraction: number,
): boolean {
  const s = b.development!;
  const environment = broodEnvironment(w, b),
    stage = stageSchedule(b.age);
  const t = thermalRate(environment.temperature),
    water = waterRate(environment.water),
    food = stage.name === "larva" ? Math.max(0, Math.min(1, paidFraction)) : 1;
  const stressLoad = Math.max(
    0,
    1 - water,
    stage.name === "larva" ? 1 - food : 0,
    environment.temperature < p.minimum || environment.temperature > p.maximum
      ? 1
      : 0,
  );
  s.stress = Math.max(
    0,
    Math.min(
      1,
      s.stress +
        p.stressPerTick * stressLoad -
        p.recoveryPerTick * (1 - stressLoad),
    ),
  );
  s.lastTemperature = environment.temperature;
  s.lastSoilWater = environment.water;
  s.lastRate = t * water * food * s.growthFactor * (1 - 0.5 * s.stress);
  if (s.stress >= 1) return false;
  b.age = Math.min(
    stage.end,
    b.age + (stage.span / (stage.days * TICKS_PER_DAY)) * s.lastRate,
  );
  return true;
}
