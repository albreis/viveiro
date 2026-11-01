import { chemicalFamily } from "./chemical-family.mjs";
import { ensureEcology } from "../../src/modules/ecology/initialize.ts";
export function ecologyFixture() {
  const { w, child, a } = chemicalFamily();
  w.params.humidity = 65;
  w.params.light = 80;
  w.plants = [
    { id: 900, x: 0, z: 0, species: "flower", kind: 1, biomass: 1, health: 1 },
  ];
  child.ants = [];
  w.predators = [];
  w.food = 0;
  w.ants = [a];
  const e = ensureEcology(w);
  e.mimics = [];
  e.aphids = [{ id: 1, plant: 900, count: 12, honey: 0, visits: 0 }];
  a.crop = 0;
  a.carrying = 0;
  a.rest = 0;
  a.energy = 100;
  return { w, child, a, e };
}
