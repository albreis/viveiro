import type { FamilyWorld as importFamilyWorld } from "../colonies/types.ts";
import type { Vector3 } from "three";
/** Presentation-only subset shared by ants and predators. */
export interface RenderAgent {
  id: number;
  x: number;
  y?: number;
  z: number;
  angle: number;
  pitch?: number;
  normal?: { x: number; y: number; z: number };
  previousX?: number;
  previousY?: number;
  previousZ?: number;
  previousAngle?: number;
  previousDistance?: number;
  distanceWalked?: number;
  bodyScale?: number;
  headScale?: number;
  state?: string;
}
export type SceneView =
  boolean | "side" | "brood" | "structure" | "sealing" | "ecology";
export interface PreviousView {
  position: Vector3;
  target: Vector3;
}
export interface PointerPosition {
  clientX: number;
  clientY: number;
}

/** Existing biological contracts, with the read-only aggregates used by the view. */
export interface RenderWorld extends importFamilyWorld {
  readonly day: number;
  readonly workers: import("../colony/types.ts").ColonyAgent[];
  predators: (RenderAgent & { energy: number })[];
  foundings?: { state: import("../founding/types.ts").FoundingState }[];
  params: importFamilyWorld["params"] & {
    randomness: number;
    windX?: number;
    windZ?: number;
  };
}
