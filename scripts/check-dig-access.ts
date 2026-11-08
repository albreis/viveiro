import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import {
  prepareDigAccess,
  runDigAccess,
} from "../src/modules/benchmarks/dig-access.ts";
import { modelSourceFingerprint } from "./lib/source-fingerprint.ts";

const args = process.argv.slice(2);
const out = resolve(args[0] ?? ".runtime/dig-access-world.json");
const ticks = Number(args[1] ?? 2000);
const seeds = (args[2] ?? "DIG-ACCESS-1,DIG-ACCESS-2").split(",");
if (existsSync(out))
  throw Error("Output already exists; preserve earlier runs");
if (
  !Number.isInteger(ticks) ||
  ticks < 1 ||
  ticks > 10000 ||
  !seeds.length ||
  seeds.length > 10
)
  throw Error(
    "Usage: node scripts/check-dig-access.ts NEW.json [ticks<=10000] [seed1,seed2]",
  );
const fingerprint = modelSourceFingerprint(process.cwd());
const baseCommit = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
const results: (ReturnType<typeof runDigAccess> & {
  initialStateSha256: string;
  wallSeconds: number;
})[] = [];
mkdirSync(dirname(out), { recursive: true });
for (const seed of seeds)
  for (const workers of [50, 100, 200]) {
    let initial = "";
    for (const profileVersion of [2, 3] as const) {
      const options = { seed, workers, profileVersion, ticks };
      const w = prepareDigAccess(options);
      const snapshot = w.snapshot() as Record<string, unknown>;
      delete snapshot.biologicalProfile;
      const hash = createHash("sha256")
        .update(JSON.stringify(snapshot))
        .digest("hex");
      if (initial)
        assert.equal(
          hash,
          initial,
          "Paired arms must start from the same physical state",
        );
      initial = hash;
      const begin = performance.now();
      const result = runDigAccess(options, w);
      results.push({
        ...result,
        initialStateSha256: hash,
        wallSeconds: (performance.now() - begin) / 1000,
      });
      assert.equal(
        modelSourceFingerprint(process.cwd()),
        fingerprint,
        "Sources changed during the experiment",
      );
      writeFileSync(
        out,
        JSON.stringify(
          {
            schema: "viveiro-dig-access-world-v1",
            baseCommit,
            sourceFingerprint: fingerprint,
            node: process.version,
            plannedRuns: seeds.length * 6,
            results,
          },
          null,
          2,
        ) + "\n",
      );
      // Persist measured failures too; never discard an unfavorable run.
      assert.ok(result.maxBalanceError < 1e-8, "Mass balance");
      assert.ok(result.maxStepToSpeed < 1.201, "Bounded movement");
      assert.ok(result.maxSupportGap < 0.05, "Supported underground movement");
      const last = result.samples.at(-1)!;
      console.log(
        JSON.stringify({
          seed,
          workers,
          profileVersion,
          removed: last.removed,
          deposited: last.deposited,
          balance: result.maxBalanceError,
          stepToSpeed: result.maxStepToSpeed,
          supportGap: result.maxSupportGap,
        }),
      );
    }
  }
