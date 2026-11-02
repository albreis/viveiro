import type { NestState } from "../navigation/types.ts";
/** Rectilinear samples remain shared across cells, avoiding patch seams. */
export function meshAxes(nest: NestState) {
  const axis = (min: number, max: number, count: number, extra: number[]) =>
    [
      ...new Set(
        [
          ...Array.from(
            { length: count + 1 },
            (_, i) => min + ((max - min) * i) / count,
          ),
          ...extra,
        ]
          .filter((n) => n >= min && n <= max)
          .map((n) => Number(n.toFixed(6))),
      ),
    ].sort((a, b) => a - b);
  const x = [-10, 10],
    z = [-6.5, 6.5];
  const entries = nest.nodes.filter(
    (n) => n.type === "entrance" && n.r >= 0.035,
  );
  // Every mouth gets a center column, even when detail refinement reaches its budget.
  for (const n of entries) {
    x.push(n.x);
    z.push(n.z);
  }
  // Prioritize narrow mouths; cap extra strips to bound mesh cost in mature nests.
  for (const n of [...entries].sort((a, b) => a.r - b.r).slice(0, 16))
    for (const side of [-0.8, -0.4, 0.4, 0.8]) {
      x.push(n.x + side * n.r);
      z.push(n.z + side * n.r);
    }
  return {
    x: axis(-10.4, 10.4, 96, x),
    y: axis(
      -4.5,
      0.3,
      34,
      [-0.24, -0.18, -0.12, -0.06, 0, 0.06, 0.12, 0.18, 0.24],
    ),
    z: axis(-6.9, 6.9, 64, z),
  };
}
