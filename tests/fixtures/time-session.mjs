import { World } from "./established-world.mjs";
import { captureSession } from "../../src/app/session-models.ts";
export function timeSession(seed = "time-fixture") {
  const world = new World(seed),
    comparison = World.restore(world.snapshot());
  comparison.params.humidity += 1;
  return captureSession({
    world,
    comparison,
    scenario: "b",
    initial: { seed, params: { ...world.params }, startMode: "established" },
    running: false,
    replaying: true,
    replayIndex: 0,
    interventions: [
      { tick: 10, type: "rain" },
      { tick: 70, type: "humidity", x: 0, z: 0, value: 44 },
    ],
    clock: { version: 1, secondsPerDay: 60, speed: 3, pendingTicks: 0.25 },
  });
}
