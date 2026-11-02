import type { FamilyWorld } from "../colonies/types.ts";
import type { EcologyPredator } from "./types.ts";
/** Local generalist policy. Species-specific prey preferences remain uncalibrated. */
export function aphidPrey(w: FamilyWorld, p: EcologyPredator) {
  const e = w.ecology;
  if (!e || (p.repelledUntil || 0) > w.tick) return null;
  const candidates = e.aphids
    .map((a) => ({ a, plant: w.plants.find((s) => s.id === a.plant) }))
    .filter(
      (v) =>
        v.plant &&
        !(
          p.predatorMemory?.avoid?.plant === v.a.plant &&
          p.predatorMemory.avoid.until > w.tick
        ) &&
        v.a.count >= 1 &&
        Math.hypot(v.plant.x - p.x, v.plant.z - p.z) < 1.8,
    );
  candidates.sort(
    (a, b) =>
      Math.hypot(a.plant!.x - p.x, a.plant!.z - p.z) -
      Math.hypot(b.plant!.x - p.x, b.plant!.z - p.z),
  );
  const found = candidates[0];
  if (!found) return null;
  if (
    Math.hypot(found.plant!.x - p.x, found.plant!.z - p.z) < 0.4 &&
    p.cooldown <= 0 &&
    w.random() < 0.15
  ) {
    found.a.count -= 1;
    e.aphidsEaten++;
    p.energy = Math.min(100, p.energy + 2);
    p.cooldown = 65;
  }
  return found.plant!;
}
