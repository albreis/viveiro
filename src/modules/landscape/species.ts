import type { Species, Plant } from "./types.ts";
export const SPECIES: Record<
  Species,
  { humidity: number; tolerance: number; light: number; yield: number }
> = {
  fern: { humidity: 0.78, tolerance: 0.34, light: 0.42, yield: 0.8 },
  shrub: { humidity: 0.58, tolerance: 0.46, light: 0.68, yield: 1.1 },
  tree: { humidity: 0.64, tolerance: 0.44, light: 0.76, yield: 1 },
  grass: { humidity: 0.52, tolerance: 0.5, light: 0.8, yield: 0.65 },
  cactus: { humidity: 0.2, tolerance: 0.44, light: 0.94, yield: 0.25 },
  succulent: { humidity: 0.3, tolerance: 0.46, light: 0.82, yield: 0.45 },
  flower: { humidity: 0.56, tolerance: 0.36, light: 0.75, yield: 1.3 },
  moss: { humidity: 0.85, tolerance: 0.3, light: 0.3, yield: 0.2 },
};
export const speciesOf = (p: Plant): Species =>
  p.species ?? (["fern", "shrub", "tree", "grass"] as Species[])[p.kind % 4];
export const biomeName = (name: string) =>
  ({ woodland: "Bosque", scrub: "Vegetação árida", meadow: "Pradaria" })[
    name
  ] ?? "Terrário";
