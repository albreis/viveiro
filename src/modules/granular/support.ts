import { modelMath } from "../../libs/model-math.ts";
import type { NestState, Vec3 } from "../navigation/types.ts";
import type { GranularBody, GranularState } from "./types.ts";
import { grainRadius } from "./types.ts";
import { sampleSupport, type FieldSample } from "../terrain/field.ts";
function friction(v: Vec3, f: FieldSample, s: GranularState) {
  const vn = v.x * f.x + v.y * f.y + v.z * f.z;
  if (vn >= 0) return;
  const impulse = -vn,
    restitution = vn < -0.001 ? 0.04 : 0;
  v.x -= f.x * vn * (1 + restitution);
  v.y -= f.y * vn * (1 + restitution);
  v.z -= f.z * vn * (1 + restitution);
  const normal = v.x * f.x + v.y * f.y + v.z * f.z,
    t = { x: v.x - normal * f.x, y: v.y - normal * f.y, z: v.z - normal * f.z },
    speed = modelMath.hypot(t.x, t.y, t.z),
    loss = Math.min(speed, s.friction * impulse);
  if (speed > 0) {
    v.x -= (t.x / speed) * loss;
    v.y -= (t.y / speed) * loss;
    v.z -= (t.z / speed) * loss;
  }
}
export function integrateGrain(
  nest: NestState,
  g: GranularBody,
  s: GranularState,
  dt: number,
  query: (nest: NestState, p: Vec3) => FieldSample = sampleSupport,
) {
  const v = g.velocity!,
    r = grainRadius(g);
  v.y -= s.gravity * dt;
  const before = query(nest, g);
  if (before.distance <= r + 0.00003) friction(v, before, s);
  const speed = modelMath.hypot(v.x, v.y, v.z),
    scale = speed > 0.008 ? 0.008 / speed : 1;
  v.x *= scale;
  v.y *= scale;
  v.z *= scale;
  const old = { x: g.x, y: g.y, z: g.z };
  g.x += v.x * dt;
  g.y += v.y * dt;
  g.z += v.z * dt;
  const f = query(nest, g);
  if (f.distance < r) {
    const correction = Math.min(0.008 * dt, r - f.distance);
    g.x += f.x * correction;
    g.y += f.y * correction;
    g.z += f.z * correction;
    friction(v, f, s);
  }
  return modelMath.hypot(g.x - old.x, g.y - old.y, g.z - old.z);
}
