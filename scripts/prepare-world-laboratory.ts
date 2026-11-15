import { installPortableMath } from "../src/libs/portable-math.ts";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { laboratoryPreparationPlan } from "../src/modules/benchmarks/gautrais/laboratory/plan.ts";
import { prepareLaboratoryWorld } from "../src/modules/benchmarks/gautrais/laboratory/setup.ts";
import { plainParents } from "./lib/release-files.ts";
import { readSweepJson } from "./lib/sweep-files.ts";
import { modelSourceFingerprint } from "./lib/source-fingerprint.ts";
import { laboratorySvg } from "./lib/laboratory-svg.ts";
try {
  const args = process.argv.slice(2);
  if (args.length !== 4 || args[0] !== "--plan" || args[2] !== "--output")
    throw Error(
      "Usage: node scripts/prepare-world-laboratory.ts --plan PLAN.json --output NEW-FOLDER",
    );
  const plan = laboratoryPreparationPlan(readSweepJson(args[1])),
    output = resolve(args[3]);
  plainParents(output);
  if (existsSync(output)) throw Error("Laboratory output already exists");
  const checkout = fileURLToPath(new URL("..", import.meta.url));
  const git = (...a: string[]) =>
    execFileSync("git", a, {
      cwd: checkout,
      encoding: "utf8",
      windowsHide: true,
    }).trim();
  if (git("status", "--porcelain", "--untracked-files=normal"))
    throw Error("Commit source before preparing laboratory");
  const sourceSha = git("rev-parse", "HEAD"),
    sourceFingerprint = modelSourceFingerprint(checkout);
  installPortableMath(); // Dedicated CLI process, before creating any World.
  const results = plan.groups.map((workers) => {
    const { world, report } = prepareLaboratoryWorld({ ...plan, workers });
    const cohort = world.ants.map(
      ({ id, x, y, z, angle, bodyScale, speed, age }) => ({
        id,
        x,
        y,
        z,
        angle,
        bodyScale,
        speed,
        age,
      }),
    );
    return {
      workers,
      report,
      cohort,
      snapshotSha256: createHash("sha256")
        .update(JSON.stringify(world.snapshot()))
        .digest("hex"),
    };
  });
  mkdirSync(dirname(output), { recursive: true });
  mkdirSync(output);
  for (const r of results)
    writeFileSync(
      join(output, "workers-" + r.workers + ".svg"),
      laboratorySvg(r.report.geometry, r.cohort),
      { flag: "wx" },
    );
  const report = {
    schema: "viveiro-world-laboratory-geometry-v1",
    sourceSha,
    sourceFingerprint,
    node: process.version,
    arithmeticPolicy: "stdlib-f64-v1",
    plan,
    physicalProtocolCompatible: false,
    physicalDynamicsIntegrated: false,
    reservedMetricsComputed: false,
    results,
  };
  writeFileSync(
    join(output, "preparation.json"),
    JSON.stringify(report, null, 2) + "\n",
    { flag: "wx" },
  );
  console.log(
    JSON.stringify({
      output,
      groups: results.length,
      physicalDynamicsIntegrated: false,
      reservedMetricsComputed: false,
    }),
  );
} catch (e) {
  console.error(e instanceof Error ? e.message : String(e));
  process.exitCode = 1;
}
