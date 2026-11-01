export const lerp = (a, b, t) => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  z: a.z + (b.z - a.z) * t,
});
export function isolatedGallery(w) {
  w.nest = {
    nodes: [
      { x: 0, y: -1.5, z: 0, r: 0.35, type: "junction", name: "A" },
      { x: 2, y: -1.5, z: 0, r: 0.65, type: "chamber", name: "B" },
    ],
    links: [[0, 1]],
    revision: 2,
  };
  return [w.nest.nodes[0], w.nest.nodes[1]];
}
export function undergroundEdge(w) {
  const options = w.nest.links
    .map(([a, b], i) => ({ a, b, i, p: w.nest.nodes[a], q: w.nest.nodes[b] }))
    .filter(
      (e) =>
        e.p.y < -0.6 &&
        e.q.y < -0.6 &&
        !["shaft", "entrance"].includes(e.p.type) &&
        !["shaft", "entrance"].includes(e.q.type),
    );
  options.sort(
    (a, b) =>
      Math.abs(Math.hypot(a.p.x - a.q.x, a.p.y - a.q.y, a.p.z - a.q.z) - 2.5) -
      Math.abs(Math.hypot(b.p.x - b.q.x, b.p.y - b.q.y, b.p.z - b.q.z) - 2.5),
  );
  return (
    options.find((e) =>
      w.ants.every(
        (a) =>
          Math.hypot(
            a.x - (e.p.x + e.q.x) / 2,
            a.y - (e.p.y + e.q.y) / 2,
            a.z - (e.p.z + e.q.z) / 2,
          ) > 1,
      ),
    ) ?? options[0]
  );
}
