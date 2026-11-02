import { modelMath } from "../../libs/model-math.ts";
import type { FoundingWorld } from "../founding/types.ts";
import type { EntrancePlug } from "./types.ts";
import { SEAL_PARAMETERS } from "./types.ts";
import { sampleSoil } from "../terrain/field.ts";
import { tunnelFooting } from "../terrain/surface-queries.ts";
import { add, scale, sub, normalize, cross } from "../navigation/vectors.ts";
/** Midpoint quadrature of pre-existing air: filling existing compact soil receives no material credit. */
export function planPlug(w: FoundingWorld): EntrancePlug | null {
  const f = w.founding!,
    a = w.nest.nodes[f.entry!],
    b = w.nest.nodes[f.front!];
  const edge = w.nest.links.findIndex(
    ([x, y]) =>
      (x === f.entry && y === f.front) || (y === f.entry && x === f.front),
  );
  if (!a || !b || edge < 0) return null;
  const axis = normalize(sub(b, a)),
    center = add(a, scale(sub(b, a), 0.32));
  const radius = (w.nest.linkWidths?.[edge] || 0.42) + 0.14;
  const u = normalize(
      cross(
        axis,
        Math.abs(axis.y) < 0.9 ? { x: 0, y: 1, z: 0 } : { x: 1, y: 0, z: 0 },
      ),
    ),
    v = cross(axis, u);
  const shells = Array(32).fill(0) as number[],
    depth = SEAL_PARAMETERS.depth;
  for (let r = 0; r < shells.length; r++) {
    const inner = (radius * r) / shells.length,
      outer = (radius * (r + 1)) / shells.length;
    const rho = Math.sqrt((inner * inner + outer * outer) / 2);
    const volume =
      (Math.PI * (outer * outer - inner * inner) * depth) / (24 * 8);
    for (let j = 0; j < 24; j++)
      for (let k = 0; k < 8; k++) {
        const theta = (2 * Math.PI * (j + 0.5)) / 24;
        const p = add(
          add(center, scale(axis, depth * ((k + 0.5) / 8 - 0.5))),
          add(
            scale(u, rho * modelMath.cos(theta)),
            scale(v, rho * modelMath.sin(theta)),
          ),
        );
        if (sampleSoil(w.nest, p).distance > 0) shells[r] += volume;
      }
  }
  const capacity = shells.reduce((n, x) => n + x, 0);
  if (capacity <= 0 || capacity > SEAL_PARAMETERS.maxLoad) return null;
  return {
    ...center,
    version: 1,
    id: w.soil.nextId++,
    owner: w.colonyId || 1,
    edge,
    axis,
    radius,
    depth,
    capacity,
    mass: 0,
    innerRadius: radius,
    shells,
  };
}
export function plugWorkPoint(
  w: FoundingWorld,
  p: EntrancePlug,
  clearance: number,
) {
  const pair = w.nest.links[p.edge],
    a = w.nest.nodes[pair[0]],
    b = w.nest.nodes[pair[1]];
  const center = add(p, scale(p.axis, p.depth / 2 + clearance));
  const footing = tunnelFooting(w.nest, center, a, b, 0.35);
  return footing.inside ? { x: footing.x, y: footing.y, z: footing.z } : null;
}
