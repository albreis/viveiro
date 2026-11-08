/** Standalone ODD reference: gather incoming rates per cell instead of pairwise fluxes.
 * Does not import the production solver or any other Viveiro module.
 * Internal cross-check by the same project; not independent scientific validation.
 */
export interface ReferenceFieldParameters {
  width: number;
  height: number;
  cellSize: number;
  diffusion: number;
  decay: number;
  dt: number;
  windX?: number;
  windZ?: number;
}
export function referenceField(
  input: readonly number[],
  p: ReferenceFieldParameters,
): number[] {
  const {
    width: w,
    height: rows,
    cellSize: h,
    diffusion: d,
    dt: duration,
    decay: lambda,
  } = p;
  const vx = p.windX ?? 0,
    vz = p.windZ ?? 0;
  if (
    !Number.isSafeInteger(w) ||
    !Number.isSafeInteger(rows) ||
    w <= 0 ||
    rows <= 0 ||
    input.length !== w * rows ||
    ![h, d, duration, lambda, vx, vz, ...input].every(Number.isFinite) ||
    h <= 0 ||
    d < 0 ||
    duration < 0 ||
    lambda < 0 ||
    input.some((v) => v < 0)
  )
    throw Error("Domínio inválido para a referência ODD.");
  const steps = Math.max(
    1,
    Math.ceil(
      (((4 * d) / h ** 2 + (Math.abs(vx) + Math.abs(vz)) / h) * duration) /
        0.85,
    ),
  );
  const delta = duration / steps,
    fade = Math.exp(-lambda * delta),
    diffusionRate = d / h ** 2;
  let values = [...input];
  for (let step = 0; step < steps; step++) {
    values = values.map((value, i, previous) => {
      const x = i % w,
        z = Math.floor(i / w);
      const neighbors = [
        { x: x - 1, z, velocity: -vx },
        { x: x + 1, z, velocity: vx },
        { x, z: z - 1, velocity: -vz },
        { x, z: z + 1, velocity: vz },
      ].filter((n) => n.x >= 0 && n.x < w && n.z >= 0 && n.z < rows);
      let incoming = 0,
        outgoing = 0;
      for (const n of neighbors) {
        outgoing += diffusionRate + Math.max(n.velocity, 0) / h;
        incoming +=
          previous[n.z * w + n.x] *
          (diffusionRate + Math.max(-n.velocity, 0) / h);
      }
      return Math.max(
        0,
        (value * (1 - outgoing * delta) + incoming * delta) * fade,
      );
    });
  }
  return values;
}
