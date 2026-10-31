import type { Landscape, Plant } from "./types.ts";
import { SPECIES, speciesOf } from "./species.ts";
import { waterLevel } from "./queries.ts";
const clamp = (x: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));
interface EnvironmentWorld {
  params: { humidity: number; light: number };
  landscape: Landscape;
  plants: Plant[];
  patches: {
    amount: number;
    capacity: number;
    supplemental?: boolean;
    sourcePlant?: number;
    x: number;
    z: number;
  }[];
}
/** Tick-based exploratory ecology; no claim of calibrated botany or hydrology. */
export function updateLandscape(w: EnvironmentWorld) {
  const land = w.landscape,
    h = w.params.humidity / 100,
    light = w.params.light / 100;
  land.wetness += (h - land.wetness) * 0.003;
  land.rainPulse *= 0.98;
  for (const pond of land.ponds) {
    const evaporation = (1 - h) * (0.00008 + light * 0.0002);
    pond.volume = clamp(
      pond.volume +
        land.rainPulse * 0.002 +
        Math.max(0, h - 0.78) * 0.0008 -
        evaporation,
    );
  }
  for (const log of land.logs) {
    log.moisture += (land.wetness - log.moisture) * 0.004;
    const decomposition =
      (0.000001 + log.moisture * 0.000006) * (0.65 + light * 0.35);
    log.decay = clamp(log.decay + decomposition);
    log.integrity = 1 - log.decay * 0.75;
  }
  for (const rock of land.rocks) {
    rock.wetness += (land.wetness - rock.wetness) * 0.012;
    rock.moss = clamp(rock.moss + (h * 0.8 - light * 0.45 - 0.15) * 0.00006);
  }
  let shed = 0;
  const yields = new Map<number, number>();
  for (const p of w.plants) {
    const profile = SPECIES[speciesOf(p)],
      nearWater = waterLevel(land, p.x, p.z) < 3;
    const moisture = clamp(land.wetness + (nearWater ? 0.12 : 0));
    p.hydration =
      (p.hydration ?? moisture) +
      (moisture - (p.hydration ?? moisture)) * 0.006;
    const waterStress =
      Math.abs(p.hydration - profile.humidity) / profile.tolerance;
    const lightStress = Math.abs(light - profile.light) / 0.7;
    const fit = clamp(1 - waterStress * 0.8 - lightStress * 0.45);
    p.stress = clamp(waterStress * 0.65 + lightStress * 0.35);
    p.health = clamp((p.health ?? 1) + (fit - 0.42) * 0.0007, 0, 1);
    const previous = p.biomass;
    p.biomass = clamp(
      p.biomass +
        (0.0012 * fit * (p.vigor ?? 1) * p.health - 0.00032 * (1 + p.stress)) *
          (1.15 - p.biomass),
      0.025,
      1.1,
    );
    shed += Math.max(0, previous - p.biomass);
    yields.set(p.id, profile.yield * fit * p.health * p.biomass);
  }
  land.litter = clamp(land.litter + shed * 0.02 - land.wetness * 0.000015);
  for (const patch of w.patches)
    if (!patch.supplemental) {
      const output = patch.sourcePlant
        ? (yields.get(patch.sourcePlant) ?? 0)
        : light * clamp(1 - Math.abs(h - 0.62) * 1.7);
      patch.amount = clamp(
        patch.amount + output * 0.003 - (output < 0.1 ? 0.00015 : 0),
        0,
        patch.capacity,
      );
    }
}
