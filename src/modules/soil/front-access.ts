import { modelMath } from "../../libs/model-math.ts";
import { MESH_BODY_UNITS } from "../biology/worker-reference.ts";
import { positionClear } from "../navigation/collision.ts";
import type { SupportWaypoint, Vec3 } from "../navigation/types.ts";
import {
  add,
  cross,
  dot,
  length,
  normalize,
  position,
  scale,
  sub,
} from "../navigation/vectors.ts";
import { sampleSoil } from "../terrain/field.ts";
import { projectSupport } from "../terrain/surface-queries.ts";
import type { DigProject, SoilAgent, SoilWorld } from "./types.ts";

const SKIN = 0.008;
interface Face {
  revision: number;
  sites: SupportWaypoint[];
}
const faces = new WeakMap<SoilWorld, Map<number, Face>>();

/** Find actual soil ahead, including the wall of a chamber hosting a new front. */
function traceFace(world: SoilWorld, start: Vec3, axis: Vec3, limit: number) {
  let travel = 0,
    point = start;
  for (let i = 0; i < 160 && travel <= limit; i++) {
    const field = sampleSoil(world.nest, point);
    if (field.distance <= SKIN + 0.001) {
      const support = projectSupport(world.nest, point);
      const soil = sampleSoil(world.nest, support.point);
      if (
        Math.abs(support.gap - SKIN) > 0.015 ||
        Math.abs(soil.distance - SKIN) > 0.02 ||
        dot(soil, axis) > -0.15
      )
        return null; // A glass wall, side wall or unsupported point is not a digging face.
      return { position: support.point, normal: support.normal };
    }
    const step = Math.min(0.12, Math.max(0.008, field.distance * 0.8));
    travel += step;
    point = add(start, scale(axis, travel));
  }
  return null;
}

/** Deterministic samples of the cap, not crew slots or a production multiplier. */
export function diggingSites(
  world: SoilWorld,
  project: DigProject,
): SupportWaypoint[] {
  let cache = faces.get(world);
  if (!cache) faces.set(world, (cache = new Map()));
  const cached = cache.get(project.id);
  if (cached?.revision === world.nest.revision) return cached.sites;
  const front = world.nest.nodes[project.front],
    delta = sub(project.goal, front);
  const axis = normalize(delta);
  let side = normalize(cross(axis, { x: 0, y: 1, z: 0 }));
  if (length(side) < 0.001) side = { x: 1, y: 0, z: 0 };
  const up = normalize(cross(side, axis));
  const starts = [position(front)];
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    starts.push(
      add(
        front,
        add(
          scale(side, front.r * 0.8 * modelMath.cos(angle)),
          scale(up, front.r * 0.8 * modelMath.sin(angle)),
        ),
      ),
    );
  }
  const sites: SupportWaypoint[] = [];
  for (const start of starts) {
    const site = traceFace(world, start, axis, length(delta) + front.r);
    if (
      site &&
      !sites.some((s) => length(sub(s.position, site.position)) < 0.02)
    )
      sites.push(site);
  }
  cache.set(project.id, { revision: world.nest.revision, sites });
  return sites;
}

function clearSite(
  world: SoilWorld,
  ant: SoilAgent,
  point: Vec3,
  normal: Vec3,
) {
  return positionClear(
    world,
    ant,
    point,
    ant.angle,
    ant.pitch ?? 0,
    normal,
    false,
  );
}

export function availableDigSite(
  world: SoilWorld,
  ant: SoilAgent,
  project: DigProject,
) {
  let best: SupportWaypoint | null = null,
    distance = Infinity;
  for (const site of diggingSites(world, project)) {
    const d = length(sub(site.position, position(ant)));
    if (d < distance && clearSite(world, ant, site.position, site.normal)) {
      distance = d;
      best = site;
    }
  }
  return best;
}

/** A logical node alone cannot bite: the body must be supported at real soil. */
export function touchingDigFace(
  world: SoilWorld,
  ant: SoilAgent,
  project: DigProject,
) {
  const point = position(ant),
    support = projectSupport(world.nest, point);
  if (
    length(sub(support.point, point)) > 0.02 ||
    Math.abs(support.gap - SKIN) > 0.015 ||
    !clearSite(world, ant, point, support.normal)
  )
    return false;
  const reach = MESH_BODY_UNITS * (ant.bodyScale ?? 1) * 0.5;
  return diggingSites(world, project).some(
    (site) =>
      length(sub(site.position, point)) <= reach &&
      dot(site.normal, support.normal) > 0.5,
  );
}
