import type { Landscape, Hill, Pond } from "./types.ts";
export function ellipseLevel(
  x: number,
  z: number,
  p: { x: number; z: number; angle: number },
  rx: number,
  rz: number,
) {
  const dx = x - p.x,
    dz = z - p.z,
    c = Math.cos(p.angle),
    s = Math.sin(p.angle);
  return ((dx * c + dz * s) / rx) ** 2 + ((-dx * s + dz * c) / rz) ** 2;
}
export const waterScale = (p: Pond) =>
  p.volume < 0.02 ? 0 : 0.35 + p.volume * 0.65;
export function waterLevel(
  land: Landscape | undefined,
  x: number,
  z: number,
  maximum = false,
) {
  if (!land) return Infinity;
  return land.ponds.reduce((level, p) => {
    const scale = maximum ? 1.1 : waterScale(p);
    return scale
      ? Math.min(level, ellipseLevel(x, z, p, p.rx * scale, p.rz * scale))
      : level;
  }, Infinity);
}
export function timberLevel(land: Landscape | undefined, x: number, z: number) {
  if (!land) return Infinity;
  return land.logs.reduce((level, p) => {
    const scale = 0.55 + p.integrity * 0.45;
    return Math.min(
      level,
      ellipseLevel(
        x,
        z,
        p,
        (p.kind === "stump" ? p.radius : p.length / 2) * scale + 0.14,
        p.radius * scale + 0.14,
      ),
    );
  }, Infinity);
}
export function surfaceHeight(
  relief: Hill[] | undefined,
  x: number,
  z: number,
) {
  let y = 0;
  for (const h of relief || [])
    y +=
      h.height * Math.exp(-((x - h.x) ** 2 + (z - h.z) ** 2) / h.radius ** 2);
  return y;
}
export function surfaceNormal(
  relief: Hill[] | undefined,
  x: number,
  z: number,
) {
  const e = 0.01,
    dx =
      (surfaceHeight(relief, x + e, z) - surfaceHeight(relief, x - e, z)) /
      (2 * e);
  const dz =
      (surfaceHeight(relief, x, z + e) - surfaceHeight(relief, x, z - e)) /
      (2 * e),
    n = Math.hypot(dx, 1, dz);
  return { x: -dx / n, y: 1 / n, z: -dz / n };
}

const reliefBounds = new WeakMap<Hill[], { height: number; normalY: number }>();
/** Conservative upper bound for (y-height)*normal.y, including arbitrary saved relief. */
export function surfaceDistanceUpperBound(
  relief: Hill[] | undefined,
  y: number,
) {
  if (!relief?.length) return y;
  let bounds = reliefBounds.get(relief);
  if (!bounds) {
    const minimum = relief.reduce((n, h) => n + Math.min(0, h.height), 0);
    const slope = relief.reduce(
      (n, h) => n + (0.858 * Math.abs(h.height)) / h.radius,
      0,
    );
    bounds = { height: minimum, normalY: 1 / Math.sqrt(1 + slope * slope) };
    reliefBounds.set(relief, bounds);
  }
  const distance = y - bounds.height;
  return distance < 0 ? distance * bounds.normalY : distance;
}
