import { test } from "node:test";
import assert from "node:assert/strict";
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  renameSync,
  symlinkSync,
  unlinkSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { releaseFixture } from "./fixtures/public-release.mjs";
import { installRelease, within } from "../scripts/lib/release-files.ts";
import { updateReleaseIndex } from "../scripts/lib/release-index.ts";
const script = resolve("scripts/mirror-static-build.ts");

test("the supported dist adapter copies exact release bytes and retains prior versions across builds", () => {
  const f = releaseFixture();
  installRelease(f.build, f.mirror, "0.30.0", f.sha);
  updateReleaseIndex(f.mirror);
  const first = JSON.parse(
    execFileSync(process.execPath, [script], {
      cwd: f.mirror,
      encoding: "utf8",
    }),
  );
  assert.equal(first.staticDirectory, "dist");
  const old = join(f.mirror, "dist", "releases", "v0.30.0", "assets", "app.js");
  assert.deepEqual(
    readFileSync(old),
    readFileSync(join(f.build, "assets", "app.js")),
  );
  installRelease(f.build, f.mirror, "0.30.1", "b".repeat(40));
  updateReleaseIndex(f.mirror);
  execFileSync(process.execPath, [script], { cwd: f.mirror });
  assert.deepEqual(
    readFileSync(old),
    readFileSync(join(f.build, "assets", "app.js")),
  );
  assert.equal(
    existsSync(join(f.mirror, "dist", "releases", "v0.30.1", "release.json")),
    true,
  );
});
test("the adapter rejects private working directories, output junctions and unknown stale output files", () => {
  const f = releaseFixture();
  assert.notEqual(
    spawnSync(process.execPath, [script], { cwd: f.root }).status,
    0,
  );
  assert.equal(existsSync(join(f.root, "dist")), false);
  installRelease(f.build, f.mirror, "0.30.0", f.sha);
  updateReleaseIndex(f.mirror);
  const outside = join(f.root, "outside"),
    out = join(f.mirror, "dist");
  mkdirSync(outside);
  symlinkSync(outside, out, process.platform === "win32" ? "junction" : "dir");
  try {
    assert.notEqual(
      spawnSync(process.execPath, [script], { cwd: f.mirror }).status,
      0,
    );
    assert.equal(existsSync(join(outside, "index.html")), false);
  } finally {
    unlinkSync(out);
  }
  mkdirSync(out);
  writeFileSync(join(out, "private.txt"), "preserve");
  assert.notEqual(
    spawnSync(process.execPath, [script], { cwd: f.mirror }).status,
    0,
  );
  assert.equal(readFileSync(join(out, "private.txt"), "utf8"), "preserve");
});
test("removing a whole old release cannot silently erase its existing catalog entry", () => {
  const f = releaseFixture();
  installRelease(f.build, f.mirror, "0.30.0", f.sha);
  installRelease(f.build, f.mirror, "0.30.1", "b".repeat(40));
  updateReleaseIndex(f.mirror);
  const index = readFileSync(join(f.mirror, "public", "index.html")),
    moved = within(f.root, join(f.root, "preserved-old-release"));
  within(f.root, f.release);
  renameSync(f.release, moved);
  assert.throws(() => updateReleaseIndex(f.mirror), /removida ou substituída/);
  assert.deepEqual(readFileSync(join(f.mirror, "public", "index.html")), index);
});
