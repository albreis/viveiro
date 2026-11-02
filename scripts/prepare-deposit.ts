import { resolve } from "node:path";
import { writeFileSync } from "node:fs";
import { prepareDeposit, archiveDeposit } from "./lib/deposit-source.ts";

const root = process.cwd();
const prepared = prepareDeposit(root, resolve(root, ".runtime", "deposits"));
const archive = archiveDeposit(root, prepared.folder, prepared.manifest);
writeFileSync(archive.output + ".sha256", archive.sha256 + "\n", {
  flag: "wx",
});
console.log(
  JSON.stringify(
    {
      ...archive,
      sourceSha: prepared.manifest.sourceSha,
      files: Object.keys(prepared.manifest.files).length,
      published: false,
    },
    null,
    2,
  ),
);
