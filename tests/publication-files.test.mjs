import { test } from "node:test";
import assert from "node:assert/strict";
import {
  writeFileSync,
  readFileSync,
  mkdirSync,
  existsSync,
  symlinkSync,
  unlinkSync,
} from "node:fs";
import { join } from "node:path";
import { releaseFixture, loadManifest } from "./fixtures/public-release.mjs";
import {
  inventory,
  installRelease,
  checkRelease,
  within,
} from "../scripts/lib/release-files.ts";
import { updateReleaseIndex } from "../scripts/lib/release-index.ts";

test("installing a release binds exact source/hash metadata, preserves bytes and permits only identical retries", () => {
  const f = releaseFixture(),
    m = installRelease(f.build, f.mirror, "0.30.0", f.sha);
  assert.equal(m.sourceSha, f.sha);
  assert.equal(m.tag, "v0.30.0");
  assert.equal(Object.keys(m.files).length, 3);
  assert.deepEqual(
    readFileSync(join(f.release, "assets", "app.js")),
    readFileSync(join(f.build, "assets", "app.js")),
  );
  assert.deepEqual(installRelease(f.build, f.mirror, "0.30.0", f.sha), m);
  checkRelease(f.release, m);
  assert.throws(
    () => installRelease(f.build, f.mirror, "0.30.0", "b".repeat(40)),
    /outro manifesto/,
  );
  writeFileSync(join(f.build, "assets", "app.js"), "changed source");
  assert.throws(
    () => installRelease(f.build, f.mirror, "0.30.0", f.sha),
    /outro manifesto/,
  );
  assert.equal(
    readFileSync(join(f.release, "assets", "app.js"), "utf8"),
    'console.log("synthetic release")',
  );
});
test("new releases preserve older tag paths and the catalog selects semver newest rather than the last build", () => {
  const f = releaseFixture();
  installRelease(f.build, f.mirror, "0.30.0", f.sha);
  const prior = readFileSync(join(f.release, "release.json"));
  installRelease(f.build, f.mirror, "0.31.0", "b".repeat(40));
  installRelease(f.build, f.mirror, "0.9.0", "c".repeat(40));
  const c = updateReleaseIndex(f.mirror);
  assert.equal(c.latest, "v0.31.0");
  assert.equal(c.releases.length, 3);
  assert.equal(c.releases[1].url, "releases/v0.30.0/");
  assert.deepEqual(readFileSync(join(f.release, "release.json")), prior);
  assert.ok(
    readFileSync(join(f.mirror, "public", "index.html"), "utf8").includes(
      'id="latest-release" href="releases/v0.31.0/',
    ),
  );
});
test("tampered, missing and additional installed files block the catalog without rewriting its prior index", () => {
  const f = releaseFixture(),
    m = installRelease(f.build, f.mirror, "0.30.0", f.sha);
  updateReleaseIndex(f.mirror);
  const old = readFileSync(join(f.mirror, "public", "index.html"));
  writeFileSync(join(f.release, "assets", "app.js"), "tampered");
  assert.throws(() => updateReleaseIndex(f.mirror), /alterada/);
  assert.deepEqual(readFileSync(join(f.mirror, "public", "index.html")), old);
  writeFileSync(
    join(f.release, "assets", "app.js"),
    'console.log("synthetic release")',
  );
  writeFileSync(join(f.release, "extra.json"), "{}");
  assert.throws(() => checkRelease(f.release, m), /alterada/);
  unlinkSync(join(f.release, "extra.json"));
  unlinkSync(join(f.release, "assets", "app.js"));
  assert.throws(() => checkRelease(f.release, m), /incompleta/);
});
test("a private or unknown target directory is never converted or overwritten by the exporter", () => {
  const f = releaseFixture();
  mkdirSync(f.mirror);
  writeFileSync(join(f.mirror, "private.txt"), "preserve");
  assert.throws(
    () => installRelease(f.build, f.mirror, "0.30.0", f.sha),
    /não é um espelho/,
  );
  assert.equal(readFileSync(join(f.mirror, "private.txt"), "utf8"), "preserve");
  assert.equal(existsSync(join(f.mirror, "public")), false);
  for (const p of [f.mirror, join(f.mirror, "..", "outside")])
    assert.throws(() => within(f.mirror, p));
});
test("hidden metadata, source maps and synthetic credential patterns prevent export", () => {
  for (const [file, text] of [
    [".env", "synthetic"],
    ["assets/app.js.map", "{}"],
    ["assets/key.js", "sk-proj-" + "z".repeat(40)],
  ]) {
    const f = releaseFixture();
    writeFileSync(join(f.build, file), text);
    assert.throws(() => inventory(f.build));
    assert.equal(existsSync(f.release), false);
  }
});
test("junctions in destination ancestors or installed release roots cannot redirect publication", (t) => {
  const f = releaseFixture(),
    outside = join(f.root, "outside");
  mkdirSync(outside);
  mkdirSync(f.mirror);
  writeFileSync(
    join(f.mirror, "mirror.json"),
    JSON.stringify({ format: "viveiro-public-mirror", version: 1 }),
  );
  const redirected = join(f.mirror, "public");
  try {
    symlinkSync(
      outside,
      redirected,
      process.platform === "win32" ? "junction" : "dir",
    );
  } catch (e) {
    if (e.code === "EPERM") {
      t.skip("Host does not allow link creation");
      return;
    }
    throw e;
  }
  try {
    assert.throws(
      () => installRelease(f.build, f.mirror, "0.30.0", f.sha),
      /Link|links/,
    );
    assert.equal(existsSync(join(outside, "releases")), false);
  } finally {
    unlinkSync(redirected);
  }
  installRelease(f.build, f.mirror, "0.30.0", f.sha);
  const link = join(f.root, "linked-release");
  symlinkSync(
    f.release,
    link,
    process.platform === "win32" ? "junction" : "dir",
  );
  try {
    assert.throws(() => checkRelease(link, loadManifest(f.release)), /Link/);
  } finally {
    unlinkSync(link);
  }
});
