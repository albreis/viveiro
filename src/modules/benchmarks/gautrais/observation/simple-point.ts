/** A deletion must retain one foreground 8-component and one adjacent
 * background 4-component. An isolated last pixel is never deleted. */
export function simplePoint(cells: Uint8Array, at: number, width: number) {
  const values = new Uint8Array(9);
  for (let y = -1; y <= 1; y++)
    for (let x = -1; x <= 1; x++)
      values[(y + 1) * 3 + x + 1] = cells[at + y * width + x];
  const count = (value: number, diagonal: boolean, adjacentOnly: boolean) => {
    const seen = new Set<number>();
    let components = 0;
    for (let start = 0; start < 9; start++) {
      if (start === 4 || seen.has(start) || values[start] !== value) continue;
      const queue = [start];
      seen.add(start);
      let adjacent = false;
      for (let i = 0; i < queue.length; i++) {
        const p = queue[i],
          x = p % 3,
          y = Math.floor(p / 3);
        adjacent ||= [1, 3, 5, 7].includes(p);
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            if (
              (!dx && !dy) ||
              (!diagonal && Math.abs(dx) + Math.abs(dy) !== 1)
            )
              continue;
            const nx = x + dx,
              ny = y + dy,
              n = ny * 3 + nx;
            if (
              nx >= 0 &&
              ny >= 0 &&
              nx < 3 &&
              ny < 3 &&
              n !== 4 &&
              !seen.has(n) &&
              values[n] === value
            ) {
              seen.add(n);
              queue.push(n);
            }
          }
      }
      if (!adjacentOnly || adjacent) components++;
    }
    return components;
  };
  return count(1, true, false) === 1 && count(0, false, true) === 1;
}
