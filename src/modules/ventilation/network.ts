import { modelMath } from "../../libs/model-math.ts";
import { plugTransport } from "../sealing/passage.ts";
import { sampleClimate } from "../microclimate/grid.ts";
import { pileRadius } from "../soil/ledger.ts";
import type { GasWorld, AirNetwork } from "./types.ts";
/** Compartment volumes approximate spheres plus half of each connecting cylinder. */
export function airNetwork(w: GasWorld): AirNetwork {
  const volume = w.nest.nodes.map((n) =>
    Math.max(0.01, (4 / 3) * Math.PI * modelMath.pow(n.r, 3)),
  );
  const edges = w.nest.links.map(([a, b], i) => {
    const p = w.nest.nodes[a],
      q = w.nest.nodes[b],
      length = Math.max(0.1, modelMath.hypot(p.x - q.x, p.y - q.y, p.z - q.z));
    const r = w.nest.linkWidths?.[i] ?? 0.38,
      area = Math.PI * r * r;
    volume[a] += (area * length) / 2;
    volume[b] += (area * length) / 2;
    let clearance = 1;
    for (const rubble of w.nest.rubble || []) {
      if (rubble.mass <= 0.000001) continue;
      const dx = q.x - p.x,
        dy = q.y - p.y,
        dz = q.z - p.z,
        l2 = dx * dx + dy * dy + dz * dz;
      const t = Math.max(
        0,
        Math.min(
          1,
          ((rubble.x - p.x) * dx +
            (rubble.y - p.y) * dy +
            (rubble.z - p.z) * dz) /
            Math.max(l2, 0.0001),
        ),
      );
      const offset = modelMath.hypot(
          rubble.x - p.x - t * dx,
          rubble.y - p.y - t * dy,
          rubble.z - p.z - t * dz,
        ),
        rr = pileRadius(rubble.mass);
      const overlap = Math.max(0, Math.min(1, (r + rr - offset) / (2 * r)));
      clearance = Math.min(
        clearance,
        Math.max(0, 1 - modelMath.pow(rr / r, 2) * overlap),
      );
    }
    const temperature =
      ((sampleClimate(w.microclimate, p)?.temperature ?? 24) +
        (sampleClimate(w.microclimate, q)?.temperature ?? 24)) /
      2;
    const air = w.params.temperatureC ?? 24;
    const plug = plugTransport(w.nest, i);
    return {
      a,
      b,
      diffusion:
        ((0.0005 * area) / length) *
        modelMath.pow(clearance, 2) *
        plug.diffusion,
      conductance:
        ((0.02 * modelMath.pow(r, 4)) / length) *
        modelMath.pow(clearance, 4) *
        plug.flow,
      head: ((0.02 * (temperature - air)) / (air + 273.15)) * (q.y - p.y),
    };
  });
  for (const p of w.nest.plugs || []) {
    const pair = w.nest.links[p.edge];
    if (pair)
      for (const id of pair)
        volume[id] = Math.max(0.01, volume[id] - p.mass / 2);
  }
  return {
    volume,
    ventDiffusion: w.nest.nodes.map(
      (n) => (0.003 * Math.PI * n.r * n.r) / Math.max(0.1, n.r),
    ),
    edges,
    vents: w.nest.nodes.flatMap((n, i) => (n.type === "entrance" ? [i] : [])),
  };
}
