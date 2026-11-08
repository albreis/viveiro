import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, copyFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  prepareDeposit,
  archiveDeposit,
} from "../scripts/lib/deposit-source.ts";
import { verifyDepositZip } from "../scripts/lib/deposit-verify.ts";

test("o pacote real é reproduzível e qualquer arquivo extra, ausente ou alterado é rejeitado", () => {
  const checkout = resolve("."),
    output = resolve(".runtime/deposits");
  mkdirSync(output, { recursive: true });
  const root = mkdtempSync(join(output, "repository-"));
  // Test the current source before publication. The tag exists only inside this
  // isolated fixture; no ref or remote in the working repository is changed.
  const git = (...args) => execFileSync("git", args, { windowsHide: true });
  git(
    "clone",
    "--shared",
    "--no-checkout",
    "--single-branch",
    "--no-tags",
    checkout,
    root,
  );
  for (const file of ["CITATION.cff", ".zenodo.json"])
    copyFileSync(join(checkout, file), join(root, file));
  const version = JSON.parse(readFileSync(join(root, "CITATION.cff"))).version;
  git("-C", root, "tag", "v" + version, "HEAD");
  const prepared = prepareDeposit(root, output);
  const first = archiveDeposit(root, prepared.folder, prepared.manifest);
  const secondFolder = mkdtempSync(resolve(".runtime/deposits/retry-"));
  for (const file of [
    "README.md",
    "CITATION.cff",
    ".zenodo.json",
    "source-manifest.json",
  ])
    copyFileSync(join(prepared.folder, file), join(secondFolder, file));
  const second = archiveDeposit(root, secondFolder, prepared.manifest);
  assert.equal(first.sha256, second.sha256);
  const bytes = readFileSync(first.output);
  const prefix = "viveiro-" + prepared.manifest.tag + "/";
  // The manifest itself is checked by archiveDeposit, and must also be expected here.

  const expected = {
    ...prepared.manifest.files,
    "source-manifest.json": createHash("sha256")
      .update(readFileSync(join(prepared.folder, "source-manifest.json")))
      .digest("hex"),
  };
  assert.equal(
    verifyDepositZip(bytes, prefix, expected),
    Object.keys(expected).length,
  );
  const altered = Buffer.from(bytes);
  const at = altered.indexOf(
    Buffer.from("Simulador exploratório; não calibrado por espécie."),
  );
  assert.ok(at > 0);
  altered[at] ^= 1;
  assert.throws(() => verifyDepositZip(altered, prefix, expected), /Bytes/);
  const extra = { ...expected };
  delete extra["src/main.ts"];
  assert.throws(() => verifyDepositZip(bytes, prefix, extra), /extra/);
  assert.throws(
    () =>
      verifyDepositZip(bytes, prefix, {
        ...expected,
        "missing.ts": "a".repeat(64),
      }),
    /incompleto/,
  );
});
