import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { teachingGuides } from "../src/modules/teaching/catalog.ts";
import { teachingMarkdown } from "../src/modules/teaching/markdown.ts";
import { teachingPages } from "../scripts/lib/teaching-pages.ts";
import { lessons } from "../src/modules/lessons/catalog.ts";
import { createLessonSession } from "../src/modules/lessons/recipe.ts";
import { permittedSourcePath } from "../src/modules/publication/deposit.ts";
import { validAssetPath } from "../src/modules/publication/release.ts";

const sum = (items) => items.reduce((a, b) => a + b, 0);
for (const d of lessons)
  test("receita v2 inicializa sem avançar ou consumir: " + d.id, () => {
    const s = createLessonSession({ id: d.id, version: 2 });
    for (const w of [s.world, s.comparison]) {
      assert.equal(w.tick, 0);
      assert.equal(w.microclimate.steps, 0);
      assert.equal(w.microclimate.initialWater, sum(w.microclimate.water));
      assert.equal(w.microclimate.initialHeat, sum(w.microclimate.temperature));
      assert.equal(w.microclimate.rainIn + w.microclimate.evaporated, 0);
      assert.equal(w.gases.steps + w.gases.consumed + w.gases.produced, 0);
      assert.equal(w.gases.cells.length, w.nest.nodes.length);
      assert.equal(
        w.gases.initialOxygen,
        sum(w.gases.cells.map((c) => c.oxygen)),
      );
      assert.equal(
        w.gases.initialCarbon,
        sum(w.gases.cells.map((c) => c.carbon)),
      );
      assert.equal(w.gases.geometryOxygen + w.gases.geometryCarbon, 0);
    }
  });
test("receita v1 continua recuperável sem adotar a inicialização v2", () => {
  const s = createLessonSession({ id: "heranca", version: 1 });
  assert.equal(s.lesson.version, 1);
  assert.equal(s.world.seed, "AULA-v1-heranca");
  assert.equal(s.world.gases, undefined);
  const next = createLessonSession({ id: "heranca", version: 2 });
  assert.equal(next.world.seed, "AULA-v2-heranca");
  assert.ok(next.world.gases.cells.length > 0);
});
test("seis roteiros cobrem sete aulas e preservam seções, revisão e fonte editável", () => {
  assert.equal(teachingGuides.length, 6);
  assert.deepEqual(
    new Set(teachingGuides.flatMap((g) => g.lessons)),
    new Set(lessons.map((d) => d.id)),
  );
  const pages = teachingPages(process.cwd());
  for (const key of pages.keys()) assert.ok(validAssetPath(key), key);
  for (const g of teachingGuides) {
    const path = "docs/ensino/" + g.slug + ".md";
    assert.ok(permittedSourcePath(path));
    const source = readFileSync(path, "utf8");
    const html = pages.get("ensino/" + g.slug + ".html");
    for (const section of [
      "Objetivo",
      "BNCC",
      "Passos e registro",
      "Perguntas para discussão",
      "Gabarito comentado",
      "O que o modelo não representa",
      "Revisão docente",
    ])
      assert.ok(source.includes("## " + section), g.slug + ": " + section);
    assert.match(html, /revisão por docentes de Biologia e Física pendente/);
    assert.match(html, /href="index.html"/);
    assert.ok(html.includes("<h1>" + g.title + "</h1>"));
    assert.equal(pages.get("ensino/" + g.slug + ".txt"), source);
  }
  assert.match(pages.get("ensino/index.html"), /href="revisao-docente.txt"/);
  assert.match(pages.get("ensino/index.html"), /href="microclima-local.txt"/);
  for (const [path, html] of pages) {
    if (!path.endsWith(".html")) continue;
    for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
      if (/^(https?:|#|\.\.\/)/.test(href)) continue;
      assert.ok(pages.has("ensino/" + href), path + ": " + href);
    }
  }
  assert.equal(permittedSourcePath("docs/CONTINUAR.md"), false);
  assert.equal(permittedSourcePath("docs/ensino/private-notes.md"), false);
});
test("Markdown conserva passos contínuos e impede HTML ou links executáveis", () => {
  const html = teachingMarkdown(
    "# Teste\n\n1. Primeiro\n   continua aqui\n2. Segundo\n\n<script>alert(1)</script>\n\n[x](javascript:alert(1))\n\n[seguro](https://example.org/)",
  );
  assert.match(
    html,
    /<ol>\s*<li>Primeiro continua aqui<\/li>\s*<li>Segundo<\/li>\s*<\/ol>/,
  );
  assert.equal(html.includes("<script>"), false);
  assert.equal(html.includes('href="javascript:'), false);
  assert.match(html, /href="https:\/\/example.org\/"/);
});
