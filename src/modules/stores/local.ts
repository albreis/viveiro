import type { StockWorld } from "./types.ts";
export function physicalStockVisit(
  w: StockWorld,
  a: { x: number; y?: number; z: number; node: number | null },
  node = a.node,
): boolean {
  if (!w.colony?.stores) return true;
  if (node === null || a.node !== node) return false;
  const room = w.nest?.nodes[node];
  return (
    !!room &&
    Math.hypot(a.x - room.x, (a.y ?? 0) - room.y, a.z - room.z) <= room.r + 0.15
  );
}
