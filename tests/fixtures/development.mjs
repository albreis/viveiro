import { World } from "../../src/modules/simulation/world.js";
import { profileReference } from "../../src/modules/biology/catalog.ts";
import { makeBrood } from "../../src/modules/colony/brood.ts";
import { ensureSoilClimate } from "../../src/modules/microclimate/initialize.ts";
export function developmentFixture(temperature = 25, water = 0.55) {
  const w = new World(
    "development-fixture",
    { temperatureC: temperature },
    { founding: false, biologicalProfile: profileReference("generic-demo", 4) },
  );
  const soil = ensureSoilClimate(w);
  soil.temperature.fill(temperature);
  soil.water.fill(water * soil.capacity);
  const b = makeBrood(w, w.nextId++, 2);
  w.brood = [b];
  return { w, b, soil };
}
