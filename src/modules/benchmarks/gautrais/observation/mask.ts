export interface PlanarMask {
  width: number;
  height: number;
  cells: Uint8Array;
  originX: number;
  originY: number;
  pitch: number;
}
export function validateMask(mask: PlanarMask) {
  if (
    !Number.isInteger(mask.width) ||
    !Number.isInteger(mask.height) ||
    mask.width < 1 ||
    mask.height < 1 ||
    mask.width > 768 ||
    mask.height > 768 ||
    mask.width * mask.height !== mask.cells.length ||
    !(mask.cells instanceof Uint8Array) ||
    !Number.isFinite(mask.pitch) ||
    mask.pitch <= 0 ||
    ![mask.originX, mask.originY].every(Number.isFinite) ||
    mask.cells.some((v) => v !== 0 && v !== 1)
  )
    throw Error("Invalid planar observation mask");
}
export function maskTopology(mask: PlanarMask, foreground8 = false) {
  validateMask(mask);
  const { width, height, cells } = mask,
    seen = new Uint8Array(cells.length),
    queue = new Int32Array(cells.length);
  let components = 0,
    holes = 0;
  for (let start = 0; start < cells.length; start++) {
    if (seen[start]) continue;
    const value = cells[start],
      diagonals = value ? foreground8 : !foreground8;
    let tail = 1,
      head = 0,
      border = false;
    queue[0] = start;
    seen[start] = 1;
    while (head < tail) {
      const at = queue[head++],
        x = at % width,
        y = Math.floor(at / width);
      border ||= x === 0 || y === 0 || x === width - 1 || y === height - 1;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          if ((!dx && !dy) || (!diagonals && Math.abs(dx) + Math.abs(dy) !== 1))
            continue;
          const nx = x + dx,
            ny = y + dy,
            next = ny * width + nx;
          if (
            nx >= 0 &&
            ny >= 0 &&
            nx < width &&
            ny < height &&
            !seen[next] &&
            cells[next] === value
          ) {
            seen[next] = 1;
            queue[tail++] = next;
          }
        }
    }
    if (value) components++;
    else if (!border) holes++;
  }
  return { components, holes };
}

/** Resolve point-only diagonal contacts: foreground 4/background 8 -> 8/4. */
export function roundedLift(mask: PlanarMask): PlanarMask {
  validateMask(mask);
  if (mask.width > 256 || mask.height > 256)
    throw Error("At most 256 cells per observation axis");
  const width = mask.width * 3,
    height = mask.height * 3,
    cells = new Uint8Array(width * height);
  for (let y = 0; y < mask.height; y++)
    for (let x = 0; x < mask.width; x++)
      if (mask.cells[y * mask.width + x])
        for (let dy = 0; dy < 3; dy++)
          for (let dx = 0; dx < 3; dx++)
            cells[(3 * y + dy) * width + 3 * x + dx] = 1;
  const occupied = (x: number, y: number) =>
    x >= 0 &&
    y >= 0 &&
    x < mask.width &&
    y < mask.height &&
    mask.cells[y * mask.width + x] === 1;
  for (let y = 0; y <= mask.height; y++)
    for (let x = 0; x <= mask.width; x++) {
      if (
        occupied(x - 1, y - 1) &&
        occupied(x, y - 1) &&
        occupied(x - 1, y) &&
        occupied(x, y)
      )
        continue;
      for (const ny of [3 * y - 1, 3 * y])
        for (const nx of [3 * x - 1, 3 * x])
          if (nx >= 0 && ny >= 0 && nx < width && ny < height)
            cells[ny * width + nx] = 0;
    }
  return { ...mask, width, height, cells, pitch: mask.pitch / 3 };
}
