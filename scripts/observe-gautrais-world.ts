import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prepareDigAccess } from "../src/modules/benchmarks/dig-access.ts";
import { sampleWorldSection } from "../src/modules/benchmarks/gautrais/observation/world-section.ts";
import {
  observePhysicalNetwork,
  NETWORK_OBSERVER_ID,
} from "../src/modules/benchmarks/gautrais/observation/measure.ts";
import { readSweepJson } from "./lib/sweep-files.ts";
import { plainParents } from "./lib/release-files.ts";
import { modelSourceFingerprint } from "./lib/source-fingerprint.ts";
import { sectionSvg } from "./lib/gautrais-section-svg.ts";

try {
  const args = process.argv.slice(2);
  if (args.length !== 4 || args[0] !== "--plan" || args[2] !== "--output")
    throw Error(
      "Usage: node scripts/observe-gautrais-world.ts --plan PLAN.json --output NEW-FOLDER",
    );
  const raw = readSweepJson(args[1]) as Record<string, unknown>;
  if (
    Object.keys(raw).sort().join(",") !==
      "groups,pitches,sampleEvery,seed,sectionsY,ticks" ||
    typeof raw.seed !== "string" ||
    !/^[A-Z0-9-]{1,64}$/.test(raw.seed) ||
    !Number.isInteger(raw.ticks) ||
    Number(raw.ticks) < 1 ||
    Number(raw.ticks) > 1000 ||
    !Number.isInteger(raw.sampleEvery) ||
    Number(raw.sampleEvery) < 1 ||
    Number(raw.ticks) % Number(raw.sampleEvery) !== 0
  )
    throw Error("Invalid bounded observation plan");
  const groups = raw.groups as number[],
    pitches = raw.pitches as number[],
    sectionsY = raw.sectionsY as number[];
  const validList = (v: unknown): v is number[] =>
    Array.isArray(v) &&
    v.length > 0 &&
    v.length <= 3 &&
    new Set(v).size === v.length &&
    v.every((x) => typeof x === "number" && Number.isFinite(x));
  if (
    !validList(groups) ||
    !groups.every((n) => [50, 100, 200].includes(n)) ||
    !validList(pitches) ||
    !pitches.every((p) => [0.2, 0.25, 0.5].includes(p)) ||
    !validList(sectionsY) ||
    !sectionsY.every((y) => y < 0 && y > -4.2)
  )
    throw Error("Invalid observation groups/sections/pitches");
  const output = resolve(args[3]);
  plainParents(output);
  if (existsSync(output)) throw Error("Observation output already exists");
  const checkout = fileURLToPath(new URL("..", import.meta.url));
  const git = (...args: string[]) =>
    execFileSync("git", args, {
      cwd: checkout,
      encoding: "utf8",
      windowsHide: true,
    }).trim();
  if (git("status", "--porcelain", "--untracked-files=normal"))
    throw Error("Commit source before observation");
  const sourceSha = git("rev-parse", "HEAD"),
    sourceFingerprint = modelSourceFingerprint(checkout),
    results = [];
  mkdirSync(dirname(output), { recursive: true });
  mkdirSync(output);
  for (const workers of groups) {
    const world = prepareDigAccess({
      seed: raw.seed,
      workers,
      profileVersion: 3,
    });
    const samples = [];
    for (let tick = 0; tick <= Number(raw.ticks); tick++) {
      if (tick > 0) {
        world.predators = [];
        world.step();
      }
      if (tick % Number(raw.sampleEvery) !== 0) continue;
      const observations = [];
      for (const y of sectionsY)
        for (const pitch of pitches) {
          const section = {
            y,
            minX: -10,
            maxX: 10,
            minZ: -6.5,
            maxZ: 6.5,
            pitch,
          };
          const before = JSON.stringify(world.snapshot()),
            mask = sampleWorldSection(world.nest, section),
            observed = observePhysicalNetwork(mask);
          if (JSON.stringify(world.snapshot()) !== before)
            throw Error("Observer mutated World");
          const image =
            "workers-" +
            workers +
            "-tick-" +
            tick +
            "-y-" +
            y +
            "-pitch-" +
            pitch +
            ".svg";
          writeFileSync(join(output, image), sectionSvg(mask, observed.graph), {
            flag: "wx",
          });
          observations.push({
            section,
            metrics: observed.metrics,
            physicalTopology: observed.physicalTopology,
            image,
          });
        }
      samples.push({
        tick: world.tick,
        population: world.ants.length,
        observations,
      });
    }
    results.push({ workers, samples });
  }
  const report = {
    schema: "viveiro-gautrais-world-observation-v1",
    operator: NETWORK_OBSERVER_ID,
    sourceSha,
    sourceFingerprint,
    node: process.version,
    plan: raw,
    engine: "World.step",
    biologicalProfile: "messor-narbonne@3",
    spaceUnit: "model-unit",
    timeUnit: "model-tick",
    initialState: "prepared mature procedural nest",
    physicalProtocolCompatible: false,
    reservedMetricsComputed: false,
    modelRulesChanged: false,
    g3: {
      ready: false,
      reasons: [
        "Experimental sand disk and blank initial substrate are not configured.",
        "Model ticks are not physical seconds; biological and movement clocks remain coupled.",
        "Model length/volume and soil transport must be reconciled before physical evaluation.",
      ],
    },
    metricConvention:
      "Degree-2-normalized topological network; not unmodified paper chamber/node counts.",
    results,
  };
  writeFileSync(
    join(output, "world-observation.json"),
    JSON.stringify(report, null, 2) + "\n",
    { flag: "wx" },
  );
  console.log(
    JSON.stringify({
      output,
      groups: results.length,
      physicalProtocolCompatible: false,
      reservedMetricsComputed: false,
    }),
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
