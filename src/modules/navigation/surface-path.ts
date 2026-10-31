import type { NestState, SupportWaypoint, Vec3 } from "./types.ts";
import { tunnelEnvelope } from "../terrain/terrain.js";
import { add, sub, scale, dot, normalize, length } from "./vectors.ts";

const UP: Vec3 = { x: 0, y: 1, z: 0 };
const waypoint = (position: Vec3, normal: Vec3): SupportWaypoint => ({
  position,
  normal,
});

function floorStep(
  nest: NestState,
  start: Vec3,
  end: Vec3,
  referenceY: number,
) {
  const direction = normalize({ x: end.x - start.x, y: 0, z: end.z - start.z });
  if (Math.hypot(direction.x, direction.z) < 0.01) return [waypoint(end, UP)];
  const rising = end.y > start.y;
  let low = 0,
    high = 1;
  for (let i = 0; i < 12; i++) {
    const t = (low + high) / 2;
    const x = start.x + (end.x - start.x) * t,
      z = start.z + (end.z - start.z) * t;
    const floor = tunnelEnvelope(nest, x, z, referenceY).floor + 0.008;
    const changed = rising ? floor > start.y + 0.06 : floor < start.y - 0.06;
    if (changed) high = t;
    else low = t;
  }
  const t = (low + high) / 2;
  const edge = {
    x: start.x + (end.x - start.x) * t,
    y: start.y,
    z: start.z + (end.z - start.z) * t,
  };
  const wallNormal = scale(direction, rising ? -1 : 1);
  const wall = add(edge, scale(wallNormal, 0.012));
  return [
    waypoint({ ...wall, y: start.y }, UP),
    waypoint({ ...wall, y: start.y }, wallNormal),
    waypoint({ ...wall, y: end.y }, wallNormal),
    waypoint(end, UP),
  ];
}

/** Plans contact points around a step/edge instead of interpolating through air. */
export function surfacePath(
  nest: NestState,
  start: Vec3,
  end: Vec3,
  startNormal: Vec3,
  endNormal: Vec3,
  referenceY: number,
): SupportWaypoint[] {
  if (
    startNormal.y > 0.8 &&
    endNormal.y > 0.8 &&
    Math.abs(end.y - start.y) > 0.065
  ) {
    return floorStep(nest, start, end, referenceY);
  }
  const delta = sub(end, start);
  const alongOldPlane = sub(delta, scale(startNormal, dot(delta, startNormal)));
  const denominator = dot(endNormal, alongOldPlane);
  if (Math.abs(denominator) > 0.001) {
    const t = dot(endNormal, delta) / denominator;
    const corner = add(start, scale(alongOldPlane, t));
    if (
      t >= -0.02 &&
      t <= 1.5 &&
      length(sub(corner, start)) < length(delta) + 0.6
    ) {
      return [
        waypoint(corner, startNormal),
        waypoint(corner, endNormal),
        waypoint(end, endNormal),
      ];
    }
  }
  if (dot(startNormal, endNormal) < -0.5) {
    const a = tunnelEnvelope(nest, start.x, start.z, referenceY);
    const b = tunnelEnvelope(nest, end.x, end.z, referenceY);
    const floorA = { ...start, y: a.floor + 0.008 },
      floorB = { ...end, y: b.floor + 0.008 };
    return [
      waypoint(floorA, startNormal),
      waypoint(floorA, UP),
      ...floorStep(nest, floorA, floorB, referenceY),
      waypoint(floorB, endNormal),
      waypoint(end, endNormal),
    ];
  }
  return [waypoint(end, endNormal)];
}
