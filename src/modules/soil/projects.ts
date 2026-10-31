import type { DigProject, SoilWorld, SoilAgent } from "./types.ts";
import { distance3, removedSoil } from "./ledger.ts";
import { normalize, sub } from "../navigation/vectors.ts";

export function proposeDig(world: SoilWorld, from: number): DigProject | null {
  const node = world.nest.nodes[from];
  if (
    !node ||
    world.soil.projects.some((p) => !p.completed) ||
    world.nest.nodes.length >= 24
  )
    return null;
  const direction = world.random() < 0.5 ? -1 : 1;
  const goal = {
    x: Math.max(
      -8.8,
      Math.min(8.8, node.x + direction * world.range(1.4, 2.3)),
    ),
    y: Math.max(-3.45, Math.min(-0.8, node.y + world.range(-0.55, 0.35))),
    z: Math.max(-5.9, Math.min(6.15, node.z + world.range(-0.5, 0.2))),
  };
  if (world.nest.nodes.some((n) => n !== node && distance3(n, goal) < 0.8))
    return null;
  world.nest.linkWidths ??= world.nest.links.map(() => 0.38);
  const front =
    world.nest.nodes.push({
      ...node,
      r: 0.28,
      type: "front",
      name: "Frente de escavação",
    }) - 1;
  world.nest.links.push([from, front]);
  world.nest.linkWidths.push(0.28);
  const project = {
    id: world.soil.nextId++,
    from,
    front,
    goal,
    completed: false,
    excavated: 0,
  };
  world.soil.projects.push(project);
  world.soil.lastProject = world.tick;
  world.nest.revision++;
  world.log("Uma frente de escavação começou junto a uma câmara.", "dig");
  return project;
}

/** Volume is a coarse capsule estimate; all resulting material stays in the ledger. */
export function digBite(world: SoilWorld, ant: SoilAgent, project: DigProject) {
  const front = world.nest.nodes[project.front],
    base = world.nest.nodes[project.from];
  const delta = sub(project.goal, front),
    remaining = Math.hypot(delta.x, delta.y, delta.z);
  if (remaining < 0.001) {
    project.completed = true;
    front.type = "chamber";
    front.name = "Câmara escavada";
    world.log("As operárias abriram uma nova câmara.", "dig");
    return;
  }
  const step = Math.min(0.035, remaining),
    direction = normalize(delta);
  const before = Math.max(
    0,
    distance3(front, base) - Math.max(0, base.r - front.r),
  );
  front.x += direction.x * step;
  front.y += direction.y * step;
  front.z += direction.z * step;
  const after = Math.max(
    0,
    distance3(front, base) - Math.max(0, base.r - front.r),
  );
  const mass = Math.PI * front.r ** 2 * (after - before);
  project.excavated += mass;
  removedSoil(world, ant, mass);
  world.nest.revision++;
}

export function updateDigProjects(world: SoilWorld) {
  if (world.tick - world.soil.lastProject < 450 || world.ants.length < 7)
    return;
  const local = world.ants.find(
    (a) =>
      a.kind === "worker" &&
      !a.soilTask &&
      !a.carrying &&
      a.node !== null &&
      a.node !== undefined &&
      ["nursery", "storage", "royal", "chamber"].includes(
        world.nest.nodes[a.node]?.type,
      ) &&
      distance3({ x: a.x, y: a.y || 0, z: a.z }, world.nest.nodes[a.node]) <
        0.9,
  );
  if (local?.node !== null && local?.node !== undefined)
    proposeDig(world, local.node);
}
