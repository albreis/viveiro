import { allAnts } from "../colonies/types.ts";
import { World } from "./world.js";
import { hashSeed } from "./seed.ts";
import { TICKS_PER_DAY } from "./constants.js";
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export function forecast(snapshot, runs = 18, days = 3) {
  const values = [];
  for (let i = 0; i < runs; i++) {
    const w = World.restore(snapshot);
    w.rng = hashSeed(snapshot.seed + ":forecast:" + snapshot.tick + ":" + i);
    w.params.humidity = clamp(w.params.humidity + w.range(-3, 3), 0, 100);
    w.params.light = clamp(w.params.light + w.range(-3, 3), 0, 100);
    w.step(Math.round(days * TICKS_PER_DAY));
    values.push(allAnts(w).length);
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
