import { mkdirSync, mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
export function releaseFixture() {
  const runtime = resolve(".runtime");
  mkdirSync(runtime, { recursive: true });
  const root = mkdtempSync(join(runtime, "release-test-")),
    build = join(root, "build"),
    mirror = join(root, "mirror");
  mkdirSync(join(build, "assets"), { recursive: true });
  writeFileSync(
    join(build, "index.html"),
    '<html><script src="/releases/v0.30.0/assets/app.js"></script></html>',
  );
  writeFileSync(
    join(build, "assets", "app.js"),
    'console.log("synthetic release")',
  );
  writeFileSync(
    join(build, "VIVEIRO-LICENSE.txt"),
    "Synthetic fixture license",
  );
  return {
    root,
    build,
    mirror,
    sha: "a".repeat(40),
    release: join(mirror, "public", "releases", "v0.30.0"),
  };
}
export const loadManifest = (p) =>
  JSON.parse(readFileSync(join(p, "release.json"), "utf8"));
