import { updateEnvironment } from "./environment-step.js";
import { updateWorkers } from "./worker-step.js";
import { updatePredators } from "./predator-step.js";
import { tunnelFooting, tunnelEnvelope } from "../terrain/terrain.js";
import { TICKS_PER_DAY, LIMIT, NEST, BOUNDS } from "./constants.js";
import { createNest, nestPath } from "./nest.ts";
import { moveInNest } from "../navigation/tunnel-motion.ts";
import { moveSurface } from "../navigation/surface-motion.ts";
import { positionClear } from "../navigation/collision.ts";
export { TICKS_PER_DAY, LIMIT, NEST, BOUNDS, createNest, nestPath };
export function hashSeed(value) {
  let h = 2166136261;
  for (const c of String(value)) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
export class World {
  constructor(seed = "SEMENTE-42", parameters = {}) {
    this.seed = String(seed);
    this.rng = hashSeed(seed);
    this.params = { humidity: 58, light: 72, randomness: 28, ...parameters };
    this.tick = 0;
    this.nextId = 1;
    this.food = 18;
    this.queenHealth = 100;
    this.ants = [];
    this.brood = [];
    this.predators = [];
    this.plants = [];
    this.patches = [];
    this.nest = createNest();
    this.physicsVersion = 3;
    this.events = [];
    this.history = [];
    this.deaths = 0;
    this.born = 0;
    this.lastLaying = -50;
    this.lastRecord = -25;
    this.lastWarning = -1000;
    this.lastDiscovery = -1000;
    this.pheromones = new Array(40 * 26).fill(0);
    this.ants.push(this.makeAnt("queen", NEST.x, NEST.z));
    Object.assign(this.ants[0], this.nest.nodes[2], { kind: "queen", node: 2 });
    this.ants[0].x -= 0.34;
    this.ants[0].z -= 0.33;
    this.ants[0].tunnelY = this.nest.nodes[2].y;
    this.ants[0].y =
      tunnelEnvelope(
        this.nest,
        this.ants[0].x,
        this.ants[0].z,
        this.ants[0].tunnelY,
      ).floor + 0.008;
    this.ants.push(this.makeAnt("male", NEST.x + 0.8, NEST.z + 0.3));
    for (let i = 0; i < 32; i++) {
      let x = this.range(-8.7, 8.7),
        z = this.range(-5.2, 5.2);
      if (distance({ x, z }, NEST) < 1.6 || this.inPond(x, z)) {
        i--;
        continue;
      }
      this.plants.push({
        id: this.nextId++,
        x,
        z,
        biomass: this.range(0.45, 1),
        kind: i % 4,
      });
    }
    for (let i = 0; i < 12; i++) {
      const plant = this.plants[(i * 2 + 1) % this.plants.length];
      this.patches.push({
        id: this.nextId++,
        x: plant.x + 0.25,
        z: plant.z + 0.2,
        amount: this.range(1, 3.5),
        capacity: 4,
        discovered: false,
      });
    }
    this.addPredator(6, 3.5, false);
    this.addPredator(4.5, -4, false);
    this.log("Uma rainha e um macho. O começo de uma colônia.", "birth");
    this.record();
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
    return ((x - 4.3) / 1.9) ** 2 + ((z + 2.5) / 1.35) ** 2 < 1;
  }
  makeAnt(kind, x, z) {
    return {
      id: this.nextId++,
      kind,
      x,
      y: 0,
      z,
      distanceWalked: 0,
      angle: this.range(0, Math.PI * 2),
      energy: 100,
      age: 0,
      carrying: 0,
      speed: this.range(0.07, 0.105),
      state: kind === "queen" ? "Fundando o ninho" : "Explorando",
      rest: 0,
    };
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
      population: this.population,
      brood: this.brood.length,
      food: this.food,
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
      });
      this.patches.push({
        id: this.nextId++,
        x: x + 0.25,
        z: z + 0.2,
        amount: 0.25,
        capacity: 3,
        discovered: false,
      });
      this.log("Uma nova planta começa a crescer.", "plant");
    } else if (type === "predator") {
      if (distance({ x, z }, NEST) < 2) {
        this.log(
          "O ninho oferece abrigo. Coloque o predador mais longe.",
          "info",
        );
        return false;
      }
      return this.addPredator(x, z);
    } else if (type === "rain") {
      this.params.humidity = clamp(this.params.humidity + 12, 0, 100);
      this.log("Chuva: a umidade do terrário aumentou.", "rain");
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
    const suitability = updateEnvironment(this);
    const dead = updateWorkers(this, suitability);
    updatePredators(this, dead);
    this.ants = this.ants.filter((a) => !dead.has(a.id));
    if (this.food < 1 && this.tick - this.lastWarning > 200) {
      this.lastWarning = this.tick;
      this.log(
        "A reserva está baixa. A colônia precisa de alimento.",
        "danger",
      );
    }
    if (this.tick - this.lastRecord >= 25) this.record();
  }
  lifeLimit(ant) {
    return 70 + (ant.id % 37);
  }
  snapshot() {
    return JSON.parse(JSON.stringify(this));
  }
  static restore(snapshot) {
    const world = Object.create(World.prototype);
    Object.assign(world, JSON.parse(JSON.stringify(snapshot)));
    if (!world.nest || world.nest.revision < 2) {
      world.nest = createNest();
      const q = world.ants.find((a) => a.kind === "queen");
      if (q) Object.assign(q, world.nest.nodes[2], { node: 2 });
    }
    for (const ant of world.ants) {
      if (ant.y === undefined) {
        ant.y = 0;
        if (ant.kind === "queen")
          Object.assign(ant, world.nest.nodes[2], { node: 2 });
      }
    }
    if (world.physicsVersion !== 3) {
      const queen = world.ants.find((a) => a.kind === "queen");
      if (queen) {
        queen.x = world.nest.nodes[2].x - 0.34;
        queen.z = world.nest.nodes[2].z - 0.33;
        queen.tunnelY = world.nest.nodes[2].y;
      }
      for (const ant of world.ants)
        if (ant.y < -0.1) {
          ant.tunnelY = world.nest.nodes[ant.node]?.y ?? ant.y;
          ant.tunnelCenter = null;
          ant.y =
            tunnelEnvelope(world.nest, ant.x, ant.z, ant.tunnelY).floor + 0.008;
          ant.normal = { x: 0, y: 1, z: 0 };
        }
      world.physicsVersion = 3;
    }
    return world;
  }
}
export function forecast(snapshot, runs = 18, days = 3) {
  const values = [];
  for (let i = 0; i < runs; i++) {
    const w = World.restore(snapshot);
    w.rng = hashSeed(snapshot.seed + ":forecast:" + snapshot.tick + ":" + i);
    w.params.humidity = clamp(w.params.humidity + w.range(-3, 3), 0, 100);
    w.params.light = clamp(w.params.light + w.range(-3, 3), 0, 100);
    w.step(Math.round(days * TICKS_PER_DAY));
    values.push(w.population);
  }
  values.sort((a, b) => a - b);
  return {
    low: values[Math.floor((runs - 1) * 0.1)],
    high: values[Math.ceil((runs - 1) * 0.9)],
    median: values[Math.floor(runs / 2)],
    runs,
    days,
    tick: snapshot.tick,
    values,
  };
}
