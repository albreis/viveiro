import { arriveMimic } from "../ecology/mimic-arrival.ts";
import { applyOdorPulse } from "../social-chemistry/intervention.ts";
import { arriveIntruder } from "../social-chemistry/intrusion-arrival.ts";
import { allAnts, allBrood, colonyWorlds } from "../colonies/types.ts";
import { advanceFamily } from "../colonies/update.ts";
import { createAgent } from "./agent-factory.ts";
import { waterLevel, surfaceHeight } from "../landscape/queries.ts";
import { arriveColony } from "../colony/arrival.ts";
import { feedFromStock } from "../colony/nutrition.ts";
import { routeOdorSignal } from "../chemistry/nest-odors.ts";
import { initializeWorld } from "./initial-world.js";
import { restoreWorld } from "./state-migrations.js";
import { removedSoil } from "../soil/ledger.ts";
import { collapseEdge } from "../soil/erosion.ts";
import { arriveWithSoil } from "../soil/routing.ts";
import { TICKS_PER_DAY, LIMIT, NEST, BOUNDS } from "./constants.js";
import { createNest, nestPath } from "./nest.ts";
import { moveInNest } from "../navigation/tunnel-motion.ts";
import { moveSurface } from "../navigation/surface-motion.ts";
import { positionClear } from "../navigation/collision.ts";
export { TICKS_PER_DAY, LIMIT, NEST, BOUNDS, createNest, nestPath };
export { hashSeed } from "./seed.ts";
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
export class World {
  constructor(seed = "SEMENTE-42", parameters = {}, options = {}) {
    initializeWorld(this, seed, parameters, options);
  }
  random() {
    this.rng = (this.rng + 0x6d2b79f5) >>> 0;
    let t = this.rng;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(a, b) {
    return a + (b - a) * this.random();
  }
  get day() {
    return this.tick / TICKS_PER_DAY;
  }
  get workers() {
    return this.ants.filter((a) => a.kind === "worker");
  }
  get population() {
    return this.ants.length;
  }
  inPond(x, z) {
    return waterLevel(this.landscape, x, z) < 1;
  }
  makeAnt(kind, x, z, suppliedGenome) {
    return createAgent(this, kind, x, z, suppliedGenome);
  }
  routeSignal(from, to, odor, owner) {
    return routeOdorSignal(
      this.nest,
      this.nestOdors,
      from,
      to,
      owner + ":" + odor,
    );
  }
  onNestArrival(ant, node) {
    if (
      ant.kind === "queen" &&
      this.founding?.phase === "digging" &&
      node === this.founding.front
    ) {
      ant.route = [];
      return true;
    }
    return (
      arriveMimic(this, ant, node) ||
      arriveIntruder(this, ant, node) ||
      arriveWithSoil(this, ant, node) ||
      arriveColony(this, ant, node)
    );
  }
  onStorageVisit(ant) {
    feedFromStock(this, ant);
  }
  recordSoilRemoval(ant, mass) {
    removedSoil(this, ant, mass);
  }
  moveInNest(ant) {
    return moveInNest(this, ant);
  }
  moveSurface(ant, heading, speed, predator = false) {
    return moveSurface(this, ant, heading, speed, predator);
  }
  positionClear(ant, point, heading, pitch, normal) {
    return positionClear(this, ant, point, heading, pitch, normal);
  }
  log(text, type = "info") {
    this.events.unshift({ tick: this.tick, day: this.day, text, type });
    this.events.length = Math.min(this.events.length, 35);
  }
  record() {
    this.history.push({
      tick: this.tick,
      day: this.day,
      population: allAnts(this).length,
      brood: allBrood(this).length,
      food: colonyWorlds(this).reduce(
        (n, c) => n + c.food + (c.colony.reproductiveFood || 0),
        0,
      ),
      plants: this.plants.reduce((n, p) => n + p.biomass, 0),
    });
    if (this.history.length > 500) this.history.shift();
    this.lastRecord = this.tick;
  }
  addPredator(x, z, announce = true) {
    if (this.predators.length >= 10) return false;
    this.predators.push({
      id: this.nextId++,
      x,
      y: surfaceHeight(this.nest.relief, x, z) + 0.008,
      z,
      angle: this.range(0, 6.283),
      energy: 100,
      cooldown: 0,
      prey: 0,
    });
    if (announce) this.log("Um predador entrou no terrário.", "danger");
    return true;
  }
  intervene(type, x = 0, z = 0, value) {
    x = clamp(Number(x) || 0, -BOUNDS.x, BOUNDS.x);
    z = clamp(Number(z) || 0, -BOUNDS.z, BOUNDS.z);
    if (type === "scent") return applyOdorPulse(this, x, z);
    if (type === "food") {
      this.patches.push({
        id: this.nextId++,
        x,
        z,
        amount: 5,
        capacity: 5,
        discovered: false,
        supplemental: true,
      });
      if (this.patches.length > 55)
        this.patches.splice(
          this.patches.findIndex((p) => p.supplemental),
          1,
        );
      this.log("Alimento adicionado. Quem vai encontrá-lo?", "food");
    } else if (
      type === "plant" &&
      this.plants.length < 100 &&
      !this.inPond(x, z)
    ) {
      this.plants.push({
        id: this.nextId++,
        x,
        z,
        biomass: 0.35,
        kind: this.nextId % 4,
        species: [
          "fern",
          "shrub",
          "tree",
          "grass",
          "cactus",
          "succulent",
          "flower",
          "moss",
        ][this.nextId % 8],
        health: 1,
        hydration: this.params.humidity / 100,
      });
      this.patches.push({
        id: this.nextId++,
        x,
        z,
        sourcePlant: this.plants.at(-1).id,
        amount: 0.25,
        capacity: 3,
        discovered: false,
      });
      this.log("Uma nova planta começa a crescer.", "plant");
    } else if (type === "predator") {
      if (
        this.nest.nodes.some(
          (n) => n.type === "entrance" && distance({ x, z }, n) < 2,
        )
      ) {
        this.log(
          "O ninho oferece abrigo. Coloque o predador mais longe.",
          "info",
        );
        return false;
      }
      return this.addPredator(x, z);
    } else if (type === "collapse") {
      for (let i = 0; i < this.nest.links.length; i++)
        if (collapseEdge(this, i, true)) return true;
      this.log("As galerias estão ocupadas. O solo não foi perturbado.");
      return false;
    } else if (type === "rain") {
      this.landscape.rainPulse = 1;
      for (const pond of this.landscape.ponds)
        pond.volume = Math.min(1, pond.volume + 0.18);
      this.params.humidity = clamp(this.params.humidity + 12, 0, 100);
      this.log("Chuva: a umidade do terrário aumentou.", "rain");
    } else if (type === "windX") {
      this.params.windX = clamp(Number(value) || 0, -4, 4);
      this.log(
        "Vento horizontal ajustado para " +
          this.params.windX +
          " unidades do modelo.",
      );
    } else if (type === "temperatureC") {
      this.params.temperatureC = clamp(
        Number.isFinite(Number(value)) ? Number(value) : 24,
        5,
        45,
      );
      this.log(
        "Temperatura de referência do ar ajustada para " +
          this.params.temperatureC +
          " °C.",
      );
    } else if (type === "reposeAngle") {
      this.params.reposeAngle = clamp(Number(value) || 36, 15, 55);
      this.log(
        "Ângulo de repouso experimental ajustado para " +
          this.params.reposeAngle +
          "°.",
      );
    } else if (["humidity", "light", "randomness"].includes(type)) {
      this.params[type] = clamp(Number(value) || 0, 0, 100);
      this.log(
        { humidity: "Umidade", light: "Luz", randomness: "Aleatoriedade" }[
          type
        ] +
          " ajustada para " +
          this.params[type] +
          "%.",
      );
    }
    return true;
  }
  pheromoneIndex(x, z) {
    return (
      clamp(Math.floor(((z + 6.5) / 13) * 26), 0, 25) * 40 +
      clamp(Math.floor(((x + 10) / 20) * 40), 0, 39)
    );
  }
  step(count = 1) {
    for (let n = 0; n < count; n++) this.advance();
  }
  advance() {
    return advanceFamily(this);
  }
  lifeLimit(ant) {
    return 70 + (ant.id % 37);
  }
  snapshot() {
    return JSON.parse(JSON.stringify(this));
  }
  static restore(snapshot) {
    return restoreWorld(snapshot, World.prototype);
  }
}
export { forecast } from "./forecast.js";
