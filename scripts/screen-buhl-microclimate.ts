import assert from "node:assert/strict";
import { join } from "node:path";
import { normalizeBuhlLabPlan } from "../src/modules/benchmarks/buhl-arena/settings.ts";
import { buhlLabJson, runBuhlLabJobs } from "./lib/buhl-lab-jobs.ts";
import { readBuhlLabOptions } from "./lib/buhl-lab-options.ts";
import { immutableSweepFile } from "./lib/sweep-files.ts";

const command = readBuhlLabOptions("scripts/screen-buhl-microclimate.ts");
if (command) {
  const { settings, seeds, conditions, arms } = command.input as {
    settings: Record<string, unknown> & { microclimate: object };
    seeds: string[];
    conditions: Record<string, object>;
    arms: ("control" | "action-recovery")[];
  };
  const cases = Object.entries(conditions).flatMap(
    ([condition, microclimate]) =>
      seeds.flatMap((seed) =>
        arms.map((arm) => ({
          condition,
          arm,
          plan: normalizeBuhlLabPlan({
            ...settings,
            seed,
            ...(arm === "control" ? {} : { digFatigue: arm }),
            microclimate: { ...settings.microclimate, ...microclimate },
          }),
        })),
      ),
  );
  const controller = new AbortController();
  const stop = () => controller.abort();
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  try {
    const result = await runBuhlLabJobs(
      cases.map(({ plan }) => plan),
      command.options,
      controller.signal,
      (folder, sourceFingerprint, runs) => {
        const series = runs.map(({ seed, samples }, index) => {
          const { condition, arm } = cases[index];
          for (const sample of samples) {
            assert.equal(
              sample.dugMicrograms,
              sample.carriedMicrograms + sample.depositedMicrograms,
            );
            assert.equal(
              sample.activity!.removedMicrograms,
              sample.dugMicrograms,
            );
          }
          if (condition === "flowWithoutDrying") {
            const reference = cases.findIndex(
              (item) =>
                item.condition === "reference" &&
                item.arm === arm &&
                item.plan.seed === seed,
            );
            assert.deepEqual(runs[index], runs[reference]);
          }
          return {
            seed,
            condition,
            arm,
            samples: samples.map((sample) => ({
              timeSeconds: sample.timeSeconds,
              dugMicrograms: sample.dugMicrograms,
              distanceMm: sample.distanceMm,
              microclimate: sample.microclimate,
              diggingSeconds: sample.activity!.diggingSeconds,
              ...(sample.meanDigReadiness === undefined
                ? {}
                : { meanDigReadiness: sample.meanDigReadiness }),
            })),
          };
        });
        immutableSweepFile(
          join(folder, "triagem.json"),
          buhlLabJson({
            sourceFingerprint,
            runtime: process.version,
            calibrated: false,
            series,
          }),
        );
      },
    );
    process.stdout.write(buhlLabJson(result));
  } finally {
    process.removeListener("SIGINT", stop);
    process.removeListener("SIGTERM", stop);
  }
}
