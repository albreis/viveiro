import { modelMath } from "../../libs/model-math.ts";
import type {
  AgentState,
  NavigationWorld,
  NavigationState,
  Vec3,
} from "./types.ts";
export const add = (a: Vec3, b: Vec3) => ({
  x: a.x + b.x,
  y: a.y + b.y,
  z: a.z + b.z,
});
export const sub = (a: Vec3, b: Vec3) => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: a.z - b.z,
});
export const scale = (a: Vec3, k: number) => ({
  x: a.x * k,
  y: a.y * k,
  z: a.z * k,
});
export const dot = (a: Vec3, b: Vec3) => a.x * b.x + a.y * b.y + a.z * b.z;
export const length = (a: Vec3) => modelMath.hypot(a.x, a.y, a.z);
export const normalize = (a: Vec3) => scale(a, 1 / (length(a) || 1));
export const cross = (a: Vec3, b: Vec3) => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});
export const position = (a: Pick<AgentState, "x" | "y" | "z">): Vec3 => ({
  x: a.x,
  y: a.y || 0,
  z: a.z,
});
export function limit(vector: Vec3, max: number) {
  const size = length(vector);
  return size > max ? scale(vector, max / size) : vector;
}
export function rotate(vector: Vec3, axis: Vec3, angle: number) {
  const c = modelMath.cos(angle),
    s = modelMath.sin(angle);
  return add(
    add(scale(vector, c), scale(cross(axis, vector), s)),
    scale(axis, dot(axis, vector) * (1 - c)),
  );
}
