import { modelMath } from "../../libs/model-math.ts";
import type { NestState, Vec3 } from "../navigation/types.ts";
import { sampleSoil } from "../terrain/field.ts";
interface ContactBody {
  x: number;
  z: number;
  y?: number;
  normal?: Vec3;
  angle?: number;
  pitch?: number;
}
function mouth(ant: ContactBody): Vec3 {
  const normal = ant.normal || { x: 0, y: 1, z: 0 };
  return {
    x: ant.x + normal.x * 0.12 + modelMath.cos(ant.angle || 0) * 0.14,
    y: (ant.y || 0) + normal.y * 0.12 + modelMath.sin(ant.pitch || 0) * 0.14,
    z: ant.z + normal.z * 0.12 + modelMath.sin(ant.angle || 0) * 0.14,
  };
}
export function contactAcrossAir(
  nest: NestState,
  a: ContactBody,
  b: ContactBody,
) {
  const start = mouth(a),
    end = mouth(b);
  for (let i = 0; i <= 5; i++) {
    const t = i / 5;
    if (
      sampleSoil(nest, {
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
        z: start.z + (end.z - start.z) * t,
      }).distance < -0.005
    )
      return false;
  }
  return true;
}
