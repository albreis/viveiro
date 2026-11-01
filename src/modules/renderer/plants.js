import * as THREE from "three";
import { speciesOf } from "../landscape/species.ts";
import { surfaceHeight } from "../landscape/queries.ts";
import { buildPlantShape } from "./plant-shapes.js";
const colors = {
  fern: "#557a41",
  shrub: "#6c8844",
  tree: "#4c703d",
  grass: "#849552",
  cactus: "#6c9672",
  succulent: "#8fa784",
  flower: "#658145",
  moss: "#567741",
};
export function buildPlant(host, plant) {
  const g = new THREE.Group(),
    type = speciesOf(plant);
  g.position.set(
    plant.x,
    surfaceHeight(host.world.nest.relief, plant.x, plant.z),
    plant.z,
  );
  const leaf = host.material(colors[type]),
    stem = host.material("#7b7650");
  buildPlantShape(host, g, type, leaf, stem, plant.id);
  g.userData.leaf = leaf;
  g.userData.healthy = new THREE.Color(colors[type]);
  g.userData.dry = new THREE.Color("#9a8452");
  host.plantGroup.add(g);
  return g;
}
export function updatePlant(g, plant, time) {
  const health = plant.health ?? 1,
    stress = plant.stress ?? 0;
  g.scale.setScalar(0.35 + plant.biomass * 0.85);
  g.rotation.z = Math.sin(time * 0.7 + plant.id) * 0.012 + (1 - health) * 0.18;
  g.userData.leaf.color
    .copy(g.userData.healthy)
    .lerp(g.userData.dry, Math.min(1, (1 - health) * 0.8 + stress * 0.25));
}
