import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { catalogs, defaultLocale } from "../src/i18n/catalogs.ts";
import {
  biologicalParameters,
  biologicalProfiles,
} from "../src/modules/biology/catalog.ts";
import { lessons } from "../src/modules/lessons/catalog.ts";
import { profileLabel, profileDescription } from "../src/i18n/biology.ts";
import { presentLesson } from "../src/i18n/lessons.ts";
import { locale } from "../src/i18n/runtime.ts";
import { translateSource } from "../src/i18n/source.ts";
import { htmlIncludes } from "../scripts/lib/html-includes.ts";
import { staticTranslations } from "../src/i18n/static-html.ts";

test("every biological parameter has translated label, context, unit and uncertainty; values and sources stay intact", () => {
  const originals = JSON.stringify(biologicalParameters),
    sources = new Set(Object.values(catalogs[defaultLocale]));
  for (const record of biologicalParameters)
    for (const field of ["label", "context", "unit", "uncertainty"])
      assert.ok(sources.has(record[field]), record.id + ": " + field);
  locale.setLocale("en");
  try {
    for (const p of biologicalProfiles) {
      assert.ok(profileLabel(p));
      assert.ok(profileDescription(p));
    }
    for (const d of lessons) {
      const shown = presentLesson(d);
      assert.equal(shown.id, d.id);
      assert.notEqual(shown.question, d.question);
    }
  } finally {
    locale.setLocale("pt-BR");
  }
  assert.equal(JSON.stringify(biologicalParameters), originals);
  assert.equal(
    translateSource("A rainha colocou 3 ovos usando reservas maternas.", "en"),
    "The queen laid 3 eggs using maternal reserves.",
  );
  assert.equal(
    translateSource(
      "Colônia 2: uma filha da colônia 1 decolou para fundar outro ninho.",
      "en",
    ),
    "Colony 2: a daughter of colony 1 took off to found another nest.",
  );
});

test("HTML fragments assemble both languages with unique IDs and unchanged form controls", () => {
  for (const file of ["index.html", "experimentos.html"]) {
    const assembled = htmlIncludes(process.cwd(), readFileSync(file, "utf8"));
    assert.ok(!assembled.includes("@include"));
    const pt = staticTranslations(assembled),
      en = staticTranslations(assembled, "en");
    const identifiers = (html) =>
      [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    const ids = identifiers(pt);
    assert.equal(new Set(ids).size, ids.length);
    assert.deepEqual(identifiers(en), ids);
    const fields = (html) =>
      [...html.matchAll(/<(?:input|textarea|select)\b[^>]*>/g)].map((m) =>
        m[0].replace(/(?:aria-label|title|placeholder)="[^"]*"/g, ""),
      );
    assert.deepEqual(fields(pt), fields(en));
  }
  assert.throws(
    () => htmlIncludes(process.cwd(), "<!-- @include ../../package.json -->"),
    /Invalid HTML/,
  );
});

test("committed i18n browser and CLI evidence preserves exact CSV and manifest bytes", () => {
  const directory = "public/experimentos/i18n-p27",
    index = JSON.parse(readFileSync(join(directory, "arquivos.json"), "utf8"));
  for (const [path, hash] of Object.entries(index))
    assert.equal(
      createHash("sha256")
        .update(readFileSync(join(directory, path)))
        .digest("hex"),
      hash,
      path,
    );
  for (const name of ["dados.csv", "manifesto.json"]) {
    const pt = readFileSync(join(directory, "pt", name));
    assert.deepEqual(readFileSync(join(directory, "en", name)), pt);
    assert.deepEqual(readFileSync(join(directory, "node", name)), pt);
  }
});
