import { modelMath } from "../../libs/model-math.ts";
import type { NestState } from "../navigation/types.ts";
export interface NestOdors {
  fields: Record<string, number[]>;
  initial: number;
  emitted: number;
  evaporated: number;
}
interface Graph {
  revision: number;
  volumes: number[];
  edges: { a: number; b: number; g: number }[];
  sources: Record<string, number[]>;
}
const graphs = new WeakMap<NestState, Graph>();
const LANDMARKS = ["entrance", "storage", "nursery", "waste", "royal", "front"];
function graph(nest: NestState): Graph {
  const cached = graphs.get(nest);
  if (cached?.revision === nest.revision) return cached;
  const volumes = nest.nodes.map((n) =>
    Math.max(0.03, (4 / 3) * Math.PI * modelMath.pow(n.r, 3)),
  );
  const edges = nest.links.map(([a, b], i) => ({
    a,
    b,
    g:
      (0.03 * Math.PI * modelMath.pow(nest.linkWidths?.[i] || 0.38, 2)) /
      Math.max(
        0.3,
        modelMath.hypot(
          nest.nodes[a].x - nest.nodes[b].x,
          nest.nodes[a].y - nest.nodes[b].y,
          nest.nodes[a].z - nest.nodes[b].z,
        ),
      ),
  }));
  const sources: Record<string, number[]> = {};
  nest.nodes.forEach((n, i) => {
    if (LANDMARKS.includes(n.type)) {
      const key = (n.colonyId || 1) + ":" + n.type;
      (sources[key] ??= []).push(i);
    }
  });
  const result = { revision: nest.revision, volumes, edges, sources };
  graphs.set(nest, result);
  return result;
}
export function createNestOdors(nest: NestState): NestOdors {
  const g = graph(nest),
    fields: Record<string, number[]> = {};
  for (const [key, source] of Object.entries(g.sources)) {
    const fixed = new Set(source),
      c: number[] = nest.nodes.map((_, i) => (fixed.has(i) ? 1 : 0));
    for (let k = 0; k < 200; k++)
      for (let i = 0; i < c.length; i++)
        if (!fixed.has(i)) {
          let sum = 0,
            rate = 0;
          for (const e of g.edges) {
            const j = e.a === i ? e.b : e.b === i ? e.a : -1;
            if (j >= 0) {
              sum += e.g * c[j];
              rate += e.g;
            }
          }
          c[i] = sum / (rate + 0.002 * g.volumes[i] || 1);
        }
    fields[key] = c.map((v, i) => v * g.volumes[i]);
  }
  return {
    fields,
    initial: Object.values(fields)
      .flat()
      .reduce((n, v) => n + v, 0),
    emitted: 0,
    evaporated: 0,
  };
}
export function updateNestOdors(nest: NestState, state: NestOdors, dt = 1) {
  const g = graph(nest),
    degree = nest.nodes.map(() => 0);
  for (const e of g.edges) {
    degree[e.a] += e.g / g.volumes[e.a];
    degree[e.b] += e.g / g.volumes[e.b];
  }
  const steps = Math.max(1, Math.ceil((Math.max(...degree, 0) * dt) / 0.8)),
    step = dt / steps,
    decay = modelMath.exp(-0.002 * step);
  for (const key of Object.keys(g.sources))
    state.fields[key] ??= nest.nodes.map(() => 0);
  for (const [key, mass] of Object.entries(state.fields)) {
    while (mass.length < nest.nodes.length) mass.push(0);
    for (let n = 0; n < steps; n++) {
      const next = mass.slice();
      for (const e of g.edges) {
        const flux =
          e.g *
          step *
          (mass[e.a] / g.volumes[e.a] - mass[e.b] / g.volumes[e.b]);
        next[e.a] -= flux;
        next[e.b] += flux;
      }
      for (let i = 0; i < mass.length; i++) {
        const value = Math.max(0, next[i]);
        mass[i] = value * decay;
        state.evaporated += value - mass[i];
      }
    }
    for (const i of g.sources[key] || []) {
      const added = Math.max(0, g.volumes[i] - mass[i]);
      mass[i] += added;
      state.emitted += added;
    }
  }
}
export function routeOdorSignal(
  nest: NestState,
  state: NestOdors,
  from: number,
  to: number,
  key: string,
  range = 0.6,
) {
  const mass = state.fields[key];
  if (!mass) return 0;
  const g = graph(nest),
    a = nest.nodes[from],
    b = nest.nodes[to];
  const length = modelMath.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
  return (
    ((mass[to] || 0) / g.volumes[to] - (mass[from] || 0) / g.volumes[from]) *
    Math.min(1, range / Math.max(0.1, length))
  );
}
