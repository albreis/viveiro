import type { NestState } from "../navigation/types.ts";
/** Resolve semantic goals inside one colony; a foundress need not own every room yet. */
export function roomNode(
  nest: NestState,
  type: string,
  variant = 0,
  owner = 1,
): number {
  const ids = nest.nodes.flatMap((n, i) =>
    n.type === type && (n.colonyId || 1) === owner ? [i] : [],
  );
  if (ids.length) return ids[Math.abs(variant) % ids.length];
  if (type === "waste") return roomNode(nest, "entrance", variant, owner);
  const royal = nest.nodes.findIndex(
    (n) => n.type === "royal" && (n.colonyId || 1) === owner,
  );
  const entry = nest.nodes.findIndex(
    (n) => n.type === "entrance" && (n.colonyId || 1) === owner,
  );
  return royal >= 0 ? royal : Math.max(0, entry);
}
export const isStock = (nest: NestState, id: number, owner = 1) =>
  id === roomNode(nest, "storage", 0, owner);
