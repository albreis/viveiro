import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  gallery,
  galleryEntry,
  galleryKey,
  galleryPlan,
} from "../src/modules/gallery/catalog.ts";
import { normalizeExperiment } from "../src/modules/experiments/plan.ts";
import { runPortableExperiment } from "../src/modules/experiments/portable-run.ts";
import { catalogs } from "../src/i18n/catalogs.ts";
import { staticTranslations } from "../src/i18n/static-html.ts";
import { localizedLink } from "../src/i18n/links.ts";

test("gallery contains ten canonical versioned team recipes with complete translations", () => {
  assert.equal(gallery.length, 10);
  assert.equal(new Set(gallery.map(galleryKey)).size, 10);
  for (const entry of gallery) {
    assert.equal(galleryEntry(galleryKey(entry)), entry);
    assert.equal(entry.credit.origin, "team");
    assert.equal(entry.credit.name, "Viveiro contributors");
    assert.deepEqual(normalizeExperiment(entry.plan), entry.plan);
    for (const catalog of Object.values(catalogs))
      for (const field of ["title", "question", "condition"])
        assert.ok(catalog[`gallery.entry.${entry.id}.${field}`]);
  }
  for (const key of [
    null,
    "",
    "trilhas-sem-vento",
    "trilhas-sem-vento@2",
    "https://example.org/plan.json",
    "javascript:alert(1)",
    "<img>@1",
    "../plan@1",
  ])
    assert.equal(galleryEntry(key), undefined);
});

test("editing a loaded recipe cannot mutate its registered version", () => {
  const original = JSON.stringify(gallery);
  const copy = galleryPlan(gallery[0]);
  copy.seed = "EDITADA";
  copy.parameters.windX = 2;
  copy.biologicalProfile.id = "outro";
  assert.equal(JSON.stringify(gallery), original);
});

test("paired recipes keep the seed and isolate their declared parameter or strategy", () => {
  const fields = {
    signals: "windX",
    soil: "reposeAngle",
    development: "temperatureC",
    resources: "initialFood",
  };
  for (const [topic, field] of Object.entries(fields)) {
    const [a, b] = gallery.filter((e) => e.topic === topic).map(galleryPlan);
    assert.equal(a.seed, b.seed);
    assert.notEqual(a.parameters[field], b.parameters[field]);
    const strip = (p) => ({
      ...p,
      parameters: Object.fromEntries(
        Object.entries(p.parameters).filter(([key]) => key !== field),
      ),
    });
    assert.deepEqual(strip(a), strip(b));
  }
  const [a, b] = gallery.filter((e) => e.topic === "founding").map(galleryPlan);
  assert.equal(a.seed, b.seed);
  assert.equal(a.startMode, "founding");
  assert.equal(b.startMode, "founding");
  assert.notDeepEqual(a.biologicalProfile, b.biologicalProfile);
});

test("every published recipe executes the real portable model; repeat preserves CSV and manifest", async () => {
  const before = JSON.stringify(gallery);
  let first;
  for (const item of gallery) {
    const result = await runPortableExperiment(galleryPlan(item));
    const manifest = JSON.parse(result.manifest);
    assert.equal(manifest.clock.endTick, 300);
    assert.deepEqual(manifest.plan, item.plan);
    assert.equal(
      createHash("sha256").update(result.csv).digest("hex"),
      manifest.csv.sha256,
    );
    assert.equal(result.csv.split("\r\n").filter(Boolean).length, 5);
    first ??= result;
  }
  assert.deepEqual(await runPortableExperiment(galleryPlan(gallery[0])), first);
  assert.equal(JSON.stringify(gallery), before);
});

test("gallery HTML has translated fallback and its owned navigation remains safe", () => {
  const source = readFileSync("galeria.html", "utf8");
  for (const locale of ["pt-BR", "en"]) {
    const html = staticTranslations(source, locale);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(html.includes('role="status"'));
    const href = localizedLink(
      "./galeria.html?topic=soil#gallery-main",
      locale,
    );
    assert.equal(
      new URL(href, "https://example.org/releases/v0.46.0/").pathname,
      "/releases/v0.46.0/galeria.html",
    );
  }
});
