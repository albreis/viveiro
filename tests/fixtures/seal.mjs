import { World } from "../../src/modules/simulation/world.js";
import { profileReference } from "../../src/modules/biology/catalog.ts";
import { beginSealing } from "../../src/modules/sealing/queen.ts";
export function sealFixture() {
  const w = new World(
    "seal-unit",
    { humidity: 68 },
    { biologicalProfile: profileReference("generic-demo", 3) },
  );
  w.nest = {
    revision: 2,
    nodes: [
      { x: 0, y: 0, z: 0, r: 0.42, type: "entrance", name: "Entry" },
      { x: 0.5, y: -1.2, z: 0, r: 0.68, type: "royal", name: "Chamber" },
    ],
    links: [[0, 1]],
    linkWidths: [0.42],
  };
  const f = w.founding;
  Object.assign(f, {
    phase: "digging",
    entry: 0,
    front: 1,
    site: { ...w.nest.nodes[0] },
    chamber: { ...w.nest.nodes[1] },
  });
  const q = w.ants.find((a) => a.kind === "queen");
  w.ants = [q];
  Object.assign(q, { x: 1, y: 0.008, z: 0, carryingSoil: 0, winged: false });
  w.soil.removed = w.soil.deposited = 1;
  w.soil.deposits = [{ id: 999, x: 1, y: 0.008, z: 0, mass: 1 }];
  beginSealing(w);
  return { w, q, p: w.nest.plugs[0] };
}
