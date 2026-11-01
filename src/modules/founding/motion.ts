import type { FoundingWorld } from "./types.ts";
import type { ColonyAgent } from "../colony/types.ts";
import type { Vec3 } from "../navigation/types.ts";
import { projectSupport } from "../terrain/surface-queries.ts";
import { sampleSupport } from "../terrain/field.ts";
import {
  advanceSupportedMotion,
  startSupportedMotion,
} from "../navigation/support-motion.ts";
import { distance3 } from "../soil/ledger.ts";
/** Bounded physical walking, including a moving excavation surface at the mouth. */
export function settleFoundress(world: FoundingWorld, queen: ColonyAgent) {
  const current = { x: queen.x, y: queen.y || 0, z: queen.z },
    field = sampleSupport(world.nest, current);
  if (Math.abs(field.distance - 0.008) < 0.006) return false;
  const s = projectSupport(world.nest, current),
    d = distance3(current, s.point);
  if (Math.abs(s.gap - 0.008) > 0.015) return false;
  const k = Math.min(1, (queen.speed * 0.85) / (d || 1));
  queen.x += (s.point.x - queen.x) * k;
  queen.y = (queen.y || 0) + (s.point.y - current.y) * k;
  queen.z += (s.point.z - queen.z) * k;
  queen.normal = s.normal;
  queen.distanceWalked = (queen.distanceWalked || 0) + d * k;
  delete queen.supportMotion;
  return true;
}
export function walkFoundress(
  world: FoundingWorld,
  queen: ColonyAgent,
  target: Vec3,
) {
  if (settleFoundress(world, queen)) return false;
  const s = projectSupport(world.nest, target),
    here = { x: queen.x, y: queen.y || 0, z: queen.z };
  if (distance3(here, s.point) < 0.07) {
    delete queen.supportMotion;
    return true;
  }
  if (
    !queen.supportMotion ||
    distance3(queen.supportMotion.goal!.position, s.point) > 0.08
  )
    startSupportedMotion(world, queen, s.point, s.normal, target);
  advanceSupportedMotion(world, queen, queen.speed * 0.85);
  return false;
}
