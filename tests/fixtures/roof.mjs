import { World } from "./established-world.mjs";
export function thinRoof() {
  const w = new World("roof-thin");
  w.ants = [];
  w.neighborAgents = [];
  w.brood = [];
  w.predators = [];
  w.nest = {
    nodes: [
      { x: -1, y: -2, z: 0, r: 0.55, type: "chamber", name: "a" },
      { x: 1, y: -2, z: 0, r: 0.55, type: "chamber", name: "b" },
      { x: -1, y: -0.85, z: 0, r: 0.45, type: "chamber", name: "c" },
      { x: 1, y: -0.85, z: 0, r: 0.45, type: "chamber", name: "d" },
    ],
    links: [
      [0, 1],
      [2, 3],
    ],
    linkWidths: [0.55, 0.45],
    revision: 2,
  };
  return w;
}
