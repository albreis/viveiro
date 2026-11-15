import type { PlanarMask } from "../../src/modules/benchmarks/gautrais/observation/mask.ts";
import type { ObservedGraph } from "../../src/modules/benchmarks/gautrais/types.ts";
export function sectionSvg(mask: PlanarMask, graph: ObservedGraph) {
  const { width, height, cells, pitch, originX, originY } = mask;
  const paths: string[] = [];
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width;) {
      if (!cells[y * width + x]) {
        x++;
        continue;
      }
      const start = x;
      while (x < width && cells[y * width + x]) x++;
      paths.push(
        "M" + start + " " + y + "h" + (x - start) + "v1h-" + (x - start) + "z",
      );
    }
  const point = (id: number) => {
    const n = graph.nodes.find((n) => n.id === id)!;
    return [(n.x - originX) / pitch, (n.y - originY) / pitch];
  };
  const lines = graph.edges
    .map((e) => {
      const a = point(e.from),
        b = point(e.to);
      return (
        '<line x1="' +
        a[0] +
        '" y1="' +
        a[1] +
        '" x2="' +
        b[0] +
        '" y2="' +
        b[1] +
        '"/>'
      );
    })
    .join("");
  const nodes = graph.nodes
    .map(
      (n) =>
        '<circle cx="' +
        (n.x - originX) / pitch +
        '" cy="' +
        (n.y - originY) / pitch +
        '" r="0.6"/>',
    )
    .join("");
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
    width +
    " " +
    height +
    '"><title>Physical World section and extracted network; model units</title><rect width="100%" height="100%" fill="#c5a573"/><path d="' +
    paths.join("") +
    '" fill="#fff9e8"/><g stroke="#29796e" stroke-width="0.35">' +
    lines +
    '</g><g fill="#934c23">' +
    nodes +
    "</g></svg>\n"
  );
}
