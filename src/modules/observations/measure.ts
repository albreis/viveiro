import { broodStage } from "../colony/brood.ts";
import metadata from "../../../package.json" with { type: "json" };
const { version } = metadata;
import type { DailyPoint, ObservationWorld } from "./types.ts";
const finite = (value: number | undefined) =>
  value !== undefined && Number.isFinite(value) ? value : null;
/** Observer only: never initializes physics, draws RNG or advances the clock. */
export function measureDaily(w: ObservationWorld): DailyPoint {
  const colonies = [w, ...(w.colonies || [])];
  const brood = colonies.flatMap((c) => c.brood);
  const temperatures = w.microclimate?.temperature;
  const cells = w.gases?.cells ?? [];
  const volume = cells.reduce((n, c) => n + c.volume, 0);
  const fraction = (key: "oxygen" | "carbon") =>
    volume > 0
      ? finite((100 * cells.reduce((n, c) => n + c[key], 0)) / volume)
      : null;
  return {
    tick: w.tick,
    modelVersion: version,
    population: colonies.reduce((n, c) => n + c.ants.length, 0),
    brood: brood.length,
    eggs: brood.filter((b) => broodStage(b.age) === "egg").length,
    larvae: brood.filter((b) => broodStage(b.age) === "larva").length,
    pupae: brood.filter((b) => broodStage(b.age) === "pupa").length,
    colonies: colonies.length,
    food: colonies.reduce(
      (n, c) => n + c.food + (c.colony.reproductiveFood || 0),
      0,
    ),
    airTemperatureC: finite(w.params.temperatureC),
    soilTemperatureC: temperatures?.length
      ? finite(temperatures.reduce((a, b) => a + b, 0) / temperatures.length)
      : null,
    oxygenPercent: fraction("oxygen"),
    carbonDioxidePercent: fraction("carbon"),
  };
}
