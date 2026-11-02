import { modelMath } from "../../libs/model-math.ts";
import type {
  AgentState,
  NavigationWorld,
  NavigationState,
  Vec3,
} from "./types.ts";
interface NeighborIndex {
  tick: number;
  cells: Map<string, AgentState[]>;
  queries: Map<string, AgentState[]>;
}
const indexes = new WeakMap<NavigationWorld, NeighborIndex>();
const CELL = 0.8;
const key = (x: number, y: number, z: number) => x + ":" + y + ":" + z;

export function neighborsOf(
  world: NavigationWorld,
  agent: AgentState,
  radius = 1.2,
): AgentState[] {
  let index = indexes.get(world);
  if (!index || index.tick !== world.tick) {
    index = { tick: world.tick, cells: new Map(), queries: new Map() };
    for (const ant of world.neighborAgents || world.ants) {
      const cell = key(
        Math.floor(ant.x / CELL),
        Math.floor((ant.y || 0) / CELL),
        Math.floor(ant.z / CELL),
      );
      if (!index.cells.has(cell)) index.cells.set(cell, []);
      index.cells.get(cell)!.push(ant);
    }
    indexes.set(world, index);
  }
  const queryKey = agent.id + ":" + radius;
  if (index.queries.has(queryKey)) return index.queries.get(queryKey)!;
  const result: AgentState[] = [],
    span = Math.ceil(radius / CELL);
  const cx = Math.floor(agent.x / CELL),
    cy = Math.floor((agent.y || 0) / CELL),
    cz = Math.floor(agent.z / CELL);
  for (let y = cy - span; y <= cy + span; y++) {
    for (let z = cz - span; z <= cz + span; z++) {
      for (let x = cx - span; x <= cx + span; x++) {
        for (const other of index.cells.get(key(x, y, z)) || []) {
          if (other.id === agent.id) continue;
          if (
            modelMath.hypot(
              other.x - agent.x,
              (other.y || 0) - (agent.y || 0),
              other.z - agent.z,
            ) <= radius
          ) {
            result.push(other);
          }
        }
      }
    }
  }
  index.queries.set(queryKey, result);
  return result;
}

export function invalidateNeighbors(world: NavigationWorld) {
  indexes.delete(world);
}
