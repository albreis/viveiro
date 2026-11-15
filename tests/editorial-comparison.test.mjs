import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import vm from "node:vm";
const html = readFileSync("docs/divulgacao/kit-divulgacao.html", "utf8");
const review = JSON.parse(
  readFileSync("docs/divulgacao/comparativo-gautrais.json"),
);
const start = html.indexOf("var ctx = {", html.indexOf("// Ranking"));
const end = html.indexOf("function render(c)", start);
assert.ok(start > 0 && end > start);
const { ctx, tools, score } = vm.runInNewContext(
  html.slice(start, end) + ";({ctx,tools,score})",
);
const own = tools.find((t) => t.us);
const plain = (x) => JSON.parse(JSON.stringify(x));
for (const key of ["uni", "esc"])
  test(
    "editorial review uses the original weights and documented changes: " + key,
    () => {
      const expected = review.contexts[key];
      assert.deepEqual(plain(ctx[key].crit.map((c) => c[1])), expected.weights);
      assert.ok(
        Math.abs(expected.weights.reduce((a, b) => a + b, 0) - 1) < 1e-12,
      );
      assert.deepEqual(plain(own[key]), expected.after);
      assert.equal(score(own, key), expected.afterTotal);
      const before = { ...own, [key]: expected.before };
      assert.equal(score(before, key), expected.beforeTotal);
      assert.equal(
        Number((score(own, key) - score(before, key)).toFixed(2)),
        key === "uni" ? 0.35 : 0.15,
      );
      const changed = expected.before.flatMap((n, i) =>
        n !== expected.after[i] ? [i] : [],
      );
      assert.deepEqual(changed, key === "uni" ? [0, 1] : [4]);
    },
  );
test("historical competitor scores are retained without a new market audit", () => {
  const competitors = plain(tools.filter((t) => !t.us && !t.proj));
  const hash = createHash("sha256")
    .update(JSON.stringify(competitors))
    .digest("hex");
  assert.equal(hash, review.competitors.dataSha256);
  assert.equal(review.competitors.reaudited, false);
  assert.match(
    html.replace(/\s+/g, " "),
    /referências históricas sem nova auditoria/,
  );
});
test("scientific acceptance and publication pause do not inherit editorial points", () => {
  assert.equal(own.uni[2], 3);
  assert.equal(review.contexts.uni.before[2], 3);
  assert.equal(review.scientificValidationCompleted, false);
  assert.equal(review.publication.newTagsPaused, true);
  assert.equal(review.publication.newReleasesPaused, true);
  assert.equal(review.publication.manualZenodoDeposit, false);
  const checkpoint = readFileSync("docs/CONTINUAR.md", "utf8");
  assert.match(
    checkpoint,
    /Não criar ou enviar novas tags nem GitHub Releases agora/,
  );
  assert.match(html, /G2–G4 estão pendentes/);
});
