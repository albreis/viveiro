import type { SoilWorld, SoilPile } from "./types.ts";
import { distance3, pileRadius } from "./ledger.ts";

/** Coarse moisture/span heuristic, pending soil-mechanics calibration. */
export function collapseEdge(
  world: SoilWorld,
  edge: number,
  force = false,
): SoilPile | null {
  const pair = world.nest.links[edge];
  if (
    !pair ||
    (world.nest.rubble || []).some((p) => p.edge === edge && p.mass > 0.005)
  )
    return null;
  const a = world.nest.nodes[pair[0]],
    b = world.nest.nodes[pair[1]];
  const center = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 };
  if (
    center.y > -0.45 ||
    world.ants.some(
      (p) => distance3({ x: p.x, y: p.y || 0, z: p.z }, center) < 1,
    )
  )
    return null;
  const width = world.nest.linkWidths?.[edge] || 0.38;
  const mass =
    (4 / 3) * Math.PI * Math.min(width * 0.8, force ? 0.3 : 0.2) ** 3;
  const radius = pileRadius(mass);
  const rubble = {
    ...center,
    y: center.y - width + radius * 0.7,
    id: world.soil.nextId++,
    edge,
    mass,
  };
  world.nest.rubble ??= [];
  world.nest.erosionCuts ??= [];
  world.nest.rubble.push(rubble);
  world.nest.erosionCuts.push({
    ...center,
    y: center.y + width - radius * 0.35,
    r: radius,
  });
  world.soil.eroded += mass;
  world.soil.integrity[edge] = 0.75;
  world.nest.revision++;
  world.log(
    "Solo cedeu em uma galeria. As operárias podem remover o material solto.",
    "danger",
  );
  return rubble;
}
export function updateErosion(world: SoilWorld) {
  if (world.tick % 50) return;
  for (let i = 0; i < world.nest.links.length; i++) {
    const width = world.nest.linkWidths?.[i] || 0.38;
    const saturation = Math.max(0, world.params.humidity / 100 - 0.77);
    const dryness = Math.max(0, 0.18 - world.params.humidity / 100);
    const wear = saturation * (0.008 + width * 0.035) + dryness * 0.006;
    world.soil.integrity[i] = Math.max(
      0,
      (world.soil.integrity[i] ?? 1) - wear,
    );
    if (world.soil.integrity[i] < 0.4) collapseEdge(world, i);
  }
}
