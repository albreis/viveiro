import { family } from "./family.mjs";
import { prepareSocialChemistry } from "../../src/modules/social-chemistry/profile.ts";
import { bindNeighbors } from "../../src/modules/colonies/shared.ts";
import { invalidateNeighbors } from "../../src/modules/navigation/sensors.ts";
export function chemicalFamily() {
  const { w, child } = family("chemical-family");
  w.ants = [];
  child.ants = [];
  w.predators = [];
  w.nest = { nodes: [], links: [], revision: 2, relief: [] };
  child.nest = w.nest;
  const a = w.makeAnt("worker", 0, 0),
    b = child.makeAnt("worker", 0.45, 0);
  b.id = w.nextId++;
  w.ants = [a];
  child.ants = [b];
  Object.assign(a, {
    y: 0.008,
    normal: { x: 0, y: 1, z: 0 },
    energy: 100,
    crop: 0,
    caste: "minor",
  });
  Object.assign(b, {
    y: 0.008,
    normal: { x: 0, y: 1, z: 0 },
    energy: 100,
    crop: 0,
  });
  prepareSocialChemistry(w);
  w.socialChemistry.profiles["1"] = [1, 0, 0, 0];
  w.socialChemistry.profiles["2"] = [0, 1, 0, 0];
  prepareSocialChemistry(w);
  bindNeighbors(w);
  invalidateNeighbors(w);
  invalidateNeighbors(child);
  return { w, child, a, b };
}
