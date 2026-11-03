import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { posix } from "node:path";
import { modelDocPages } from "../scripts/lib/model-doc-pages.ts";
import { teachingPages } from "../scripts/lib/teaching-pages.ts";
import { licensePages } from "../scripts/lib/license-pages.ts";
import { modelDocuments } from "../src/modules/model-documentation/catalog.ts";
import { localizedLink } from "../src/i18n/links.ts";
import { teachingMarkdown } from "../src/modules/teaching/markdown.ts";
import { translateSource } from "../src/i18n/source.ts";

const root = process.cwd();
const all = new Map([
  ...modelDocPages(root),
  ...teachingPages(root),
  ...licensePages(root),
]);

test("localized documents resolve all links under the Pages base and retain a single raw-data location", () => {
  let count = 0;
  for (const [file, html] of all) {
    if (!file.endsWith(".html")) continue;
    count++;
    assert.match(
      html,
      new RegExp(
        '<html lang="' + (file.startsWith("en/") ? "en" : "pt-BR") + '"',
      ),
    );
    for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|#|mailto:)/.test(href)) continue;
      const target = posix.normalize(
        posix.join(posix.dirname(file), href.split(/[?#]/)[0]),
      );
      assert.ok(!target.startsWith("../"), file + ": escapes release: " + href);
      assert.ok(
        all.has(target) ||
          existsSync("public/" + target) ||
          ["index.html", "experimentos.html"].includes(target),
        file + ": " + href + " -> " + target,
      );
      const base = "/versoes/v0.45.0/";
      assert.equal(
        new URL(href, "https://example.org" + base + file).pathname,
        base + target,
      );
    }
  }
  assert.equal(count, 41);
  assert.match(
    all.get("en/modelo/index.html"),
    /download="viveiro-en-modelo-index.txt"/,
  );
  assert.match(
    all.get("en/ensino/index.html"),
    /download="viveiro-en-ensino-README.txt"/,
  );
});

test("English editable documents are downloaded intact; reference code, vectors and scientific values stay canonical", () => {
  for (const d of modelDocuments) {
    assert.equal(
      all.get("en/modelo/" + d.slug + ".txt"),
      readFileSync("src/i18n/locales/en/" + d.source, "utf8"),
    );
    assert.match(
      all.get("en/modelo/" + d.slug + ".html"),
      /External review pending/,
    );
  }
  for (const name of ["referencia.txt", "vetores.json", "verificador.txt"])
    assert.equal(all.get("en/modelo/" + name), all.get("modelo/" + name));
  assert.equal(JSON.parse(all.get("en/modelo/vetores.json")).cases.length, 7);
  const english = all.get("en/modelo/sensibilidade.txt");
  const portuguese = all.get("modelo/sensibilidade.txt");
  const hashes = (s) => [...s.matchAll(/\b[a-f0-9]{64}\b/g)].map((m) => m[0]);
  assert.deepEqual(hashes(english), hashes(portuguese));
  assert.ok(!all.get("en/licencas.html").includes("{{version}}"));
});

test("owned navigation preserves queries and anchors; other URLs are not rewritten", () => {
  assert.equal(
    localizedLink("./modelo/index.html", "en"),
    "./en/modelo/index.html",
  );
  assert.equal(
    localizedLink("./ensino/index.html", "pt-BR"),
    "./ensino/index.html",
  );
  assert.equal(
    localizedLink("experimentos.html?view=profile#editor", "en"),
    "experimentos.html?view=profile&lang=en#editor",
  );
  for (const url of [
    "https://example.org/modelo/index.html",
    "./experimentos/raw.csv",
    "custom.html",
    "modelo.txt",
  ])
    assert.equal(localizedLink(url, "en"), null);
  const html = teachingMarkdown(
    "```text\n<x>\n```\n\n| A | B |\n| --- | --- |\n| 1 | 2 |",
    "en",
  );
  assert.match(html, /&lt;x&gt;/);
  assert.match(html, /aria-label="Code or equation as text"/);
  assert.match(html, /<th scope="col">A<\/th>/);
  assert.equal(
    translateSource("IndexedDB indisponível.", "en"),
    "IndexedDB is unavailable.",
  );
  assert.equal(translateSource("ENTRADA", "en"), "ENTRANCE");
});
