import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { posix } from "node:path";
import { modelDocuments } from "../src/modules/model-documentation/catalog.ts";
import { modelDocPages } from "../scripts/lib/model-doc-pages.ts";
import { teachingMarkdown } from "../src/modules/teaching/markdown.ts";
import { permittedSourcePath } from "../src/modules/publication/deposit.ts";
import { validAssetPath } from "../src/modules/publication/release.ts";

test("ODD: páginas, downloads íntegros e links locais resolvíveis", () => {
  const pages = modelDocPages(process.cwd());
  assert.equal(modelDocuments.length, 13);
  for (const d of modelDocuments) {
    assert.ok(permittedSourcePath(d.source));
    assert.equal(
      pages.get("modelo/" + d.slug + ".txt"),
      readFileSync(d.source, "utf8"),
    );
    const html = pages.get("modelo/" + d.slug + ".html");
    assert.match(html, /<main id="conteudo" tabindex="-1">/);
    assert.match(html, /Revisão externa pendente/);
    assert.equal((html.match(/<h1>/g) ?? []).length, 1);
    for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
      if (/^(https?:|#)/.test(href)) continue;
      const target = posix.normalize(
        posix.join("modelo", href.split(/[?#]/)[0]),
      );
      assert.ok(
        target === "index.html" ||
          pages.has(target) ||
          (target.startsWith("experimentos/") &&
            existsSync("public/" + target)),
        d.slug + ": " + href,
      );
    }
  }
  for (const path of pages.keys()) assert.ok(validAssetPath(path), path);
  assert.equal(
    pages.get("modelo/referencia.txt"),
    readFileSync("src/modules/model-documentation/reference-field.ts", "utf8"),
  );
  assert.equal(
    pages.get("modelo/verificador.txt"),
    readFileSync("scripts/check-odd-reference.ts", "utf8"),
  );
  assert.equal(JSON.parse(pages.get("modelo/vetores.json")).cases.length, 7);
  for (const p of [
    "docs/CONTINUAR.md",
    "docs/odd/segredo.md",
    "docs/odd/../CONTINUAR.md",
  ])
    assert.equal(permittedSourcePath(p), false);
});
test("ODD: Markdown mantém fórmulas legíveis e escapa conteúdo executável", () => {
  const html = teachingMarkdown(
    "# Equação\n\n`<b>[x](https://example.org/)</b>`\n\n```text\n<x> & a < b\n[x](javascript:alert(1))\n```\n\n[vetores](vetores.json)\n\n<img src=x onerror=alert(1)>",
  );
  assert.match(
    html,
    /<code>&lt;b&gt;\[x\]\(https:\/\/example.org\/\)&lt;\/b&gt;<\/code>/,
  );
  assert.match(html, /<pre tabindex="0" role="region"/);
  assert.match(html, /&lt;x&gt; &amp; a &lt; b/);
  assert.match(html, /href="vetores.json"/);
  assert.equal(html.includes("<img"), false);
  assert.equal(html.includes('href="javascript:'), false);
  assert.equal(html.includes('href="https://example.org/"'), false);
  assert.match(
    teachingMarkdown("```\n<strong>"),
    /&lt;strong&gt;<\/code><\/pre>/,
  );
});

test("ODD: real semantic table, relative data links and safe escaping", () => {
  const h = teachingMarkdown(
    "| Input | Value |\n| --- | --- |\n| <img> | 42 |\n\n[data](../experimentos/morris-042/indices.csv) [bad](javascript:alert(1))",
  );
  assert.match(h, /<th scope="col">Input<\/th>/);
  assert.match(h, /<td>&lt;img&gt;<\/td>/);
  assert.match(h, /href="..\/experimentos\/morris-042\/indices.csv"/);
  assert.ok(!h.includes('href="javascript:'));
});
