import type { SoilWorld } from "../soil/types.ts";
import { createGranularState } from "./types.ts";
import { grainPairs } from "./neighbors.ts";
import { grainContact } from "./contacts.ts";
import { integrateGrain } from "./support.ts";
/** Loose aggregates only. The compact soil still uses the implicit field, not a full DEM discretization. */
export function updateGranular(w: SoilWorld) {
  const s = (w.soil.granular ??= createGranularState()),
    bodies = (w.nest.rubble || []).filter((g) => g.mass > 0.0000001);
  s.friction = Math.tan(
    (Math.max(15, Math.min(55, w.params.reposeAngle ?? 36)) * Math.PI) / 180,
  );
  s.steps++;
  s.moving = 0;
  s.kinetic = 0;
  if (!bodies.length) {
    s.terrainRevision = w.nest.revision;
    return;
  }
  const base = { ...w.nest, rubble: [] };
  for (const g of bodies) {
    if (!g.mobile) {
      g.mobile = true;
      w.nest.revision++;
    }
    g.velocity ??= { x: 0, y: 0, z: 0 };
    g.quiet ??= 0;
  }
  for (let sub = 0; sub < 4; sub++) {
    for (const [a, b] of grainPairs(bodies)) grainContact(a, b, s, 0.25);
    for (const g of bodies) integrateGrain(base, g, s, 0.25);
  }
  for (const g of bodies) {
    const v = g.velocity!,
      speed = Math.hypot(v.x, v.y, v.z);
    s.kinetic += 0.5 * g.mass * speed * speed;
    if (speed > 0.00005) s.moving++;
    else g.quiet = (g.quiet || 0) + 1;
  }
  s.terrainRevision = w.nest.revision;
}
