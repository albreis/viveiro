export interface PredatorMemory {
  version: 1;
  anchor: { x: number; z: number; tick: number };
  visit?: { plant: number; since: number };
  avoid?: { plant: number; until: number };
  escape?: { angle: number; until: number };
}
export interface MovingPredator {
  id: number;
  x: number;
  z: number;
  angle: number;
  cooldown: number;
  avoidTicks?: number;
  state?: string;
  predatorMemory?: PredatorMemory;
}
