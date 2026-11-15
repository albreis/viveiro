import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright-core";
const folder =
  process.argv[2] ?? ".runtime/world-laboratorio-geometria-portable";
const expected = JSON.parse(readFileSync(folder + "/preparation.json", "utf8"));
const browser = await chromium.launch({
  channel: "chrome",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    }),
    page = await context.newPage(),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  // A fresh realm without the live terrarium; never replace its math backend.
  await page.route("**/__qa/laboratory", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><title>Laboratory numeric QA</title>",
    }),
  );
  await page.goto("http://127.0.0.1:4173/__qa/laboratory");
  const result = await page.evaluate(async (plan) => {
    const { installPortableMath } = await import("/src/libs/portable-math.ts");
    installPortableMath();
    const { prepareLaboratoryWorld } =
      await import("/src/modules/benchmarks/gautrais/laboratory/setup.ts");
    const { sampleWorldSection } =
      await import("/src/modules/benchmarks/gautrais/observation/world-section.ts");
    const rows = [];
    for (const workers of plan.groups) {
      const { world, report } = prepareLaboratoryWorld({ ...plan, workers }),
        before = JSON.stringify(world.snapshot());
      const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(before),
      );
      const snapshotSha256 = Array.from(new Uint8Array(digest), (v) =>
        v.toString(16).padStart(2, "0"),
      ).join("");
      const g = world.nest.laboratory,
        mask = sampleWorldSection(world.nest, {
          y: -g.sandDepth / 2,
          minX: -g.sandRadius,
          maxX: g.sandRadius,
          minZ: -g.sandRadius,
          maxZ: g.sandRadius,
          pitch: 0.1,
        });
      if (mask.cells.some((v) => v !== 0))
        throw Error("Initial substrate contains galleries");
      let blocked = false;
      try {
        world.step();
      } catch (e) {
        blocked = /physical clocks/.test(e.message);
      }
      if (!blocked || before !== JSON.stringify(world.snapshot()))
        throw Error("Clock guard failed");
      rows.push({ workers, report, snapshotSha256 });
    }
    return rows;
  }, expected.plan);
  assert.deepEqual(
    result,
    expected.results.map(({ workers, report, snapshotSha256 }) => ({
      workers,
      report,
      snapshotSha256,
    })),
  );
  assert.deepEqual(errors, []);
  await context.close();
  const visual = await browser.newPage({
    viewport: { width: 650, height: 740 },
  });
  await visual.setContent(
    "<style>body{margin:10px;background:#faf9f2}svg{width:610px;height:690px}</style>" +
      readFileSync(folder + "/workers-200.svg", "utf8"),
  );
  await visual.screenshot({ path: ".runtime/world-laboratorio-geometria.png" });
  const report = {
    browser: browser.version(),
    groups: 3,
    workers: 350,
    cliBrowserSnapshotExact: true,
    arithmeticPolicy: "stdlib-f64-v1",
    blankSubstrate: true,
    physicalClockGuard: true,
    freshContext: true,
    pageErrors: errors,
  };
  writeFileSync(
    ".runtime/world-laboratorio-browser.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report));
  await visual.close();
} finally {
  await browser.close();
}
