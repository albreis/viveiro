import assert from "node:assert/strict";
import { cpus, release, totalmem } from "node:os";
import { chromium } from "playwright-core";
import { preview } from "vite";
import metadata from "../../package.json" with { type: "json" };

const viewport = { width: 1366, height: 768 };
const lesson = "trilhas-vento";
const software = process.argv.includes("--software");
const server = await preview({
  logLevel: "error",
  build: { outDir: process.env.VIVEIRO_QA_DIST ?? "dist" },
  preview: { host: "127.0.0.1", port: 0 },
});

async function measure(browser, url, mode) {
  const context = await browser.newContext({ viewport, locale: "en" });
  try {
    const page = await context.newPage();
    page.setDefaultTimeout(45000);
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.locator("#loading").waitFor({ state: "hidden" });
    if (await page.locator("#tour-panel").isVisible())
      await page.locator("#tour-close").click();
    await page.locator("#lesson-panel > summary").click();
    await page.locator('[data-lesson="' + lesson + '"]').click();
    await page.waitForFunction(() =>
      document
        .querySelector("#lesson-status")
        ?.textContent.startsWith("Lesson opened"),
    );
    await page.locator("#render-profile").selectOption(mode);
    await page.locator('[data-speed="10"]').click();
    await page.locator("#viewport").scrollIntoViewIfNeeded();
    const read = async (selector) =>
      (await page.locator(selector).textContent()).trim();
    const before = {
      population: await read("#population"),
      day: await read("#day"),
    };
    assert.equal(before.population, "17");
    await page.evaluate(() => {
      document.getElementById("play").click();
      document.getElementById("measure-frames").click();
    });
    await page.waitForFunction(() =>
      document.querySelector("#frame-report")?.textContent.includes("frames/s"),
    );
    const measurement = await read("#frame-report");
    const after = {
      population: await read("#population"),
      day: await read("#day"),
    };
    assert.notEqual(
      after.day,
      before.day,
      "O terrário precisa avançar durante a medição",
    );
    const result = measurement.match(/([\d.]+) frames\/s · P95 ([\d.]+) ms/);
    assert.ok(result);
    return {
      mode,
      fps: Number(result[1]),
      p95FrameMs: Number(result[2]),
      before,
      after,
      measurement,
    };
  } finally {
    await context.close();
  }
}

let browser;
try {
  browser = await chromium.launch({
    channel: "chrome",
    headless: !process.argv.includes("--headed"),
    args: software
      ? ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
      : [],
  });
  const cdp = await browser.newBrowserCDPSession();
  const info = await cdp.send("SystemInfo.getInfo");
  await cdp.detach();
  const url =
    "http://127.0.0.1:" + server.httpServer.address().port + "/?lang=en";
  const results = [];
  for (const mode of ["full", "light"])
    results.push(await measure(browser, url, mode));
  console.log(
    JSON.stringify(
      {
        version: metadata.version,
        browser: browser.version(),
        platform: process.platform + " " + release(),
        cpu: cpus()[0]?.model,
        logicalCpus: cpus().length,
        ramGiB: Math.round(totalmem() / 2 ** 30),
        renderer: info.gpu.auxAttributes?.glRenderer,
        softwareRequested: software,
        viewport,
        scenario: {
          seed: "AULA-v2-" + lesson,
          comparison: "a",
          speed: 10,
          initialWorkers: 16,
          simulatedScenarios: 2,
          minimumSeconds: 10,
        },
        results,
      },
      null,
      2,
    ),
  );
} finally {
  await browser?.close();
  await server.close();
}
