import { modelMath } from "../../libs/model-math.ts";
import type { NestState, Vec3 } from "../navigation/types.ts";
import type { FieldSample } from "./field-types.ts";
const clamp = (v: number) => Math.max(0, Math.min(1, v));
function union(field: FieldSample, d: number, x: number, y: number, z: number) {
  if (!Number.isFinite(field.distance)) {
    Object.assign(field, { distance: d, x, y, z });
    return;
  }
  const smoothing = 0.08,
    h = clamp(0.5 + (0.5 * (d - field.distance)) / smoothing);
  field.distance = d + (field.distance - d) * h - smoothing * h * (1 - h);
  field.x = x + (field.x - x) * h;
  field.y = y + (field.y - y) * h;
  field.z = z + (field.z - z) * h;
}

export function cavityField(nest: NestState, p: Vec3): FieldSample {
  const field: FieldSample = { distance: Infinity, x: 0, y: 0, z: 0 };
  for (const node of nest.nodes) {
    const x = p.x - node.x,
      y = p.y - node.y,
      z = p.z - node.z;
    const bound = node.r + 0.32;
    if (Math.abs(x) > bound || Math.abs(y) > bound || Math.abs(z) > bound)
      continue;
    const distance = modelMath.hypot(x, y, z),
      inverse = 1 / (distance || 1);
    union(field, distance - node.r, x * inverse, y * inverse, z * inverse);
  }
  for (let i = 0; i < nest.links.length; i++) {
    const [ai, bi] = nest.links[i],
      a = nest.nodes[ai],
      b = nest.nodes[bi];
    const radius = nest.linkWidths?.[i] || 0.38,
      bound = radius + 0.32;
    if (
      p.x < Math.min(a.x, b.x) - bound ||
      p.x > Math.max(a.x, b.x) + bound ||
      p.y < Math.min(a.y, b.y) - bound ||
      p.y > Math.max(a.y, b.y) + bound ||
      p.z < Math.min(a.z, b.z) - bound ||
      p.z > Math.max(a.z, b.z) + bound
    )
      continue;
    const dx = b.x - a.x,
      dy = b.y - a.y,
      dz = b.z - a.z;
    const t = clamp(
      ((p.x - a.x) * dx + (p.y - a.y) * dy + (p.z - a.z) * dz) /
        (dx * dx + dy * dy + dz * dz || 1),
    );
    const x = p.x - a.x - t * dx,
      y = p.y - a.y - t * dy,
      z = p.z - a.z - t * dz;
    const distance = modelMath.hypot(x, y, z),
      inverse = 1 / (distance || 1);
    union(field, distance - radius, x * inverse, y * inverse, z * inverse);
  }
  for (const cut of nest.erosionCuts || []) {
    const x = p.x - cut.x,
      y = p.y - cut.y,
      z = p.z - cut.z,
      d = modelMath.hypot(x, y, z);
    if (d < cut.r + 0.32)
      union(field, d - cut.r, x / (d || 1), y / (d || 1), z / (d || 1));
  }
  if (!Number.isFinite(field.distance)) field.distance = 2;
  return field;
}
