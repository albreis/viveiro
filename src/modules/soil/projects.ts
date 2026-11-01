import type { DigProject, SoilWorld, SoilAgent } from "./types.ts";
import { distance3, removedSoil } from "./ledger.ts";
import { normalize, sub } from "../navigation/vectors.ts";
import { chooseDigGoal } from "./dig-direction.ts";
import { surfaceHeight } from "../landscape/queries.ts";
export function proposeDig(world: SoilWorld, from: number): DigProject | null {
  const node = world.nest.nodes[from];
  if (
    !node ||
    world.soil.projects.filter((p) => !p.completed).length >= 2 ||
    world.nest.nodes.length >= 46
  )
    return null;
  if (world.soil.projects.some((p) => !p.completed && p.from === from))
    return null;
  const goal = chooseDigGoal(world, from);
  if (!goal) return null;
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
  const project: DigProject = {
    id: world.soil.nextId++,
    from,
    front,
    goal,
    completed: false,
    excavated: 0,
    remainingSegments: Math.floor(world.range(2, 5)),
    heading: normalize(sub(goal, node)),
  };
  world.soil.projects.push(project);
  world.soil.lastProject = world.tick;
  world.nest.revision++;
  world.log("Uma operária iniciou uma nova frente de escavação.", "dig");
  return project;
}
function advanceFront(world: SoilWorld, project: DigProject) {
  const front = world.nest.nodes[project.front];
  const top = surfaceHeight(world.nest.relief, front.x, front.z),
    emerged = front.y >= top - 0.15;
  const goal =
    !emerged &&
    (project.remainingSegments || 0) > 0 &&
    world.nest.nodes.length < 48
      ? chooseDigGoal(world, project.front, project.heading)
      : null;
  if (goal) {
    front.type = "junction";
    front.name = "Curva escavada";
    project.from = project.front;
    project.front =
      world.nest.nodes.push({
        ...front,
        type: "front",
        name: "Frente de escavação",
      }) - 1;
    world.nest.links.push([project.from, project.front]);
    world.nest.linkWidths!.push(0.28);
    project.remainingSegments!--;
    project.goal = goal;
    project.heading = normalize(sub(goal, front));
  } else {
    project.completed = true;
    front.type = emerged ? "entrance" : "chamber";
    front.name = emerged ? "Novo acesso escavado" : "Câmara escavada";
    world.log(
      emerged
        ? "A escavação alcançou a superfície e abriu outro acesso."
        : "As operárias abriram uma nova câmara.",
      "dig",
    );
  }
  world.nest.revision++;
}
/** Capsule volumes are approximate; removed material remains accounted for. */
export function digBite(world: SoilWorld, ant: SoilAgent, project: DigProject) {
  const front = world.nest.nodes[project.front],
    base = world.nest.nodes[project.from],
    delta = sub(project.goal, front),
    remaining = Math.hypot(delta.x, delta.y, delta.z);
  if (remaining < 0.001) {
    advanceFront(world, project);
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
