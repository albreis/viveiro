import { modelMath } from "../../libs/model-math.ts";
import type { ClimateWorld, SoilClimate } from "./types.ts";
import { climateCell } from "./grid.ts";
export function climateBoundaries(
  w: ClimateWorld,
  s: SoilClimate,
  dt: number,
  infiltration = 1,
) {
  const h = w.params.humidity / 100,
    light = w.params.light / 100,
    air = w.params.temperatureC ?? 24,
    daylight = Math.max(0, modelMath.sin((w.tick / 100) * 2 * Math.PI)),
    surfaceTarget = air + daylight * light * 8;
  for (let i = 0; i < s.width * s.rows; i++) {
    const rain = Math.max(
      0,
      Math.min(
        s.capacity - s.water[i],
        w.landscape.rainPulse * 0.0003 * dt * s.capacity * infiltration,
      ),
    );
    s.water[i] += rain;
    s.rainIn += rain;
    const evaporation = Math.min(
      s.water[i],
      s.water[i] * 0.0002 * (1 - h) * (1 + light) * dt,
    );
    s.water[i] -= evaporation;
    s.evaporated += evaporation;
    const heat = (surfaceTarget - s.temperature[i]) * Math.min(0.2, 0.003 * dt),
      cooling = evaporation * 0.5;
    s.temperature[i] += heat - cooling;
    s.boundaryHeat += heat;
    s.evaporativeHeat += cooling;
  }
  for (const pond of w.landscape.ponds) {
    const i = climateCell(s, { x: pond.x, y: 0, z: pond.z }),
      amount = Math.max(
        0,
        Math.min(pond.volume * 10, (s.capacity - s.water[i]) * 0.002 * dt),
      );
    s.water[i] += amount;
    pond.volume -= amount / 10;
    s.pondIn += amount;
  }
  for (const plant of w.plants) {
    const i = climateCell(s, { x: plant.x, y: -0.2, z: plant.z }),
      amount = Math.max(
        0,
        Math.min(
          s.water[i],
          plant.biomass * (plant.health ?? 1) * 0.000002 * dt,
        ),
      );
    s.water[i] -= amount;
    s.plantUptake += amount;
  }
}
