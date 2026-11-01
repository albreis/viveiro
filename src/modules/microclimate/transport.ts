import type { SoilClimate } from "./types.ts";
import { climatePairs, cellHeight } from "./grid.ts";
/** Reduced capillary redistribution plus gravitational drainage; not a calibrated Richards solver. */
export function transportSoilClimate(
  s: SoilClimate,
  dt: number,
  gravity = true,
) {
  const substeps = Math.max(1, Math.ceil(dt / 2)),
    step = dt / substeps;
  for (let sub = 0; sub < substeps; sub++)
    for (const [a, b, d] of climatePairs(s)) {
      const sa = s.water[a] / s.capacity,
        sb = s.water[b] / s.capacity,
        mean = (sa + sb) / 2;
      const flux =
        (0.0015 * (sa - sb) +
          (gravity
            ? (0.00015 * mean * mean * (cellHeight(s, a) - cellHeight(s, b))) /
              d
            : 0)) *
        step *
        s.capacity;
      const donor = flux >= 0 ? a : b,
        receiver = flux >= 0 ? b : a,
        q = Math.max(
          0,
          Math.min(
            Math.abs(flux),
            s.water[donor],
            s.capacity - s.water[receiver],
          ),
        );
      s.water[donor] -= q;
      s.water[receiver] += q;
      const heat =
        ((s.temperature[b] - s.temperature[a]) *
          (0.0008 + 0.0012 * mean) *
          step) /
        (d * d);
      s.temperature[a] += heat;
      s.temperature[b] -= heat;
    }
}
