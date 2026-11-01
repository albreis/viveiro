import type { EntrancePlug } from "./types.ts";
import type { Vec3 } from "../navigation/types.ts";
/** Distance to a finite annular cylinder. Positive outside the added solid. */
export function plugField(plug: EntrancePlug, p: Vec3) {
  const d = { x: p.x - plug.x, y: p.y - plug.y, z: p.z - plug.z };
  const axial = d.x * plug.axis.x + d.y * plug.axis.y + d.z * plug.axis.z;
  const radial = {
    x: d.x - axial * plug.axis.x,
    y: d.y - axial * plug.axis.y,
    z: d.z - axial * plug.axis.z,
  };
  const radius = Math.hypot(radial.x, radial.y, radial.z);
  const r = radius - plug.radius,
    h = Math.abs(axial) - plug.depth / 2;
  const outside = Math.hypot(Math.max(0, r), Math.max(0, h));
  const cylinder = outside + Math.min(Math.max(r, h), 0);
  const rn =
    radius > 1e-10
      ? { x: radial.x / radius, y: radial.y / radius, z: radial.z / radius }
      : { x: 0, y: 0, z: 0 };
  const ax = Math.sign(axial) || 1;
  let normal: Vec3;
  if (outside > 1e-10) {
    const a = Math.max(0, r) / outside,
      b = (Math.max(0, h) * ax) / outside;
    normal = {
      x: rn.x * a + plug.axis.x * b,
      y: rn.y * a + plug.axis.y * b,
      z: rn.z * a + plug.axis.z * b,
    };
  } else
    normal =
      r > h
        ? rn
        : { x: plug.axis.x * ax, y: plug.axis.y * ax, z: plug.axis.z * ax };
  if (plug.innerRadius > 1e-9 && plug.innerRadius - radius > cylinder)
    return {
      distance: plug.innerRadius - radius,
      x: -rn.x,
      y: -rn.y,
      z: -rn.z,
    };
  return { distance: cylinder, ...normal };
}
