import { World } from "../../src/modules/simulation/world.js";
import { profileReference } from "../../src/modules/biology/catalog.ts";
import { proposeDig } from "../../src/modules/soil/projects.ts";
import { diggingSites } from "../../src/modules/soil/front-access.ts";

export function digAccessFixture(version = 3, seed = "ACCESS-PILOT") {
  const world = new World(
    seed,
    {},
    {
      founding: false,
      biologicalProfile: profileReference("messor-narbonne", version),
    },
  );
  world.ants = [];
  world.brood = [];
  world.predators = [];
  const project = proposeDig(world, 3);
  if (!project) throw new Error("No local digging goal for fixture");
  const front = world.nest.nodes[project.front];
  for (const k of ["x", "y", "z"])
    front[k] += (project.goal[k] - front[k]) * 0.7;
  world.nest.revision++;
  const sites = diggingSites(world, project);
  function worker(site = sites[0], extra = {}) {
    const ant = Object.assign(
      world.makeAnt("worker", site.position.x, site.position.z),
      site.position,
      {
        normal: site.normal,
        node: project.front,
        route: [],
        tunnelCenter: { ...front },
        tunnelY: front.y,
        soilTask: { projectId: project.id, phase: "dig", digTicks: 3 },
      },
      extra,
    );
    world.ants.push(ant);
    return ant;
  }
  return { world, project, front, sites, worker };
}
