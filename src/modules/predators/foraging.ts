import { modelMath } from "../../libs/model-math.ts";
import type { MovingPredator } from "./types.ts";
import type { Plant } from "../landscape/types.ts";
import { plantClearance } from "./vegetation.ts";
function memory(p: MovingPredator, tick: number) {
  return (p.predatorMemory ??= {
    version: 1,
    anchor: { x: p.x, z: p.z, tick },
  });
}
function escape(p: MovingPredator, tick: number, angle: number) {
  const m = memory(p, tick);
  if (m.visit) m.avoid = { plant: m.visit.plant, until: tick + 200 };
  delete m.visit;
  m.escape = { angle, until: tick + 35 };
  m.anchor = { x: p.x, z: p.z, tick };
  p.avoidTicks = 0;
  p.state = "Contornando obstáculo";
  return angle;
}
/** Net progress, rather than moving legs or total path length, detects a stuck hunter. */
export function predatorEscape(
  p: MovingPredator,
  tick: number,
): number | undefined {
  const m = memory(p, tick);
  if (modelMath.hypot(p.x - m.anchor.x, p.z - m.anchor.z) > 0.18)
    m.anchor = { x: p.x, z: p.z, tick };
  if (m.escape && m.escape.until > tick) return m.escape.angle;
  delete m.escape;
  if (tick - m.anchor.tick >= 50)
    return escape(p, tick, p.angle + (p.id % 2 ? 1 : -1) * Math.PI * 0.65);
  return undefined;
}
export function approachPlant(p: MovingPredator, plant: Plant, tick: number) {
  const m = memory(p, tick);
  if (m.visit?.plant !== plant.id) m.visit = { plant: plant.id, since: tick };
  const distance = modelMath.hypot(p.x - plant.x, p.z - plant.z),
    elapsed = tick - m.visit.since;
  if (
    distance <= Math.max(0.3, plantClearance(plant) + 0.035) ||
    elapsed >= 100
  ) {
    if (p.cooldown > 0 || elapsed >= 40)
      return {
        waiting: false,
        heading: escape(
          p,
          tick,
          modelMath.atan2(p.z - plant.z, p.x - plant.x) +
            (p.id % 2 ? 1 : -1) * 0.3,
        ),
      };
    p.state = "Procurando presas na planta";
    return { waiting: true, heading: p.angle };
  }
  p.state = "Aproximando da planta";
  return {
    waiting: false,
    heading: modelMath.atan2(plant.z - p.z, plant.x - p.x),
  };
}
