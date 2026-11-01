import type { ColonyWorld, ColonyAgent } from "../colony/types.ts";
import { chooseSupportedStep } from "../navigation/support-step.ts";
export function updateEncounterMotion(w: ColonyWorld, a: ColonyAgent) {
  const e = a.encounter;
  if (!e) return false;
  if (w.tick > e.until) {
    delete a.encounter;
    return false;
  }
  const p = { x: a.x, y: a.y || 0, z: a.z },
    speed = a.speed * 0.7,
    target = {
      x: p.x + e.direction.x * 0.25,
      y: p.y + e.direction.y * 0.25,
      z: p.z + e.direction.z * 0.25,
    };
  const step = chooseSupportedStep(w, a, target, speed);
  if (step) {
    const d = {
      x: step.position.x - p.x,
      y: step.position.y - p.y,
      z: step.position.z - p.z,
    };
    Object.assign(a, step.position, {
      normal: step.normal,
      angle: Math.atan2(d.z, d.x),
      pitch: Math.atan2(d.y, Math.hypot(d.x, d.z)),
    });
    a.distanceWalked = (a.distanceWalked || 0) + Math.hypot(d.x, d.y, d.z);
  }
  a.state = e.state;
  return true;
}
