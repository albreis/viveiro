import { plugField } from "../sealing/field.ts";
import {
  surfaceHeight,
  surfaceNormal,
  surfaceDistanceUpperBound,
} from "../landscape/queries.ts";
import type { NestState, Vec3 } from "../navigation/types.ts";

export interface FieldSample {
  distance: number;
  x: number;
  y: number;
  z: number;
}
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

function cavity(nest: NestState, p: Vec3): FieldSample {
  const field: FieldSample = { distance: Infinity, x: 0, y: 0, z: 0 };
  for (const node of nest.nodes) {
    const x = p.x - node.x,
      y = p.y - node.y,
      z = p.z - node.z;
    const bound = node.r + 0.32;
    if (Math.abs(x) > bound || Math.abs(y) > bound || Math.abs(z) > bound)
      continue;
    const distance = Math.hypot(x, y, z),
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
    const distance = Math.hypot(x, y, z),
      inverse = 1 / (distance || 1);
    union(field, distance - radius, x * inverse, y * inverse, z * inverse);
  }
  for (const cut of nest.erosionCuts || []) {
    const x = p.x - cut.x,
      y = p.y - cut.y,
      z = p.z - cut.z,
      d = Math.hypot(x, y, z);
    if (d < cut.r + 0.32)
      union(field, d - cut.r, x / (d || 1), y / (d || 1), z / (d || 1));
  }
  if (!Number.isFinite(field.distance)) field.distance = 2;
  return field;
}

/** Positive in air, negative in soil; its gradient points out of the solid. */
export function sampleSoil(nest: NestState, p: Vec3): FieldSample {
  const voidField = cavity(nest, p);
  const qx = Math.abs(p.x) - 10,
    qy = Math.abs(p.y + 2.1) - 2.1,
    qz = Math.abs(p.z) - 6.5;
  const ox = Math.max(qx, 0),
    oy = Math.max(qy, 0),
    oz = Math.max(qz, 0);
  const outside = Math.hypot(ox, oy, oz);
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
  // Smooth intersection rounds the lips where cavities meet the glass/ground.
  const cut = -voidField.distance,
    k = 0.045,
    h = clamp(0.5 + (0.5 * (base - cut)) / k);
  const x = bx * h - voidField.x * (1 - h);
  const y = by * h - voidField.y * (1 - h);
  const z = bz * h - voidField.z * (1 - h);
  const size = Math.hypot(x, y, z) || 1;
  const result = {
    distance: cut + (base - cut) * h + k * h * (1 - h),
    x: x / size,
    y: y / size,
    z: z / size,
  };
  for (const pile of nest.rubble || []) {
    if (pile.mass <= 0) continue;
    const r = Math.cbrt((pile.mass * 3) / (4 * Math.PI));
    const dx = p.x - pile.x,
      dy = p.y - pile.y,
      dz = p.z - pile.z,
      d = Math.hypot(dx, dy, dz);
    if (d - r < result.distance)
      Object.assign(result, {
        distance: d - r,
        x: dx / (d || 1),
        y: dy / (d || 1),
        z: dz / (d || 1),
      });
  }
  for (const plug of nest.plugs || []) {
    if (
      plug.mass <= 1e-10 ||
      Math.abs(p.x - plug.x) > plug.radius + plug.depth ||
      Math.abs(p.y - plug.y) > plug.radius + plug.depth ||
      Math.abs(p.z - plug.z) > plug.radius + plug.depth
    )
      continue;
    const material = plugField(plug, p);
    if (material.distance < result.distance) Object.assign(result, material);
  }
  return result;
}

/** Glass is also a valid support, including where a cavity reaches a wall. */
export function sampleSupport(nest: NestState, p: Vec3): FieldSample {
  const field = sampleSoil(nest, p);
  if (p.y > 4.1) return field;
  const walls = [
    { distance: 10 - p.x, x: -1, y: 0, z: 0 },
    { distance: 10 + p.x, x: 1, y: 0, z: 0 },
    { distance: 6.5 - p.z, x: 0, y: 0, z: -1 },
    { distance: 6.5 + p.z, x: 0, y: 0, z: 1 },
  ];
  for (const wall of walls)
    if (wall.distance < field.distance) Object.assign(field, wall);
  return field;
}

export function projectSoilVertex(nest: NestState, input: Vec3) {
  let point = { ...input },
    field = sampleSoil(nest, point);
  for (let i = 0; i < 5 && Math.abs(field.distance) > 0.00015; i++) {
    point = {
      x: point.x - field.x * field.distance,
      y: point.y - field.y * field.distance,
      z: point.z - field.z * field.distance,
    };
    field = sampleSoil(nest, point);
  }
  return { ...point, nx: field.x, ny: field.y, nz: field.z };
}
