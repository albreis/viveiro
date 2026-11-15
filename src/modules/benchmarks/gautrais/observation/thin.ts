import { simplePoint } from "./simple-point.ts";
import { validateMask, type PlanarMask } from "./mask.ts";

/** Directional Zhang-Suen candidates with a sequential simple-point guard. */
export function thinMask(mask: PlanarMask): PlanarMask {
  validateMask(mask);
  // A zero border makes foreground at the observation boundary a real endpoint.
  const width = mask.width + 2,
    height = mask.height + 2,
    cells = new Uint8Array(width * height);
  for (let y = 0; y < mask.height; y++)
    cells.set(
      mask.cells.subarray(y * mask.width, (y + 1) * mask.width),
      (y + 1) * width + 1,
    );
  const remove: number[] = [];
  for (let iteration = 0; iteration <= cells.length; iteration++) {
    let changed = false;
    for (let pass = 0; pass < 2; pass++) {
      remove.length = 0;
      for (let y = 1; y < height - 1; y++)
        for (let x = 1; x < width - 1; x++) {
          const p = y * width + x;
          if (!cells[p]) continue;
          const n = [
            cells[p - width],
            cells[p - width + 1],
            cells[p + 1],
            cells[p + width + 1],
            cells[p + width],
            cells[p + width - 1],
            cells[p - 1],
            cells[p - width - 1],
          ];
          const count = n.reduce((a, b) => a + b, 0);
          if (count < 2 || count > 6) continue;
          let transitions = 0;
          for (let i = 0; i < 8; i++)
            if (!n[i] && n[(i + 1) % 8]) transitions++;
          if (transitions !== 1) continue;
          if (
            pass === 0
              ? n[0] * n[2] * n[4] || n[2] * n[4] * n[6]
              : n[0] * n[2] * n[6] || n[0] * n[4] * n[6]
          )
            continue;
          remove.push(p);
        }
      let deleted = 0;
      for (const p of remove)
        if (simplePoint(cells, p, width)) {
          cells[p] = 0;
          deleted++;
        }
      changed ||= deleted > 0;
    }
    if (!changed) {
      const result = new Uint8Array(mask.cells.length);
      for (let y = 0; y < mask.height; y++)
        result.set(
          cells.subarray((y + 1) * width + 1, (y + 1) * width + 1 + mask.width),
          y * mask.width,
        );
      return { ...mask, cells: result };
    }
  }
  throw Error("Thinning did not converge");
}
