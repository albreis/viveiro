import { modelMath } from "../../libs/model-math.ts";
import type { Vec3 } from "../navigation/types.ts";
import type { FieldSample } from "./field-types.ts";
import type { LaboratoryGeometry } from "./laboratory.ts";

/** Exact capped cylinder: positive outside sand, negative inside. */
export function laboratorySand(g: LaboratoryGeometry, p: Vec3): FieldSample {
  const radial = modelMath.hypot(p.x, p.z),
    qx = radial - g.sandRadius,
    qy = Math.abs(p.y + g.sandDepth / 2) - g.sandDepth / 2,
    ox = Math.max(0, qx),
    oy = Math.max(0, qy),
    outside = modelMath.hypot(ox, oy);
  let horizontal = 0,
    vertical = 0;
  if (outside > 1e-12) {
    horizontal = ox / outside;
    vertical = oy / outside;
  } else if (qx > qy) horizontal = 1;
  else vertical = 1;
  return {
    distance: outside + Math.min(Math.max(qx, qy), 0),
    x: (horizontal * p.x) / (radial || 1),
    y: vertical * Math.sign(p.y + g.sandDepth / 2),
    z: (horizontal * p.z) / (radial || 1),
  };
}
function cover(g: LaboratoryGeometry, p: Vec3): FieldSample {
  const q = [
    Math.abs(p.x) - g.coverHalfWidth,
    Math.abs(p.y - g.coverThickness / 2) - g.coverThickness / 2,
    Math.abs(p.z) - g.coverHalfWidth,
  ];
  const o = q.map((v) => Math.max(v, 0)),
    length = modelMath.hypot(...o);
  const n =
    length > 1e-12
      ? o.map((v) => v / length)
      : q.map((v, i) => Number(i === q.indexOf(Math.max(...q))));
  return {
    distance: length + Math.min(Math.max(...q), 0),
    x: n[0] * Math.sign(p.x),
    y: n[1] * Math.sign(p.y - g.coverThickness / 2),
    z: n[2] * Math.sign(p.z),
  };
}
/** Floor, finite cover and radial containment; wall climb rules remain K1. */
export function laboratorySupport(
  g: LaboratoryGeometry,
  p: Vec3,
  soil: FieldSample,
): FieldSample {
  const radial = modelMath.hypot(p.x, p.z),
    candidates: FieldSample[] = [
      soil,
      { distance: p.y + g.sandDepth, x: 0, y: 1, z: 0 },
      cover(g, p),
      {
        distance: g.arenaRadius - radial,
        x: -p.x / (radial || 1),
        y: 0,
        z: -p.z / (radial || 1),
      },
    ];
  return { ...candidates.reduce((a, b) => (a.distance <= b.distance ? a : b)) };
}
