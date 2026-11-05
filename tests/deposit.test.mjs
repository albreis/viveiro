import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  permittedSourcePath,
  citationMetadata,
  checkDepositMetadata,
  checkDepositBytes,
  zenodoCreators,
} from "../src/modules/publication/deposit.ts";

const citation = () =>
  JSON.parse(readFileSync(new URL("../CITATION.cff", import.meta.url)));
const zenodo = () =>
  JSON.parse(readFileSync(new URL("../.zenodo.json", import.meta.url)));

test("citação vincula a release real ao autor com ORCID, sem inventar DOI", () => {
  const c = citationMetadata(citation());
  assert.match(c.version, /^\d+\.\d+\.\d+$/);
  if (c.commit !== undefined) assert.match(c.commit, /^[a-f0-9]{40}$/);
  assert.doesNotThrow(() => citationMetadata({ ...c, commit: undefined }));
  assert.throws(() => citationMetadata({ ...c, commit: "invalid" }), /SHA/);
  assert.deepEqual(c.authors, [
    {
      "given-names": "Everaldo",
      "family-names": "Reis da Silva",
      orcid: "https://orcid.org/0009-0008-0719-8722",
    },
  ]);
  assert.deepEqual(zenodo().creators, [
    { name: "Reis da Silva, Everaldo", orcid: "0009-0008-0719-8722" },
  ]);
  assert.equal("doi" in c, false);
  checkDepositMetadata(c, zenodo());
  assert.throws(
    () => checkDepositMetadata(c, { ...zenodo(), version: "0.99.0" }),
    /divergem/,
  );
  assert.throws(
    () => citationMetadata({ ...c, url: c.url.replace(c.version, "999.99.9") }),
    /URL/,
  );
});

test("ORCID só acompanha pessoa com prenome e sobrenome", () => {
  const c = citationMetadata(citation());
  const group = { name: "Viveiro contributors" };
  assert.deepEqual(zenodoCreators({ ...c, authors: [group] }), [group]);
  assert.throws(
    () =>
      citationMetadata({
        ...c,
        authors: [{ ...group, orcid: "https://orcid.org/0009-0008-0719-8722" }],
      }),
    /pessoa/,
  );
  assert.throws(
    () => citationMetadata({ ...c, authors: [{ "family-names": "Silva" }] }),
    /prenome e sobrenome/,
  );
  assert.throws(
    () =>
      citationMetadata({
        ...c,
        authors: [{ ...c.authors[0], orcid: "0009-0008-0719-8722" }],
      }),
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
    "tests/deposit.test.mjs",
    "tests/publication-files.test.mjs",
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
