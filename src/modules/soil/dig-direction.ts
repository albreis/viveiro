import { modelMath } from "../../libs/model-math.ts";
import type { SoilWorld } from "./types.ts";
import type { Vec3 } from "../navigation/types.ts";
import { sampleSoil } from "../terrain/field.ts";
import { normalize } from "../navigation/vectors.ts";
import {
  surfaceHeight,
  waterLevel,
  timberLevel,
} from "../landscape/queries.ts";
export function chooseDigGoal(
  world: SoilWorld,
  from: number,
  previous?: Vec3,
): Vec3 | null {
  const node = world.nest.nodes[from];
  for (let attempt = 0; attempt < 36; attempt++) {
    const azimuth =
      previous && attempt < 12
        ? modelMath.atan2(previous.z, previous.x) + world.range(-0.9, 0.9)
        : world.range(0, Math.PI * 2);
    const rise =
      previous && attempt < 12
        ? previous.y + world.range(-0.35, 0.35)
        : world.range(-0.65, 0.75);
    const dir = normalize({
      x: modelMath.cos(azimuth),
      y: rise,
      z: modelMath.sin(azimuth),
    });
    const length = world.range(0.65, 0.95);
    const goal = {
      x: node.x + dir.x * length,
      y: node.y + dir.y * length,
      z: node.z + dir.z * length,
    };
    const top = surfaceHeight(world.nest.relief, goal.x, goal.z);
    if (
      Math.abs(goal.x) > 9.83 ||
      Math.abs(goal.z) > 6.33 ||
      goal.y < -3.45 ||
      goal.y > top + 0.03
    )
      continue;
    if (
      goal.y > top - 0.65 &&
      (waterLevel(world.landscape, goal.x, goal.z, true) < 2 ||
        timberLevel(world.landscape, goal.x, goal.z) < 2)
    )
      continue;
    // The probe is local: no remote map or global shortest path decides excavation.
    const emerging = goal.y > top - 0.15;
    if (emerging) goal.y = top + 0.03;
    const probe = { x: goal.x, y: emerging ? top - 0.3 : goal.y, z: goal.z };
    if (sampleSoil(world.nest, probe).distance > -0.13) continue;
    return goal;
  }
  return null;
}
