import type { NestNode, NestState } from "../navigation/types.ts";
import type { Landscape } from "../landscape/types.ts";
import { seededRandom } from "../../libs/seeded-random.ts";
import {
  waterLevel,
  timberLevel,
  surfaceHeight,
} from "../landscape/queries.ts";
export function generateNest(
  seed: string = "SEMENTE-42",
  land?: Landscape,
): NestState {
  const { random, range } = seededRandom(seed + ":nest");
  const face = Math.floor(random() * 4),
    sign = face < 2 ? 1 : -1,
    alongX = face % 2 === 1;
  const origin = alongX
    ? { x: sign * 9.72, z: range(-2.2, 2.2) }
    : { x: range(-4, 4), z: sign * 6.22 };
  const point = (
    side: number,
    inward: number,
    y: number,
    r: number,
    type: string,
    name: string,
  ): NestNode => ({
    x: Math.max(
      -9.72,
      Math.min(9.72, origin.x + (alongX ? -sign * inward : side)),
    ),
    z: Math.max(
      -6.22,
      Math.min(6.22, origin.z + (alongX ? side : -sign * inward)),
    ),
    y,
    r,
    type,
    name,
  });
  const royal = point(
    0,
    0,
    range(-1.8, -1.25),
    range(0.64, 0.74),
    "royal",
    "Câmara da rainha",
  );
  const nursery = point(
    range(-2.3, -1.5),
    range(0.6, 1.4),
    range(-2.9, -2.2),
    range(0.65, 0.76),
    "nursery",
    "Berçário",
  );
  const storage = point(
    range(1.6, 2.8),
    range(1.6, 3),
    range(-1.8, -1.2),
    range(0.6, 0.7),
    "storage",
    "Despensa",
  );
  const waste = point(
    range(2.4, 3.8),
    range(2.5, 4.4),
    range(-3.3, -2.7),
    range(0.5, 0.6),
    "waste",
    "Resíduos",
  );
  const junction = point(
    range(-0.5, 0.5),
    range(1.3, 2.1),
    range(-2, -1.4),
    0.36,
    "junction",
    "Galeria",
  );
  const entry = (near: NestNode, index: number): NestNode => {
    for (let attempt = 0; attempt < 150; attempt++) {
      const x =
        attempt < 60
          ? Math.max(-8.7, Math.min(8.7, near.x + range(-1.6, 1.6)))
          : range(-8.5, 8.5);
      const z =
        attempt < 60
          ? Math.max(-5.3, Math.min(5.3, near.z + range(-1.6, 1.6)))
          : range(-5.2, 5.2);
      if (waterLevel(land, x, z, true) < 2.2 || timberLevel(land, x, z) < 3)
        continue;
      return {
        x,
        z,
        y: surfaceHeight(land?.relief, x, z) + 0.03,
        r: 0.36,
        type: "entrance",
        name: "Entrada " + index,
      };
    }
    return {
      x: 0,
      z: 0,
      y: 0.03,
      r: 0.36,
      type: "entrance",
      name: "Entrada " + index,
    };
  };
  // Chambers can touch different panes; visibility follows their physical volume.
  const otherFace = (face + (random() < 0.5 ? 1 : 3)) % 4;
  const expose = (room: NestNode, side: number) => {
    if (side % 2 === 0) {
      room.z = (side === 0 ? 1 : -1) * 6.22;
      room.x = range(-5, 5);
    } else {
      room.x = (side === 1 ? 1 : -1) * 9.72;
      room.z = range(-3.5, 3.5);
    }
  };
  expose(storage, otherFace);
  if (random() < 0.45)
    expose(waste, (otherFace + (random() < 0.5 ? 1 : 3)) % 4);
  const first = entry(junction, 1),
    second = entry(storage, 2);
  const shaft = (p: NestNode): NestNode => ({
    ...p,
    y: range(-0.95, -0.7),
    r: 0.32,
    type: "shaft",
    name: "Poço de acesso",
  });
  const nodes = [
    first,
    shaft(first),
    royal,
    nursery,
    storage,
    waste,
    second,
    shaft(second),
    junction,
  ];
  const links: [number, number][] = [
    [0, 1],
    [1, 2],
    [6, 7],
    [7, 4],
  ];
  // A minimum spanning tree varies room connectivity as well as their coordinates.
  const connected = [2],
    pending = [3, 4, 5, 8];
  while (pending.length) {
    let best: { a: number; b: number; cost: number } | undefined;
    for (const a of connected)
      for (const b of pending) {
        const p = nodes[a],
          q = nodes[b],
          cost =
            Math.hypot(p.x - q.x, p.y - q.y, p.z - q.z) *
            (0.9 + random() * 0.2);
        if (!best || cost < best.cost) best = { a, b, cost };
      }
    links.push([best!.a, best!.b]);
    connected.push(best!.b);
    pending.splice(pending.indexOf(best!.b), 1);
  }
  const extra: [number, number][] = [];
  for (const a of [2, 3, 4, 5, 8])
    for (const b of [2, 3, 4, 5, 8])
      if (
        a < b &&
        !links.some(([x, y]) => (x === a && y === b) || (x === b && y === a))
      )
        extra.push([a, b]);
  links.push(extra[Math.floor(random() * extra.length)]);
  return { nodes, links, revision: 2, relief: land?.relief };
}
