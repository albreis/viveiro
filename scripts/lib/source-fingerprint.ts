import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";
/** Conservative LF-normalized identity of model modules, libraries, Workers and lockfile. */
export function modelSourceFingerprint(root: string): string {
  const files: string[] = [];
  const scan = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) scan(p);
      else if (/\.(ts|js|json)$/.test(e.name)) files.push(p);
    }
  };
  for (const dir of ["src/modules", "src/libs", "src/workers"])
    scan(join(root, dir));
  files.push(join(root, "package.json"), join(root, "package-lock.json"));
  const entries = files
    .map((p) => [
      relative(root, p).replaceAll("\\", "/"),
      createHash("sha256")
        .update(readFileSync(p, "utf8").replaceAll("\r\n", "\n"))
        .digest("hex"),
    ])
    .sort((a, b) => (a[0] < b[0] ? -1 : 1));
  return createHash("sha256").update(JSON.stringify(entries)).digest("hex");
}
