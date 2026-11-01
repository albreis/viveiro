import type { NestState, Vec3 } from "../navigation/types.ts";
import type { RoofGeometry } from "./types.ts";
import { sampleSoil } from "../terrain/field.ts";
import { surfaceHeight } from "../landscape/queries.ts";
const solid = (n: NestState, p: Vec3) => sampleSoil(n, p).distance < -0.002;
function roofAt(n: NestState, p: Vec3) {
  let lo = p.y,
    hi = lo,
    found = false;
  const top = surfaceHeight(n.relief, p.x, p.z);
  for (let i = 0; i < 40 && hi < top; i++) {
    hi += 0.04;
    if (solid(n, { ...p, y: hi })) {
      found = true;
      break;
    }
    lo = hi;
  }
  if (!found) return null;
  for (let i = 0; i < 7; i++) {
    const mid = (lo + hi) / 2;
    if (solid(n, { ...p, y: mid })) hi = mid;
    else lo = mid;
  }
  return { ...p, y: (lo + hi) / 2 };
}
function halfSpan(n: NestState, p: Vec3, dx: number, dz: number) {
  for (let j = 1; j <= 40; j++) {
    const t = j * 0.05,
      q = { x: p.x + dx * t, y: p.y, z: p.z + dz * t };
    if (Math.abs(q.x) >= 9.99 || Math.abs(q.z) >= 6.49 || solid(n, q)) return t;
  }
  return 2;
}
export function roofGeometry(n: NestState): RoofGeometry[] {
  n = { ...n, rubble: [] };
  const patches: RoofGeometry[] = [];
  n.links.forEach(([a, b], edge) => {
    const p = n.nodes[a],
      q = n.nodes[b],
      horizontal = Math.hypot(q.x - p.x, q.z - p.z),
      dx = horizontal > 0.05 ? -(q.z - p.z) / horizontal : 1,
      dz = horizontal > 0.05 ? (q.x - p.x) / horizontal : 0;
    for (const fraction of [0.25, 0.5, 0.75]) {
      const center = {
        x: p.x + (q.x - p.x) * fraction,
        y: p.y + (q.y - p.y) * fraction,
        z: p.z + (q.z - p.z) * fraction,
      };
      if (center.y > surfaceHeight(n.relief, center.x, center.z) - 0.25)
        continue;
      const roof = roofAt(n, center);
      if (!roof) continue;
      let thickness = 0.04;
      for (let i = 1; i <= 30; i++) {
        const at = { ...roof, y: roof.y + i * 0.05 };
        if (!solid(n, at)) break;
        thickness = i * 0.05;
      }
      const left = halfSpan(n, center, dx, dz),
        right = halfSpan(n, center, -dx, -dz);
      let supports = 0;
      for (const [sign, reach] of [
        [1, left],
        [-1, right],
      ])
        for (const drop of [0.12, 0.3, 0.5]) {
          const at = {
            x: center.x + dx * sign * (reach + 0.1),
            y: roof.y - drop,
            z: center.z + dz * sign * (reach + 0.1),
          };
          if (solid(n, at) || Math.abs(at.x) >= 9.99 || Math.abs(at.z) >= 6.49)
            supports++;
        }
      patches.push({
        key: edge + ":" + fraction,
        edge,
        center,
        roof,
        span: left + right,
        thickness,
        depth: Math.max(0.02, surfaceHeight(n.relief, roof.x, roof.z) - roof.y),
        abutment: supports / 6,
      });
    }
  });
  return patches;
}
