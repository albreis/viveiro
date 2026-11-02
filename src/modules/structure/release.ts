import { modelMath } from "../../libs/model-math.ts";
import type { SoilWorld, SoilPile } from "../soil/types.ts";
import type { RoofPatch } from "./types.ts";
import { sampleSoil } from "../terrain/field.ts";
import { pileRadius, distance3 } from "../soil/ledger.ts";
/** Deterministic solid-volume quadrature prevents counting an already hollow region again. */
export function solidVolume(
  w: SoilWorld,
  p: { x: number; y: number; z: number },
  r: number,
) {
  const n = 8,
    compact = { ...w.nest, rubble: [], plugs: [] };
  let count = 0;
  for (let ix = 0; ix < n; ix++)
    for (let iy = 0; iy < n; iy++)
      for (let iz = 0; iz < n; iz++) {
        const dx = (((ix + 0.5) / n) * 2 - 1) * r,
          dy = (((iy + 0.5) / n) * 2 - 1) * r,
          dz = (((iz + 0.5) / n) * 2 - 1) * r;
        if (dx * dx + dy * dy + dz * dz > r * r) continue;
        if (
          sampleSoil(compact, { x: p.x + dx, y: p.y + dy, z: p.z + dz })
            .distance < 0
        )
          count++;
      }
  return (count / modelMath.pow(n, 3)) * modelMath.pow(2 * r, 3);
}
export function releaseRoof(w: SoilWorld, patch: RoofPatch): SoilPile | null {
  if (
    (w.nest.rubble || []).some((g) => g.edge === patch.edge && g.mass > 0.002)
  )
    return null;
  const cutRadius = Math.min(
    0.18,
    patch.span * 0.18,
    Math.max(0.06, patch.thickness * 0.65),
  );
  const cut = {
    ...patch.roof,
    y: patch.roof.y + cutRadius * 0.25,
    r: cutRadius,
  };
  if (
    (w.nest.erosionCuts || []).some(
      (c) => distance3(c, cut) < (c.r + cut.r) * 0.75,
    )
  )
    return null;
  const mass = solidVolume(w, cut, cutRadius);
  if (mass < 0.00002) return null;
  const radius = pileRadius(mass),
    spawn = { ...patch.roof, y: patch.roof.y - radius - 0.015 };
  // Defer if no finite-radius air pocket exists or a body occupies the release pocket.
  if (
    sampleSoil(w.nest, spawn).distance < radius - 0.005 ||
    (w.neighborAgents || w.ants).some(
      (a) => distance3({ x: a.x, y: a.y ?? 0, z: a.z }, spawn) < radius + 0.18,
    )
  )
    return null;
  const grain = { ...spawn, id: w.soil.nextId++, edge: patch.edge, mass };
  (w.nest.erosionCuts ??= []).push(cut);
  (w.nest.rubble ??= []).push(grain);
  w.soil.eroded += mass;
  w.nest.revision++;
  return grain;
}
