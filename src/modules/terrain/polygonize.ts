import type { MeshGrid } from "./mesh-grid.ts";

const EDGES = [
  [0, 1],
  [1, 2],
  [2, 0],
  [0, 3],
  [1, 3],
  [2, 3],
];
const TETRAHEDRA = [
  [0, 5, 1, 6],
  [0, 1, 2, 6],
  [0, 2, 3, 6],
  [0, 3, 7, 6],
  [0, 7, 4, 6],
  [0, 4, 5, 6],
];
const TRIANGLES = [
  [],
  [0, 3, 2],
  [0, 1, 4],
  [1, 4, 2, 2, 4, 3],
  [1, 2, 5],
  [0, 3, 5, 0, 5, 1],
  [0, 2, 5, 0, 5, 4],
  [5, 4, 3],
  [3, 4, 5],
  [4, 5, 0, 5, 2, 0],
  [1, 5, 0, 5, 3, 0],
  [5, 2, 1],
  [3, 4, 2, 2, 4, 1],
  [4, 1, 0],
  [2, 3, 0],
  [],
];
interface Vertex {
  x: number;
  y: number;
  z: number;
  nx: number;
  ny: number;
  nz: number;
}
interface Part {
  positions: number[];
  normals: number[];
  uvs: number[];
  colors: number[];
}
const part = (): Part => ({ positions: [], normals: [], uvs: [], colors: [] });

function intersect(grid: MeshGrid, a: number, b: number): Vertex {
  const valueA = grid.values[a],
    valueB = grid.values[b],
    t = valueA / (valueA - valueB);
  const point = (index: number) => {
    const x = index % (grid.nx + 1);
    const row = Math.floor(index / (grid.nx + 1)),
      z = row % (grid.nz + 1),
      y = Math.floor(row / (grid.nz + 1));
    return [
      grid.minX + x * grid.sx,
      grid.minY + y * grid.sy,
      grid.minZ + z * grid.sz,
    ];
  };
  const pa = point(a),
    pb = point(b);
  const nx = grid.normals[a * 3] * (1 - t) + grid.normals[b * 3] * t;
  const ny = grid.normals[a * 3 + 1] * (1 - t) + grid.normals[b * 3 + 1] * t;
  const nz = grid.normals[a * 3 + 2] * (1 - t) + grid.normals[b * 3 + 2] * t;
  const size = Math.hypot(nx, ny, nz) || 1;
  return {
    x: pa[0] + (pb[0] - pa[0]) * t,
    y: pa[1] + (pb[1] - pa[1]) * t,
    z: pa[2] + (pb[2] - pa[2]) * t,
    nx: nx / size,
    ny: ny / size,
    nz: nz / size,
  };
}

function triangle(
  walls: Part,
  top: Part,
  inner: Part,
  a: Vertex,
  b: Vertex,
  c: Vertex,
) {
  const ux = b.x - a.x,
    uy = b.y - a.y,
    uz = b.z - a.z;
  const vx = c.x - a.x,
    vy = c.y - a.y,
    vz = c.z - a.z;
  const normal = {
    x: uy * vz - uz * vy,
    y: uz * vx - ux * vz,
    z: ux * vy - uy * vx,
  };
  if (normal.x * a.nx + normal.y * a.ny + normal.z * a.nz < 0) [b, c] = [c, b];
  const isTop =
    (a.y + b.y + c.y) / 3 > -0.09 && (a.ny + b.ny + c.ny) / 3 > 0.65;
  const cavityWall =
    !isTop &&
    [a, b, c].every(
      (v) => Math.abs(v.x) < 9.98 && Math.abs(v.z) < 6.48 && v.y > -4.18,
    );
  const output = isTop ? top : cavityWall ? inner : walls;
  for (const v of [a, b, c]) {
    output.positions.push(v.x, v.y, v.z);
    output.normals.push(v.nx, v.ny, v.nz);
    output.uvs.push(v.x / 10, isTop ? v.z / 6.5 : v.y / 4.2);
    const strata =
      0.94 + Math.sin(v.y * 18) * 0.035 + Math.sin(v.x * 0.9 + v.z) * 0.02;
    output.colors.push(
      isTop ? 1 : 0.46 * strata,
      isTop ? 1 : 0.3 * strata,
      isTop ? 1 : 0.18 * strata,
    );
  }
}

export function polygonize(
  grid: MeshGrid,
  refine: (v: Vertex) => Vertex = (v) => v,
) {
  const cache = new Map<number, Vertex>();
  const edgeVertex = (a: number, b: number) => {
    const key = Math.min(a, b) * grid.values.length + Math.max(a, b);
    let vertex = cache.get(key);
    if (!vertex) {
      vertex = refine(intersect(grid, a, b));
      cache.set(key, vertex);
    }
    return vertex;
  };
  const walls = part(),
    top = part(),
    inner = part(),
    row = grid.nx + 1,
    layer = row * (grid.nz + 1);
  for (let y = 0; y < grid.ny; y++)
    for (let z = 0; z < grid.nz; z++)
      for (let x = 0; x < grid.nx; x++) {
        const p = (y * (grid.nz + 1) + z) * row + x;
        const corners = [
          p,
          p + 1,
          p + row + 1,
          p + row,
          p + layer,
          p + layer + 1,
          p + layer + row + 1,
          p + layer + row,
        ];
        const inside = corners.map((index) => grid.values[index] < 0);
        if (inside.every(Boolean) || inside.every((value) => !value)) continue;
        for (const tetra of TETRAHEDRA) {
          const indices = tetra.map((index) => corners[index]);
          const mask = indices.reduce(
            (value, index, bit) =>
              value | (grid.values[index] < 0 ? 1 << bit : 0),
            0,
          );
          const edges = TRIANGLES[mask];
          for (let i = 0; i < edges.length; i += 3) {
            const vertices = edges.slice(i, i + 3).map((edge) => {
              const [a, b] = EDGES[edge];
              return edgeVertex(indices[a], indices[b]);
            });
            triangle(walls, top, inner, vertices[0], vertices[1], vertices[2]);
          }
        }
      }
  return { walls, top, inner };
}
