import type { NestState } from "../navigation/types.ts";
/** Semantic goals remain valid when a new nest has only its founding chamber. */
export function roomNode(nest: NestState, type: string, variant = 0): number {
  const ids = nest.nodes.flatMap((n, i) => (n.type === type ? [i] : []));
  if (ids.length) return ids[Math.abs(variant) % ids.length];
  if (type === "waste") return roomNode(nest, "entrance", variant);
  const royal = nest.nodes.findIndex((n) => n.type === "royal");
  return royal >= 0 ? royal : 0;
}
export const isStock = (nest: NestState, id: number) =>
  id === roomNode(nest, "storage");
