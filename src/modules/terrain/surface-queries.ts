import type { NestState, Vec3 } from "../navigation/types.ts";
import { sampleSoil, sampleSupport } from "./field.ts";
import {
  add,
  sub,
  scale,
  dot,
  length,
  normalize,
  cross,
} from "../navigation/vectors.ts";

const SKIN = 0.008;

export function projectSupport(nest: NestState, input: Vec3) {
  let point = { ...input },
    field = sampleSupport(nest, point);
  for (let i = 0; i < 4 && Math.abs(field.distance - SKIN) > 0.0003; i++) {
    point = add(point, scale(field, SKIN - field.distance));
    point.x = Math.max(-10 + SKIN, Math.min(10 - SKIN, point.x));
    point.z = Math.max(-6.5 + SKIN, Math.min(6.5 - SKIN, point.z));
    point.y = Math.max(-4.2 + SKIN, Math.min(4.1 - SKIN, point.y));
    field = sampleSupport(nest, point);
  }
  return {
    point,
    normal: { x: field.x, y: field.y, z: field.z },
    gap: field.distance,
  };
}

function trace(nest: NestState, center: Vec3, direction: Vec3, max = 1.6) {
  const ray = normalize(direction);
  let point = { ...center },
    travel = 0;
  for (let i = 0; i < 35 && travel < max; i++) {
    const field = sampleSupport(nest, point);
    if (field.distance <= SKIN + 0.001) {
      const projected = projectSupport(nest, point);
      return {
        ...projected.point,
        normal: projected.normal,
        inside: Math.abs(projected.gap - SKIN) < 0.015,
      };
    }
    const step = Math.min(0.12, Math.max(0.008, field.distance * 0.8));
    point = add(point, scale(ray, step));
    travel += step;
  }
  return {
    x: center.x,
    y: center.y,
    z: center.z,
    normal: { x: 0, y: 1, z: 0 },
    inside: false,
  };
}

export function tunnelEnvelope(
  nest: NestState,
  x: number,
  z: number,
  referenceY: number,
) {
  const center = { x, y: referenceY, z };
  const down = trace(nest, center, { x: 0, y: -1, z: 0 }, 2);
  const up = trace(nest, center, { x: 0, y: 1, z: 0 }, 2);
  return {
    floor: down.y - SKIN,
    ceiling: up.inside ? up.y + SKIN : Infinity,
    inside: down.inside,
  };
}

export function tunnelFooting(
  nest: NestState,
  center: Vec3,
  from: Vec3,
  to: Vec3,
  angle = 0.35,
) {
  const axis = normalize(sub(to, from));
  let outward: Vec3;
  if (Math.abs(axis.y) > 0.8) {
    outward = {
      x: Math.cos(angle),
      y: 0,
      z: Math.sin(angle) * (axis.y > 0 ? -1 : 1),
    };
  } else {
    const side = normalize(cross(axis, { x: 0, y: 1, z: 0 }));
    const up = normalize(sub({ x: 0, y: 1, z: 0 }, scale(axis, axis.y)));
    outward = add(scale(side, Math.sin(angle)), scale(up, -Math.cos(angle)));
  }
  const hit = trace(nest, center, outward);
  const forward = normalize(
    sub(axis, scale(hit.normal, dot(axis, hit.normal))),
  );
  return {
    ...hit,
    heading: Math.atan2(forward.z, forward.x),
    pitch: Math.atan2(forward.y, Math.hypot(forward.x, forward.z)),
  };
}

/** A bounded step tangent to the real support, followed by a short projection. */
export function stepOnSupport(
  nest: NestState,
  start: Vec3,
  target: Vec3,
  speed: number,
  heading: number,
) {
  const field = sampleSupport(nest, start),
    normal = { x: field.x, y: field.y, z: field.z };
  const delta = sub(target, start);
  let tangent = sub(delta, scale(normal, dot(delta, normal)));
  if (length(tangent) < 0.0001) {
    const forward = { x: Math.cos(heading), y: 0, z: Math.sin(heading) };
    tangent = sub(forward, scale(normal, dot(forward, normal)));
    if (length(tangent) < 0.0001) tangent = cross(normal, { x: 0, y: 1, z: 0 });
    if (length(tangent) < 0.0001) tangent = cross(normal, { x: 1, y: 0, z: 0 });
  }
  tangent = normalize(tangent);
  let budget = Math.min(speed, length(delta));
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = projectSupport(nest, add(start, scale(tangent, budget)));
    if (
      length(sub(candidate.point, start)) <= speed + 0.0001 &&
      Math.abs(candidate.gap - SKIN) < 0.015
    ) {
      return {
        position: candidate.point,
        normal: candidate.normal,
        valid: true,
      };
    }
    budget *= 0.5;
  }
  return { position: start, normal, valid: false };
}
