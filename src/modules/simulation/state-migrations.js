import { resolveBiologicalProfile } from "../biology/catalog.ts";
import { restoreColonies } from "../colonies/shared.ts";
import { migrateGenetics } from "../genetics/reproduction.ts";
import { legacyLandscape } from "../landscape/generate.ts";
import { createColonyState, ensureIndividual } from "../colony/individual.ts";
import { migrateBrood } from "../colony/brood.ts";
import { requestRoute } from "../navigation/local-routing.ts";
import { createNestOdors } from "../chemistry/nest-odors.ts";
import { createNest } from "./nest.ts";
import { createSoilState } from "../soil/ledger.ts";
import {
  tunnelFooting,
  tunnelEnvelope,
  projectSupport,
} from "../terrain/terrain.js";
export function restoreWorld(snapshot, prototype) {
  const world = Object.create(prototype);
  Object.assign(world, JSON.parse(JSON.stringify(snapshot)));
  resolveBiologicalProfile(world.biologicalProfile);
  world.landscape ??= legacyLandscape();
  if (!world.nest || world.nest.revision < 2) {
    world.nest = createNest(world.seed, world.landscape);
    const q = world.ants.find((a) => a.kind === "queen");
    if (q) Object.assign(q, world.nest.nodes[2], { node: 2 });
  }
  world.nestOdors ??= createNestOdors(world.nest);
  world.soil ??= createSoilState(world.ants);
  world.colony ??= createColonyState();
  for (const ant of world.ants) ensureIndividual(world.seed, ant);
  migrateBrood(world);
  migrateGenetics(world);
  for (const ant of world.ants) {
    if (ant.y === undefined) {
      ant.y = 0;
      if (ant.kind === "queen")
        Object.assign(ant, world.nest.nodes[2], { node: 2 });
    }
  }
  if (world.physicsVersion !== 5) {
    const queen = world.ants.find((a) => a.kind === "queen");
    if (queen) {
      queen.x = world.nest.nodes[2].x - 0.34;
      queen.z = world.nest.nodes[2].z - 0.33;
      queen.tunnelY = world.nest.nodes[2].y;
    }
    for (const ant of world.ants)
      if (ant.y < -0.1) {
        ant.tunnelY = world.nest.nodes[ant.node]?.y ?? ant.y;
        ant.tunnelCenter = null;
        ant.y =
          tunnelEnvelope(world.nest, ant.x, ant.z, ant.tunnelY).floor + 0.008;
        ant.normal = { x: 0, y: 1, z: 0 };
      }
    for (const ant of world.ants)
      if ((ant.y || 0) < -0.1) {
        let support = projectSupport(world.nest, {
          x: ant.x,
          y: ant.y,
          z: ant.z,
        });
        if (Math.abs(support.gap - 0.008) > 0.025) {
          const center = ant.tunnelCenter || {
            x: ant.x,
            y: ant.tunnelY || ant.y,
            z: ant.z,
          };
          const from = world.nest.nodes[ant.node] || center;
          const to = world.nest.nodes[ant.route?.[0]] || center;
          const footing = tunnelFooting(
            world.nest,
            center,
            from,
            to,
            ant.navigation?.wallAngle || 0.35,
          );
          if (footing.inside)
            support = { point: footing, normal: footing.normal, gap: 0.008 };
        }
        Object.assign(ant, support.point, { normal: support.normal });
        ant.previousX = ant.x;
        ant.previousY = ant.y;
        ant.previousZ = ant.z;
        delete ant.supportMotion;
      }
    world.physicsVersion = 5;
  }
  if (world.localRoutingVersion !== 1) {
    for (const ant of world.ants) {
      const target = ant.route?.at(-1);
      if (ant.node != null && target !== undefined)
        requestRoute(world, ant, target);
    }
    world.localRoutingVersion = 1;
  }
  restoreColonies(world, prototype, restoreWorld);
  return world;
}
