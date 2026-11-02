import { modelMath } from "../../libs/model-math.ts";
import type { NestState, SupportWaypoint, Vec3 } from "./types.ts";
import { projectSupport, stepOnSupport } from "../terrain/surface-queries.ts";
import { sampleSupport } from "../terrain/field.ts";
import { add, cross, dot, length, normalize, scale, sub } from "./vectors.ts";

interface SearchPoint extends SupportWaypoint {
  cost: number;
  estimate: number;
  parent: SearchPoint | null;
}
const key = (p: Vec3) =>
  [p.x, p.y, p.z].map((v) => Math.round(v / 0.075)).join(":");

/** A short geodesic search on the actual implicit support, never through soil. */
export function findSupportPath(
  nest: NestState,
  start: Vec3,
  goal: Vec3,
): SupportWaypoint[] {
  const initial = projectSupport(nest, start);
  const first: SearchPoint = {
    position: start,
    normal: initial.normal,
    cost: 0,
    estimate: length(sub(goal, start)),
    parent: null,
  };
  const open = [first],
    costs = new Map([[key(start), 0]]);
  let best = first;
  for (let visited = 0; open.length && visited < 500; visited++) {
    let index = 0;
    for (let i = 1; i < open.length; i++)
      if (open[i].estimate < open[index].estimate) index = i;
    const current = open.splice(index, 1)[0];
    const remaining = length(sub(goal, current.position));
    if (remaining < length(sub(goal, best.position))) best = current;
    if (remaining < 0.07) break;
    const normal = current.normal;
    let tangent = sub(
      sub(goal, current.position),
      scale(normal, dot(sub(goal, current.position), normal)),
    );
    if (length(tangent) < 0.001) tangent = cross(normal, { x: 0, y: 1, z: 0 });
    if (length(tangent) < 0.001) tangent = cross(normal, { x: 1, y: 0, z: 0 });
    const forward = normalize(tangent),
      side = normalize(cross(normal, forward));
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const direction = add(
        scale(forward, modelMath.cos(angle)),
        scale(side, modelMath.sin(angle)),
      );
      const target = add(current.position, scale(direction, 0.14));
      const next = stepOnSupport(
        nest,
        current.position,
        target,
        0.145,
        modelMath.atan2(direction.z, direction.x),
      );
      const travel = length(sub(next.position, current.position));
      if (
        !next.valid ||
        travel < 0.045 ||
        !supportedSegment(nest, current.position, next.position)
      )
        continue;
      const cost = current.cost + travel,
        cell = key(next.position);
      if (cost >= (costs.get(cell) ?? Infinity) - 0.001) continue;
      costs.set(cell, cost);
      open.push({
        ...next,
        cost,
        position: next.position,
        parent: current,
        estimate: cost + length(sub(goal, next.position)) * 1.1,
      });
    }
  }
  if (!best.parent || length(sub(goal, best.position)) > first.estimate - 0.02)
    return [];
  const path: SupportWaypoint[] = [];
  for (let node: SearchPoint | null = best; node?.parent; node = node.parent)
    path.unshift({ position: node.position, normal: node.normal });
  if (length(sub(best.position, goal)) < 0.08) {
    const support = projectSupport(nest, goal);
    path.push({ position: support.point, normal: support.normal });
  }
  return path;
}

export function supportedSegment(nest: NestState, a: Vec3, b: Vec3): boolean {
  const delta = sub(b, a),
    samples = Math.max(2, Math.ceil(length(delta) / 0.025));
  for (let i = 1; i <= samples; i++) {
    const d = sampleSupport(nest, add(a, scale(delta, i / samples))).distance;
    if (d < -0.003 || d > 0.035) return false;
  }
  return true;
}
