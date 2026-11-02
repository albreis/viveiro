import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { runExperimentProcess } from "../scripts/lib/experiment-process.ts";
import metadata from "../package.json" with { type: "json" };
const hash = (s) => createHash("sha256").update(s).digest("hex");
for (const name of ["regression-01", "soil-02", "found-03", "workers-04"])
  test(
    "paridade: replay Node corresponde à captura REAL do navegador " + name,
    async () => {
      const folder = "tests/fixtures/cli-portable-040/" + name + "/";
      const p = JSON.parse(readFileSync(folder + "plan.json", "utf8"));
      const expectedCsv = readFileSync(folder + "browser.csv", "utf8"),
        expectedManifest = JSON.parse(
          readFileSync(folder + "browser-manifest.json", "utf8"),
        );
      assert.deepEqual(
        readFileSync(folder + "node.csv"),
        readFileSync(folder + "browser.csv"),
      );
      assert.deepEqual(
        readFileSync(folder + "node-manifest.json"),
        readFileSync(folder + "browser-manifest.json"),
      );
      const actual = await runExperimentProcess(p),
        m = JSON.parse(actual.manifest);
      assert.equal(m.arithmetic, "stdlib-f64-v1");
      assert.equal(m.csv.sha256, hash(actual.csv));
      const normalized = actual.csv.replaceAll(
        '"' + metadata.version + '"',
        '"0.40.0"',
      );
      assert.equal(normalized, expectedCsv);
      assert.deepEqual(
        {
          ...m,
          modelVersion: "0.40.0",
          csv: {
            ...m.csv,
            bytes: Buffer.byteLength(normalized),
            sha256: hash(normalized),
          },
        },
        expectedManifest,
      );
    },
  );
