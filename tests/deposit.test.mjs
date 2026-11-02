import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  permittedSourcePath,
  citationMetadata,
  checkDepositMetadata,
  checkDepositBytes,
} from "../src/modules/publication/deposit.ts";

const citation = () =>
  JSON.parse(readFileSync(new URL("../CITATION.cff", import.meta.url)));
const zenodo = () =>
  JSON.parse(readFileSync(new URL("../.zenodo.json", import.meta.url)));

test("citação vincula a release real sem inventar DOI ou autoria pessoal", () => {
  const c = citationMetadata(citation());
  assert.equal(c.version, "0.30.1");
  assert.equal(c.commit, "d61a439980d32dcbae61bba5d2aeb274fbb75341");
  assert.deepEqual(c.authors, [{ name: "Viveiro contributors" }]);
  assert.equal("doi" in c, false);
  checkDepositMetadata(c, zenodo());
  assert.throws(
    () => checkDepositMetadata(c, { ...zenodo(), version: "0.99.0" }),
    /divergem/,
  );
  assert.throws(
    () => citationMetadata({ ...c, url: c.url.replace("0.30.1", "0.30.0") }),
    /URL/,
  );
});

test("seleção do depósito exclui histórico, saves e arquivos operacionais", () => {
  for (const path of [
    "src/main.ts",
    "tests/simulation.test.mjs",
    "package-lock.json",
    "public/THREE-LICENSE.txt",
  ])
    assert.ok(permittedSourcePath(path), path);
  for (const path of [
    "docs/CONTINUAR.md",
    ".openai/hosting.json",
    ".git/config",
    "AGENTS.md",
    "README.md",
    ".runtime/save.json",
    "src/../docs/secret.md",
    "src/.env",
    "src/save/data.json",
    "src/node_modules/key.js",
    "src/dist/bundle.js",
    "src\\secret.ts",
    "/src/main.ts",
    "src//main.ts",
    "src/main.ts\n--other",
  ])
    assert.equal(permittedSourcePath(path), false, path);
});

test("credenciais detectáveis impedem gerar um pacote publicável", () => {
  assert.throws(
    () => checkDepositBytes(Buffer.from("-----BEGIN PRIVATE KEY-----")),
    /credencial/,
  );
  assert.throws(
    () => checkDepositBytes(Buffer.from("ghp_" + "a".repeat(36))),
    /credencial/,
  );
  assert.doesNotThrow(() => checkDepositBytes(Buffer.from("const seed = 42;")));
});
