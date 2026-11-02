import { test } from "node:test";
import assert from "node:assert/strict";
import {
  releaseTag,
  releaseBase,
  validAssetPath,
  compareVersions,
  validateReleaseManifest,
} from "../src/modules/publication/release.ts";

test("release identifiers reject traversal, malformed versions, unsafe Windows names and private/source-map files", () => {
  assert.equal(releaseTag("0.30.0"), "v0.30.0");
  assert.equal(releaseBase("0.30.0"), "/releases/v0.30.0/");
  assert.ok(compareVersions("0.10.0", "0.9.9") > 0);
  for (const v of [
    "../0.30.0",
    "v0.30.0",
    "0.30",
    "01.30.0",
    "1.0.0/evil",
    "1e3.0.0",
    "9999999999.0.0",
  ])
    assert.throws(() => releaseTag(v));
  for (const p of [
    "index.html",
    "assets/app-Ab_1.js",
    "benchmarks/previsoes-v1.json",
    "VIVEIRO-LICENSE.txt",
  ])
    assert.equal(validAssetPath(p), true, p);
  for (const p of [
    "../secret.json",
    "/index.html",
    "a/../index.html",
    ".env",
    "a/.env",
    "a//index.html",
    "a\\index.html",
    "assets/app.js.map",
    "CON.txt",
    "aux/app.js",
    "path./app.js",
    "a:foo.js",
  ])
    assert.equal(validAssetPath(p), false, p);
});
test("untrusted release manifests cannot inject HTML, unsafe paths, bogus hashes or omit the application", () => {
  const good = {
    format: "viveiro-release",
    version: "0.30.0",
    tag: "v0.30.0",
    sourceSha: "a".repeat(40),
    files: { "index.html": "b".repeat(64) },
  };
  assert.deepEqual(validateReleaseManifest(good), good);
  for (const bad of [
    { ...good, tag: "v0.31.0" },
    { ...good, sourceSha: "<script>" },
    { ...good, files: {} },
    { ...good, files: { "../private.json": "b".repeat(64) } },
    { ...good, files: { "index.html": "not a hash" } },
    {
      ...good,
      files: { "index.html": "b".repeat(64), "release.json": "b".repeat(64) },
    },
  ])
    assert.throws(() => validateReleaseManifest(bad));
});
