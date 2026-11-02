import { modelMath } from "../../libs/model-math.ts";
import { seededRandom } from "../../libs/seeded-random.ts";
import type { Landscape, Plant, Species } from "./types.ts";
import type { NestState } from "../navigation/types.ts";
import { waterLevel, timberLevel } from "./queries.ts";
import { SPECIES } from "./species.ts";

export function generateLandscape(seed: string): Landscape {
  const { random, range } = seededRandom(seed + ":landscape");
  const biome = (["woodland", "scrub", "meadow"] as const)[
    Math.floor(random() * 3)
  ];
  const land: Landscape = {
    version: 1,
    biome,
    relief: [],
    ponds: [],
    logs: [],
    rocks: [],
    wetness: 0.55,
    litter: 0.1,
    rainPulse: 0,
  };
  for (let i = 0; i < 4; i++)
    land.relief.push({
      x: range(-8, 8),
      z: range(-5, 5),
      radius: range(1.5, 3.2),
      height: range(0.025, 0.075),
    });
  const count = 1 + Math.floor(random() * 3);
  for (let i = 0; i < count; i++) {
    for (let attempt = 0; attempt < 60; attempt++) {
      const p = {
        id: i,
        x: range(-7.3, 7.3),
        z: range(-4.2, 4.2),
        rx: range(0.65, 1.55),
        rz: range(0.4, 0.95),
        angle: range(0, Math.PI),
        volume: range(0.45, 0.85),
      };
      if (
        land.ponds.some(
          (q) => modelMath.hypot(p.x - q.x, p.z - q.z) < p.rx + q.rx + 0.4,
        )
      )
        continue;
      land.ponds.push(p);
      break;
    }
  }
  for (let i = 0; i < 2 + Math.floor(random() * 4); i++) {
    for (let attempt = 0; attempt < 60; attempt++) {
      const p = {
        id: i,
        x: range(-7.4, 7.4),
        z: range(-4.3, 4.3),
        length: range(1, 2.7),
        radius: range(0.16, 0.36),
        angle: range(0, Math.PI * 2),
        kind: (["fallen", "forked", "stump"] as const)[i % 3],
        moisture: 0.5,
        integrity: 1,
        decay: 0,
      };
      if (
        waterLevel(land, p.x, p.z, true) < 2.5 ||
        timberLevel(land, p.x, p.z) < 3
      )
        continue;
      land.logs.push(p);
      break;
    }
  }
  for (let i = 0; i < 45 + Math.floor(random() * 35); i++) {
    const p = {
      id: i,
      x: range(-9.1, 9.1),
      z: range(-5.6, 5.6),
      radius: range(0.04, 0.16),
      aspect: range(0.6, 1.5),
      angle: range(0, 6.28),
      wetness: 0.5,
      moss: 0,
    };
    if (waterLevel(land, p.x, p.z, true) > 1.1) land.rocks.push(p);
  }
  return land;
}

export function generatePlants(
  seed: string,
  land: Landscape,
  nest: NestState,
  nextId: () => number,
): Plant[] {
  const { range, random } = seededRandom(seed + ":flora");
  const palettes: Record<Landscape["biome"], Species[]> = {
    woodland: [
      "fern",
      "tree",
      "shrub",
      "moss",
      "flower",
      "grass",
      "succulent",
      "cactus",
    ],
    scrub: [
      "cactus",
      "succulent",
      "grass",
      "shrub",
      "flower",
      "tree",
      "fern",
      "moss",
    ],
    meadow: [
      "grass",
      "flower",
      "shrub",
      "tree",
      "succulent",
      "fern",
      "cactus",
      "moss",
    ],
  };
  const species = palettes[land.biome],
    plants: Plant[] = [],
    count = Math.floor(range(42, 66));
  for (let i = 0; i < count; i++) {
    for (let attempt = 0; attempt < 80; attempt++) {
      const x = range(-8.9, 8.9),
        z = range(-5.4, 5.4);
      if (
        waterLevel(land, x, z, true) < 1.3 ||
        timberLevel(land, x, z) < 1.4 ||
        nest.nodes.some(
          (n) => n.type === "entrance" && modelMath.hypot(n.x - x, n.z - z) < 1,
        )
      )
        continue;
      const kind = i < 8 ? i : Math.floor(modelMath.pow(random(), 1.5) * 8),
        type = species[kind];
      plants.push({
        id: nextId(),
        x,
        z,
        kind: kind % 4,
        species: type,
        biomass: range(0.35, 0.95),
        health: range(0.75, 1),
        hydration: SPECIES[type].humidity,
        stress: 0,
        vigor: range(0.8, 1.2),
      });
      break;
    }
  }
  return plants;
}

/** Keep pre-procedural saves physically compatible with their original surface. */
export function legacyLandscape(): Landscape {
  return {
    version: 0,
    biome: "woodland",
    relief: [],
    wetness: 0.55,
    litter: 0.1,
    rainPulse: 0,
    ponds: [{ id: 0, x: 4.3, z: -2.5, rx: 1.9, rz: 1.35, angle: 0, volume: 1 }],
    logs: [
      {
        id: 0,
        x: 4.3,
        z: 3.6,
        length: 3.4,
        radius: 0.41,
        angle: 0.5,
        kind: "fallen",
        moisture: 0.5,
        integrity: 1,
        decay: 0,
      },
    ],
    rocks: [],
  };
}
