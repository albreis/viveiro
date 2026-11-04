import { test } from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
  mkdtempSync,
  mkdirSync,
  copyFileSync,
  writeFileSync,
  readdirSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { build } from "vite";
import { readRoadmap, roadmapDocuments } from "../scripts/lib/roadmap-data.ts";
import {
  readRoadmapFilter,
  filterRoadmap,
  roadmapFilterParams,
} from "../src/modules/roadmap/filter.ts";
const data = readRoadmap(process.cwd());
const items = (view) =>
  data.groups.filter((g) => g.view === view).flatMap((g) => g.items);

test("roadmap covers all UX phases, Buhl steps and optional sources without claiming completion", () => {
  assert.equal(items("ux").length, 21);
  assert.deepEqual(
    items("ux").map((i) => i.id),
    Array.from(
      { length: 21 },
      (_, i) => `UX-${String(i + 1).padStart(2, "0")}`,
    ),
  );
  assert.equal(items("optional").length, 8);
  assert.ok(items("optional").every((i) => i.optional && !i.done));
  assert.equal(items("buhl").length, 8);
  assert.ok(data.groups.find((g) => g.view === "buhl").started);
  assert.ok(items("buhl").every((i) => !i.done));
  assert.ok(items("personal").some((i) => i.done && /Zoom/.test(i.title)));
  assert.ok(
    items("done").some((i) =>
      /23932885/.test(i.detail + JSON.stringify(i.links)),
    ),
  );
  assert.equal(
    data.version,
    JSON.parse(readFileSync("package.json", "utf8")).version,
  );
  assert.equal(data.updated, "03/11/2026");
  const all = data.groups.flatMap((g) => g.items);
  assert.equal(new Set(all.map((i) => i.id)).size, all.length);
});

test("document updates change the generated panel; unsafe link schemes are not made clickable", () => {
  const temporary = mkdtempSync(join(tmpdir(), "viveiro-roadmap-"));
  for (const file of [...roadmapDocuments, "package.json"]) {
    mkdirSync(dirname(join(temporary, file)), { recursive: true });
    copyFileSync(file, join(temporary, file));
  }
  const file = join(temporary, "docs/planejamento/tecnico.md");
  writeFileSync(
    file,
    readFileSync(file, "utf8") +
      "\n## Novo passo de teste\n\n- [ ] Novo aceite: [ruim](javascript:alert) [bom](https://example.org/data).\n",
  );
  const changed = readRoadmap(temporary);
  const extra = changed.groups.find((g) => g.title === "Novo passo de teste")
    .items[0];
  assert.equal(changed.groups.length, data.groups.length + 1);
  assert.equal(extra.title, "Novo aceite");
  assert.deepEqual(extra.links, [
    { label: "bom", url: "https://example.org/data" },
  ]);
});

test("search crosses areas and ignores accents; status and empty results remain meaningful", () => {
  const found = filterRoadmap(data, {
    view: "done",
    query: "trofalaxia",
    status: "all",
  });
  assert.ok(found.length > 0);
  assert.ok(
    filterRoadmap(data, {
      view: "overview",
      query: "escavacao",
      status: "all",
    }).some((g) => g.view === "optional"),
  );
  const pending = filterRoadmap(data, {
    view: "personal",
    query: "",
    status: "pending",
  });
  assert.ok(pending.flatMap((g) => g.items).every((i) => !i.done));
  assert.deepEqual(
    filterRoadmap(data, { view: "optional", query: "", status: "done" }),
    [],
  );
  assert.deepEqual(
    filterRoadmap(data, {
      view: "overview",
      query: "zz-inexistente-zz",
      status: "all",
    }),
    [],
  );
});

test("bookmark filters are bounded and round-trip without turning unknown values into routes", () => {
  const filter = { view: "buhl", query: "curva temporal", status: "pending" };
  assert.deepEqual(readRoadmapFilter(roadmapFilterParams(filter)), filter);
  const invalid = readRoadmapFilter(
    new URLSearchParams({
      view: "javascript:alert",
      status: "started",
      q: "x".repeat(500),
    }),
  );
  assert.equal(invalid.view, "overview");
  assert.equal(invalid.status, "all");
  assert.equal(invalid.query.length, 200);
});

test("actual public build excludes private roadmap entry, payload and navigation", async () => {
  const output = mkdtempSync(
    join(resolve(".runtime"), "roadmap-public-check-"),
  );
  await build({
    mode: "public",
    base: "/releases/v0.46.0/",
    logLevel: "silent",
    build: { outDir: output },
  });
  assert.ok(!readdirSync(output).includes("cronograma.html"));
  assert.ok(
    !readFileSync(join(output, "index.html"), "utf8").includes(
      "cronograma.html",
    ),
  );
  const assets = readdirSync(join(output, "assets"));
  assert.ok(!assets.some((name) => name.startsWith("roadmap-")));
  for (const name of assets.filter((name) => name.endsWith(".js"))) {
    const content = readFileSync(join(output, "assets", name), "utf8");
    assert.ok(!content.includes("Dados adicionais — incremento opcional"));
    assert.ok(!content.includes("BUHL-2/n1c30 de 72h"));
  }
});
