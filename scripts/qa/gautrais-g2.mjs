import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright-core";
const expected = JSON.parse(
  readFileSync(".runtime/gautrais-g2-piloto/world-observation.json", "utf8"),
);
const browser = await chromium.launch({
  channel: "chrome",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  const context = await browser.newContext({
    viewport: { width: 1300, height: 900 },
  });
  const page = await context.newPage(),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:4173/?lang=pt-BR");
  await page.locator("#loading").waitFor({ state: "hidden", timeout: 60000 });
  const actual = await page.evaluate(async (plan) => {
    const { prepareDigAccess } =
      await import("/src/modules/benchmarks/dig-access.ts");
    const { sampleWorldSection } =
      await import("/src/modules/benchmarks/gautrais/observation/world-section.ts");
    const { observePhysicalNetwork } =
      await import("/src/modules/benchmarks/gautrais/observation/measure.ts");
    const results = [];
    for (const workers of plan.groups) {
      const world = prepareDigAccess({
          seed: plan.seed,
          workers,
          profileVersion: 3,
        }),
        samples = [];
      for (let tick = 0; tick <= plan.ticks; tick++) {
        if (tick) {
          world.predators = [];
          world.step();
        }
        if (tick % plan.sampleEvery) continue;
        const observations = [];
        for (const y of plan.sectionsY)
          for (const pitch of plan.pitches) {
            const section = {
              y,
              minX: -10,
              maxX: 10,
              minZ: -6.5,
              maxZ: 6.5,
              pitch,
            };
            const before = JSON.stringify(world.snapshot());
            const measured = observePhysicalNetwork(
              sampleWorldSection(world.nest, section),
            );
            if (before !== JSON.stringify(world.snapshot()))
              throw Error("Observer mutated World");
            observations.push({
              section,
              metrics: measured.metrics,
              physicalTopology: measured.physicalTopology,
            });
          }
        samples.push({
          tick: world.tick,
          population: world.ants.length,
          observations,
        });
      }
      results.push({ workers, samples });
    }
    return results;
  }, expected.plan);
  const wanted = expected.results.map((r) => ({
    ...r,
    samples: r.samples.map((s) => ({
      ...s,
      observations: s.observations.map(({ image, ...o }) => o),
    })),
  }));
  assert.deepEqual(actual, wanted);
  assert.deepEqual(errors, []);
  await context.close();
  const visual = await browser.newPage({
    viewport: { width: 1100, height: 760 },
  });
  const svg = readFileSync(
    ".runtime/gautrais-g2-piloto/workers-50-tick-120-y--2-pitch-0.2.svg",
    "utf8",
  );
  await visual.setContent(
    "<style>body{margin:20px;background:#faf9f2}svg{width:1000px;height:650px}</style>" +
      svg,
  );
  await visual.screenshot({
    path: ".runtime/gautrais-g2-section.png",
    fullPage: true,
  });
  const report = {
    browser: browser.version(),
    observations: 54,
    cliBrowserExact: true,
    readonly: true,
    freshContext: true,
    pageErrors: errors,
    physicalProtocolCompatible: false,
    reservedMetricsComputed: false,
  };
  writeFileSync(
    ".runtime/gautrais-g2-browser.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report));
  await context.close();
} finally {
  await browser.close();
}
