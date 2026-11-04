import { arithmeticPolicy } from "../../src/libs/model-math.ts";
import { lessonWorld } from "../../src/modules/lessons/world.ts";
import { moveSurface } from "../../src/modules/navigation/surface-motion.ts";
import type { NavigationWorld } from "../../src/modules/navigation/types.ts";

const observedMmPerSecond = 15.05;
const warmupTicks = 8;
const measurementTicks = 24;
const workers = 64;
const seed = "BUHL-FREE-1";

export function measureBuhlFreeMotion(mmPerUnit?: number) {
  if (
    mmPerUnit !== undefined &&
    (!Number.isFinite(mmPerUnit) || mmPerUnit <= 0)
  )
    throw Error("A escala em mm/unidade deve ser positiva e finita.");

  // Sample production workers from one declared seed; measure them separately.
  const source = lessonWorld(seed, false, true);
  const speed = Array.from({ length: workers }, () => {
    const ant = source.makeAnt("worker", 0, 0);
    const heading = ant.angle;
    const flat: NavigationWorld = {
      tick: 0,
      food: 0,
      ants: [ant],
      nest: { nodes: [], links: [], revision: 0 },
      range() {
        throw Error("Desvio estocástico inesperado em deslocamento livre.");
      },
      log() {},
      inPond: () => false,
    };
    let start = 0;
    for (let tick = 1; tick <= warmupTicks + measurementTicks; tick++) {
      flat.tick = tick;
      if (!moveSurface(flat, ant, heading, ant.speed))
        throw Error("Bloqueio inesperado no ensaio de deslocamento livre.");
      if (tick === warmupTicks) start = ant.distanceWalked ?? 0;
    }
    return ((ant.distanceWalked ?? 0) - start) / measurementTicks;
  });
  const mean = speed.reduce((sum, value) => sum + value, 0) / workers;
  const sampleSd = Math.sqrt(
    speed.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (workers - 1),
  );
  const candidateSecondsPerTick =
    mmPerUnit === undefined ? null : (mean * mmPerUnit) / observedMmPerSecond;
  if (
    candidateSecondsPerTick !== null &&
    (!Number.isFinite(candidateSecondsPerTick) || candidateSecondsPerTick <= 0)
  )
    throw Error("A escala não produz um intervalo numérico válido.");
  return {
    schema: "viveiro-buhl-deslocamento-livre-v1",
    calibrated: false,
    seed,
    arithmetic: arithmeticPolicy(),
    workers,
    warmupTicks,
    measurementTicks,
    speedModelUnitsPerTick: { mean, sampleSd, individual: speed },
    observed: {
      source: "Buhl et al. (2005), doi:10.1007/s00265-004-0906-2",
      meanMmPerSecond: observedMmPerSecond,
      sdMmPerSecond: 4.38,
      n: 100,
    },
    candidateMmPerUnit: mmPerUnit ?? null,
    candidateSecondsPerTick,
  };
}
