import { modelMath } from "../../libs/model-math.ts";
import {
  surfaceHeight,
  surfaceNormal,
  surfaceDistanceUpperBound,
} from "../landscape/queries.ts";
import type { NestState, Vec3 } from "../navigation/types.ts";
import type { FieldSample } from "./field-types.ts";
export function terrariumBase(
  nest: NestState,
  p: Vec3,
  voidField: FieldSample,
): FieldSample {
  const qx = Math.abs(p.x) - 10,
    qy = Math.abs(p.y + 2.1) - 2.1,
    qz = Math.abs(p.z) - 6.5;
  const ox = Math.max(qx, 0),
    oy = Math.max(qy, 0),
    oz = Math.max(qz, 0);
  const outside = modelMath.hypot(ox, oy, oz);
  const box = outside + Math.min(Math.max(qx, qy, qz), 0);
  let bx = 0,
    by = 0,
    bz = 0;
  if (outside > 0.00001) {
    bx = (Math.sign(p.x) * ox) / outside;
    by = (Math.sign(p.y + 2.1) * oy) / outside;
    bz = (Math.sign(p.z) * oz) / outside;
  } else if (qx > qy && qx > qz) bx = Math.sign(p.x);
  else if (qy > qz) by = Math.sign(p.y + 2.1);
  else bz = Math.sign(p.z);
  // Skip relief only where a conservative bound proves the cavity masks it entirely.
  const needsTop =
    p.y > -0.3 ||
    -voidField.distance < surfaceDistanceUpperBound(nest.relief, p.y) + 0.05;
  const height = needsTop ? surfaceHeight(nest.relief, p.x, p.z) : 0;
  const topNormal = needsTop
    ? surfaceNormal(nest.relief, p.x, p.z)
    : { x: 0, y: 1, z: 0 };
  const surface = (p.y - height) * topNormal.y;
  const base = p.y > -2 ? Math.max(qx, qz, surface) : box;
  if (p.y > -2 && surface >= Math.max(qx, qz)) {
    bx = topNormal.x;
    by = topNormal.y;
    bz = topNormal.z;
  }
  return { distance: base, x: bx, y: by, z: bz };
}
