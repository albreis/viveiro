import type { GranularBody, GranularState } from "./types.ts";
import { grainRadius } from "./types.ts";
/** Dissipative normal spring plus Coulomb-limited tangential impulse; model units. */
export function grainContact(
  a: GranularBody,
  b: GranularBody,
  state: GranularState,
  dt: number,
) {
  const dx = a.x - b.x,
    dy = a.y - b.y,
    dz = a.z - b.z,
    d = Math.hypot(dx, dy, dz),
    overlap = grainRadius(a) + grainRadius(b) - d;
  if (overlap <= 0) return;
  const n =
    d > 0.000001
      ? { x: dx / d, y: dy / d, z: dz / d }
      : { x: a.id < b.id ? 1 : -1, y: 0, z: 0 };
  const av = a.velocity!,
    bv = b.velocity!,
    rv = { x: av.x - bv.x, y: av.y - bv.y, z: av.z - bv.z },
    vn = rv.x * n.x + rv.y * n.y + rv.z * n.z,
    reduced = (a.mass * b.mass) / (a.mass + b.mass);
  const impulse = Math.max(0, 0.08 * overlap - 0.3 * vn) * reduced * dt;
  const tangent = {
      x: rv.x - n.x * vn,
      y: rv.y - n.y * vn,
      z: rv.z - n.z * vn,
    },
    speed = Math.hypot(tangent.x, tangent.y, tangent.z),
    friction = Math.min(speed * reduced, state.friction * impulse);
  for (const axis of ["x", "y", "z"] as const) {
    const j =
      n[axis] * impulse - (speed > 0 ? (tangent[axis] / speed) * friction : 0);
    av[axis] += j / a.mass;
    bv[axis] -= j / b.mass;
  }
  a.quiet = b.quiet = 0;
  state.contacts++;
}
