export interface Hill {
  x: number;
  z: number;
  radius: number;
  height: number;
}
export interface Pond {
  id: number;
  x: number;
  z: number;
  rx: number;
  rz: number;
  angle: number;
  volume: number;
}
export interface Timber {
  id: number;
  x: number;
  z: number;
  length: number;
  radius: number;
  angle: number;
  kind: "fallen" | "forked" | "stump";
  moisture: number;
  integrity: number;
  decay: number;
}
export interface Rock {
  id: number;
  x: number;
  z: number;
  radius: number;
  aspect: number;
  angle: number;
  wetness: number;
  moss: number;
}
export interface Landscape {
  version: number;
  biome: "woodland" | "scrub" | "meadow";
  relief: Hill[];
  ponds: Pond[];
  logs: Timber[];
  rocks: Rock[];
  wetness: number;
  litter: number;
  rainPulse: number;
}
export type Species =
  | "fern"
  | "shrub"
  | "tree"
  | "grass"
  | "cactus"
  | "succulent"
  | "flower"
  | "moss";
export interface Plant {
  id: number;
  x: number;
  z: number;
  kind: number;
  species?: Species;
  biomass: number;
  health?: number;
  hydration?: number;
  stress?: number;
  vigor?: number;
}
