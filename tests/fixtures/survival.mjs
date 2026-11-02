import { World } from "../../src/modules/simulation/world.js";
import { profileReference } from "../../src/modules/biology/catalog.ts";
export const survivalWorld = (founding = false) =>
  new World(
    "survival-fixture",
    { humidity: 68, light: 72 },
    {
      founding,
      biologicalProfile: profileReference("generic-survival-demo", 1),
    },
  );
export function worker(w, x = 0, z = 0) {
  const a = w.makeAnt("worker", x, z);
  a.life.ageBudget = 100;
  a.life.diseaseBudget = 100;
  return a;
}
