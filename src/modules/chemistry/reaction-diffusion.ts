export interface FieldParameters {
  width: number;
  height: number;
  cellSize: number;
  diffusion: number;
  decay: number;
  dt: number;
  windX?: number;
  windZ?: number;
}
const buffers = new WeakMap<number[], Float64Array>();
/** Pairwise finite-volume fluxes; closed boundaries preserve mass except evaporation. */
export function diffuseEvaporate(field: number[], p: FieldParameters) {
  if (field.length !== p.width * p.height)
    throw new RangeError("Dimensões do campo incompatíveis.");
  if (
    !Number.isFinite(p.dt) ||
    p.dt < 0 ||
    !Number.isFinite(p.diffusion) ||
    p.diffusion < 0 ||
    !Number.isFinite(p.decay) ||
    p.decay < 0 ||
    !(p.cellSize > 0)
  )
    throw new RangeError("Parâmetros químicos inválidos.");
  const vx = p.windX || 0,
    vz = p.windZ || 0;
  if (!Number.isFinite(vx) || !Number.isFinite(vz))
    throw new RangeError("Vento inválido.");
  if (!field.some((v) => v !== 0)) return;
  const rate =
    (4 * p.diffusion) / p.cellSize ** 2 +
    (Math.abs(vx) + Math.abs(vz)) / p.cellSize;
  const steps = Math.max(1, Math.ceil((rate * p.dt) / 0.85)),
    dt = p.dt / steps;
  const alpha = (p.diffusion * dt) / p.cellSize ** 2,
    bx = (vx * dt) / p.cellSize,
    bz = (vz * dt) / p.cellSize;
  const decay = Math.exp(-p.decay * dt);
  let next = buffers.get(field);
  if (!next || next.length !== field.length) {
    next = new Float64Array(field.length);
    buffers.set(field, next);
  }
  for (let step = 0; step < steps; step++) {
    next.set(field);
    for (let z = 0; z < p.height; z++)
      for (let x = 0; x < p.width; x++) {
        const i = z * p.width + x;
        if (x + 1 < p.width) {
          const j = i + 1,
            flux =
              alpha * (field[i] - field[j]) +
              bx * (bx >= 0 ? field[i] : field[j]);
          next[i] -= flux;
          next[j] += flux;
        }
        if (z + 1 < p.height) {
          const j = i + p.width,
            flux =
              alpha * (field[i] - field[j]) +
              bz * (bz >= 0 ? field[i] : field[j]);
          next[i] -= flux;
          next[j] += flux;
        }
      }
    for (let i = 0; i < field.length; i++)
      field[i] = Math.max(0, next[i] * decay);
  }
}
export function depositPheromone(
  field: number[],
  index: number,
  amount: number,
  capacity = 5,
) {
  const added = Math.max(0, Math.min(amount, capacity - field[index]));
  field[index] += added;
  return added;
}
