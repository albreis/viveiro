import type { LessonWorld } from "./world.ts";
import { createNestOdors } from "../chemistry/nest-odors.ts";
import { projectSupport } from "../terrain/surface-queries.ts";
import { ensureSoilClimate } from "../microclimate/initialize.ts";
import { airNetwork } from "../ventilation/network.ts";
import { syncGases } from "../ventilation/state.ts";
import { geneValue } from "../genetics/genome.ts";

export function ventilationNest(w: LessonWorld, second: boolean) {
  w.landscape.relief = [];
  w.nest = {
    nodes: [
      { x: -3, y: 0, z: 0, r: 0.4, type: "entrance", name: "Entrada" },
      { x: 0, y: -0.9, z: 0, r: 0.55, type: "chamber", name: "Junção" },
      { x: 1, y: -1.7, z: 0, r: 0.7, type: "royal", name: "Rainha" },
      { x: 0, y: -1.6, z: 1.2, r: 0.5, type: "storage", name: "Estoque" },
      {
        x: 3,
        y: second ? 0 : -0.7,
        z: 0,
        r: second ? 0.4 : 0.12,
        type: second ? "entrance" : "chamber",
        name: "Segundo acesso",
      },
    ],
    links: [
      [0, 1],
      [1, 2],
      [1, 3],
      [1, 4],
    ],
    linkWidths: [0.3, 0.3, 0.3, 0.3],
    revision: 2,
    relief: [],
  };
  w.nestOdors = createNestOdors(w.nest);
  w.plants = w.plants.filter(
    (p) => Math.hypot(p.x + 3, p.z) > 0.7 && Math.hypot(p.x - 3, p.z) > 0.7,
  );
  const plantIds = new Set(w.plants.map((p) => p.id));
  w.patches = w.patches.filter(
    (p) => p.sourcePlant === undefined || plantIds.has(p.sourcePlant),
  );
  const queen = w.ants.find((a) => a.kind === "queen")!;
  const support = projectSupport(w.nest, { x: 1, y: -2.3, z: 0 });
  Object.assign(queen, support.point, {
    normal: support.normal,
    node: 2,
    tunnelY: -1.7,
  });
}
export function preparedAir(w: LessonWorld) {
  const s = syncGases(w, airNetwork(w));
  for (const cell of s.cells) {
    cell.oxygen = cell.volume * 0.19;
    cell.carbon = cell.volume * 0.012;
  }
  s.initialOxygen = s.cells.reduce((sum, c) => sum + c.oxygen, 0);
  s.initialCarbon = s.cells.reduce((sum, c) => sum + c.carbon, 0);
}
export function warmSoil(w: LessonWorld, temperature: number) {
  w.params.temperatureC = temperature;
  const soil = ensureSoilClimate(w);
  soil.water.fill(0.55 * soil.capacity);
  soil.initialWater = soil.water.reduce((a, b) => a + b, 0);
  soil.temperature.fill(temperature);
  soil.initialHeat = soil.temperature.reduce((a, b) => a + b, 0);
}
export function maternalAllele(w: LessonWorld, value: number) {
  const queen = w.ants.find((a) => a.kind === "queen")!;
  const old = geneValue(queen.genome!, "locomotion");
  for (const copy of queen.genome!.haplotypes) copy[0] = value;
  for (const copy of w.genetics!.queen.genome.haplotypes) copy[0] = value;
  queen.speed *= (0.94 + value * 0.12) / (0.94 + old * 0.12);
}
export function initialTrail(w: LessonWorld) {
  const entry = w.nest.nodes[0];
  const food = [...w.patches].sort(
    (a, b) =>
      Math.hypot(a.x - entry.x, a.z - entry.z) -
      Math.hypot(b.x - entry.x, b.z - entry.z),
  )[0];
  for (let i = 0; i <= 20; i++) {
    const x = entry.x + ((food.x - entry.x) * i) / 20,
      z = entry.z + ((food.z - entry.z) * i) / 20;
    const ix = Math.max(0, Math.min(39, Math.floor((x + 10) * 2)));
    const iz = Math.max(0, Math.min(25, Math.floor((z + 6.5) * 2)));
    w.pheromones[iz * 40 + ix] = 0.8;
  }
}
