import { modelMath } from "../../libs/model-math.ts";
import { plugField } from "../sealing/field.ts";
import type { NestState, Vec3 } from "../navigation/types.ts";
import type { FieldSample } from "./field-types.ts";
import { cavityField } from "./cavity-field.ts";
import { terrariumBase } from "./base-field.ts";
import { laboratorySand, laboratorySupport } from "./laboratory-field.ts";
export type { FieldSample } from "./field-types.ts";
const clamp = (v: number) => Math.max(0, Math.min(1, v));

/** Positive in air, negative in soil; its gradient points out of the solid. */
export function sampleSoil(nest: NestState, p: Vec3): FieldSample {
  const voidField = cavityField(nest, p);
  const baseField = nest.laboratory
    ? laboratorySand(nest.laboratory, p)
    : terrariumBase(nest, p, voidField);
  const { distance: base, x: bx, y: by, z: bz } = baseField;
  // Smooth intersection rounds the lips where cavities meet the glass/ground.
  const cut = -voidField.distance,
    k = 0.045,
    h = clamp(0.5 + (0.5 * (base - cut)) / k);
  const x = bx * h - voidField.x * (1 - h);
  const y = by * h - voidField.y * (1 - h);
  const z = bz * h - voidField.z * (1 - h);
  const size = modelMath.hypot(x, y, z) || 1;
  let result: FieldSample = {
    distance: cut + (base - cut) * h + k * h * (1 - h),
    x: x / size,
    y: y / size,
    z: z / size,
  };
  // The laboratory disk is clipped exactly at its floor/ceiling/periphery.
  if (nest.laboratory)
    result =
      base >= cut
        ? baseField
        : {
            distance: cut,
            x: -voidField.x,
            y: -voidField.y,
            z: -voidField.z,
          };
  for (const pile of nest.rubble || []) {
    if (pile.mass <= 0) continue;
    const r = modelMath.cbrt((pile.mass * 3) / (4 * Math.PI));
    const dx = p.x - pile.x,
      dy = p.y - pile.y,
      dz = p.z - pile.z,
      d = modelMath.hypot(dx, dy, dz);
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
  if (nest.laboratory) return laboratorySupport(nest.laboratory, p, field);
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
