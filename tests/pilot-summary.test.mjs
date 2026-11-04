import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { summarizePilot } from "../scripts/lib/pilot-summary.ts";

const template = readFileSync(
  new URL("../docs/ensino/piloto-respostas.csv", import.meta.url),
  "utf8",
);
const data = (...rows) =>
  template + rows.map((row) => row.join(",")).join("\n");

test("SUS pontua extremos e exclui formulários incompletos; pré/pós é pareado", () => {
  const result = summarizePilot(
    data(
      ["T01", "P501", 2, 4, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1],
      ["T02", "P502", 4, 3, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5],
      ["T01", "P503", 6, "", 5, 1, "", "", "", "", "", "", "", ""],
      ["T02", "P504", "", 0, "", "", "", "", "", "", "", "", "", ""],
      ["T02", "P505", "", "", "", "", "", "", "", "", "", "", "", ""],
    ),
  );
  assert.equal(result.cohorts, 2);
  assert.equal(result.participants, 5);
  assert.deepEqual(result.sus, {
    n: 2,
    mean: 50,
    sampleSd: Math.sqrt(5000),
    partial: 1,
    missing: 2,
  });
  assert.deepEqual(result.learning, {
    pre: { n: 2, mean: 3, sampleSd: Math.sqrt(2) },
    post: { n: 2, mean: 3.5, sampleSd: Math.sqrt(0.5) },
    gain: { n: 2, mean: 0.5, sampleSd: Math.sqrt(4.5) },
    preOnly: 1,
    postOnly: 1,
    neither: 1,
  });
  assert.doesNotMatch(JSON.stringify(result), /P50[1-5]|T0[12]/);
});

test("modelo vazio não declara resultados; rejeita entradas ambíguas", () => {
  const empty = summarizePilot(template);
  assert.equal(empty.sus.mean, null);
  assert.equal(empty.learning.gain.n, 0);
  const valid = ["T01", "P501", 0, 6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
  assert.equal(summarizePilot(data(valid)).sus.mean, 50);
  assert.throws(() => summarizePilot(data(valid, valid)), /repetido/);
  assert.throws(
    () => summarizePilot(data(["T01", "nome", ...valid.slice(2)])),
    /códigos/,
  );
  assert.throws(
    () => summarizePilot(data([...valid.slice(0, -1), 6])),
    /Nota inválida/,
  );
  assert.throws(
    () => summarizePilot(data([...valid.slice(0, 2), 7, ...valid.slice(3)])),
    /pre/,
  );
  assert.throws(
    () => summarizePilot(template.replace("turma", "email")),
    /colunas/,
  );
});
