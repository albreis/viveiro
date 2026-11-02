import { ensureSoilClimate } from "../microclimate/initialize.ts";
import { syncGases } from "../ventilation/state.ts";
import { airNetwork } from "../ventilation/network.ts";
import { World } from "../simulation/world.js";
import type { FamilyWorld } from "../colonies/types.ts";
import type { ColonyAgent } from "../colony/types.ts";
import type { Vec3 } from "../navigation/types.ts";
import type { WorldWire } from "../persistence/types.ts";
import { profileReference } from "../biology/catalog.ts";
import { makeBrood } from "../colony/brood.ts";
import { surfaceHeight } from "../landscape/queries.ts";

export type LessonWorld = FamilyWorld & {
  params: FamilyWorld["params"] & Record<string, number>;
  intervene(type: string, x?: number, z?: number, value?: number): boolean;
  positionClear(
    ant: ColonyAgent,
    point: Vec3,
    angle: number,
    pitch: number,
    normal: Vec3,
  ): boolean;
  snapshot(): WorldWire;
};
export function lessonWorld(
  seed: string,
  semi = false,
  founding = false,
): LessonWorld {
  return new World(
    seed,
    {
      humidity: 68,
      light: 72,
      randomness: 28,
      reposeAngle: 36,
      temperatureC: 24,
      windX: 0,
      windZ: 0,
    },
    {
      founding,
      biologicalProfile: profileReference(
        semi ? "generic-semiclaustral-demo" : "generic-demo",
        semi ? 1 : 4,
      ),
    },
  ) as unknown as LessonWorld;
}
/** Prepared initial population, not a reconstructed biological history. */
export function populateLesson(w: LessonWorld) {
  w.ants = w.ants.filter((a) => a.kind === "queen");
  const entry = w.nest.nodes.find((n) => n.type === "entrance")!;
  for (let i = 0; i < 16; i++) {
    const ant = w.makeAnt("worker", entry.x, entry.z);
    let placed = false;
    for (let attempt = 0; attempt < 96; attempt++) {
      const angle = i * 1.8 + attempt * 2.4,
        radius = 0.8 + attempt * 0.07;
      const x = Math.max(
        -9.4,
        Math.min(9.4, entry.x + Math.cos(angle) * radius),
      );
      const z = Math.max(
        -5.9,
        Math.min(5.9, entry.z + Math.sin(angle) * radius),
      );
      const point = { x, y: surfaceHeight(w.nest.relief, x, z) + 0.008, z };
      if (
        !w.inPond(x, z) &&
        w.positionClear(ant, point, angle, 0, { x: 0, y: 1, z: 0 })
      ) {
        Object.assign(ant, point, { angle, age: i < 8 ? 2 : 20 });
        placed = true;
        break;
      }
    }
    if (!placed) throw Error("Não foi possível preparar a população da aula.");
    w.ants.push(ant);
  }
  const royal = w.nest.nodes.findIndex((n) => n.type === "royal");
  for (let i = 0; i < 8; i++) w.brood.push(makeBrood(w, w.nextId++, royal));
  w.food = 24;
  w.born = 16;
  w.events = w.events.filter((e) => e.type !== "birth");
  w.log(
    "Condição inicial didática: colônia e prole preparadas, sem trajetória histórica.",
  );
}
export function finishLessonWorld(w: LessonWorld, initialized = false) {
  if (initialized) {
    ensureSoilClimate(w);
    syncGases(w, airNetwork(w));
  }
  w.history = [];
  w.lastRecord = -25;
  w.record();
}
