import { World } from "../../src/modules/simulation/world.js";
import { profileReference } from "../../src/modules/biology/catalog.ts";
import { ensureSoilClimate } from "../../src/modules/microclimate/initialize.ts";
import { makeBrood } from "../../src/modules/colony/brood.ts";
export function seasonFixture(id = "generic-demo", version = 5) {
  const w = new World(
    "season-fixture",
    { temperatureC: 25, humidity: 68 },
    { founding: false, biologicalProfile: profileReference(id, version) },
  );
  const soil = ensureSoilClimate(w);
  soil.temperature.fill(25);
  soil.water.fill(0.55 * soil.capacity);
  const b = makeBrood(w, w.nextId++, 2);
  w.brood = [b];
  return { w, b, soil };
}
