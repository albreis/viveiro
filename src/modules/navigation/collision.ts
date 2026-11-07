import { modelMath } from "../../libs/model-math.ts";
import type {
  AgentState,
  NavigationWorld,
  NavigationState,
  Vec3,
} from "./types.ts";
import { neighborsOf } from "./sensors.ts";
import { givingWay, idleYieldOn, working } from "./idle-yield.ts";

export function positionClear(
  world: NavigationWorld,
  entity: AgentState,
  point: Vec3,
  heading: number,
  pitch = 0,
  normal: Vec3 = { x: 0, y: 1, z: 0 },
) {
  const forward = {
    x: modelMath.cos(heading) * modelMath.cos(pitch),
    y: modelMath.sin(pitch),
    z: modelMath.sin(heading) * modelMath.cos(pitch),
  };
  const side = {
    x: forward.y * normal.z - forward.z * normal.y,
    y: forward.z * normal.x - forward.x * normal.z,
    z: forward.x * normal.y - forward.y * normal.x,
  };
  const squeeze = idleYieldOn(world) && working(entity);
  for (const other of neighborsOf(world, entity)) {
    if (squeeze && givingWay(world, other)) continue;
    const x = point.x - other.x,
      y = (point.y || 0) - (other.y || 0),
      z = point.z - other.z;
    const distance = x * x + y * y + z * z;
    const previous =
      modelMath.pow(entity.x - other.x, 2) +
      modelMath.pow((entity.y || 0) - (other.y || 0), 2) +
      modelMath.pow(entity.z - other.z, 2);
    if (distance > previous + 0.0001) continue; // Escape from an existing overlap remains possible.
    const height = Math.abs(x * normal.x + y * normal.y + z * normal.z);
    const along = x * forward.x + y * forward.y + z * forward.z;
    const across = x * side.x + y * side.y + z * side.z;
    const bodyScale = ((entity.bodyScale || 1) + (other.bodyScale || 1)) / 2;
    const radius =
      (["queen", "gyne"].includes(other.kind || "") ? 0.53 : 0.38) * bodyScale;
    const width =
      (["queen", "gyne"].includes(other.kind || "") ? 0.25 : 0.14) * bodyScale;
    if (
      height < 0.18 &&
      modelMath.pow(along / radius, 2) + modelMath.pow(across / width, 2) < 1
    )
      return false;
  }
  return true;
}
