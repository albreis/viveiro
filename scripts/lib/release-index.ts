import { readFileSync, readdirSync, writeFileSync, renameSync } from "node:fs";
import { join } from "node:path";
import {
  compareVersions,
  releaseTag,
  validateReleaseManifest,
} from "../../src/modules/publication/release.ts";
import type { ReleaseManifest } from "../../src/modules/publication/release.ts";
import { publicIndex } from "./public-index.ts";
import { checkRelease, plainParents } from "./release-files.ts";
export function updateReleaseIndex(mirror: string) {
  const root = join(mirror, "public"),
    releases = join(root, "releases");
  plainParents(root);
  const listed = readdirSync(releases, { withFileTypes: true });
  if (listed.some((e) => e.isSymbolicLink() || !e.isDirectory()))
    throw Error("Entrada inesperada no catálogo de releases.");
  const entries = listed
    .map((e) => {
      const dir = join(releases, e.name),
        m = JSON.parse(
          readFileSync(join(dir, "release.json"), "utf8"),
        ) as ReleaseManifest;
      validateReleaseManifest(m);
      if (
        m.format !== "viveiro-release" ||
        releaseTag(m.version) !== m.tag ||
        e.name !== m.tag
      )
        throw Error("Catálogo de releases inconsistente.");
      checkRelease(dir, m);
      return {
        tag: m.tag,
        version: m.version,
        sourceSha: m.sourceSha,
        url: "releases/" + m.tag + "/",
      };
    })
    .sort((a, b) => compareVersions(b.version, a.version));
  if (!entries.length) throw Error("Nenhuma release para publicar.");
  const latest = entries[0],
    catalog = {
      format: "viveiro-release-index",
      version: 1,
      latest: latest.tag,
      releases: entries,
    };
  const html = publicIndex(entries);
  for (const [name, content] of [
    ["index.html", html],
    ["release-index.json", JSON.stringify(catalog, null, 2) + "\n"],
  ]) {
    const temp = join(root, name + ".tmp");
    writeFileSync(temp, content);
    renameSync(temp, join(root, name));
  }
  return catalog;
}
