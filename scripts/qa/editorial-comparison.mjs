import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright-core";
const base = process.env.VIVEIRO_QA_BASE ?? "http://127.0.0.1:4173/";
mkdirSync(".runtime", { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const cases = [];
try {
  for (const [width, height] of [
    [1440, 1000],
    [390, 844],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      locale: "pt-BR",
    });
    try {
      const page = await context.newPage(),
        errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.setDefaultTimeout(45000);
      assert.ok(
        (
          await page.goto(base + "docs/divulgacao/kit-divulgacao.html#ranking")
        ).ok(),
      );
      await page.locator("#rank .row.us").waitFor();
      assert.equal(
        await page.locator("#rank .row.us .score").textContent(),
        "6,40",
      );
      assert.equal(await page.locator("#rank .row").count(), 9);
      assert.equal(await page.locator("#rank .proj").count(), 0);
      assert.equal(await page.locator("#score-table tbody tr").count(), 9);
      assert.equal(
        (await page.locator("#score-table tr.us td").allTextContents())[2],
        "3",
      );
      assert.match(
        await page.locator("#release-status").textContent(),
        /pausadas/,
      );
      await page
        .locator("#ranking")
        .screenshot({ path: ".runtime/comparativo-uni-" + width + ".png" });
      await page.locator("#btn-esc").click();
      assert.equal(
        await page.locator("#btn-esc").getAttribute("aria-pressed"),
        "true",
      );
      assert.equal(
        await page.locator("#rank .row.us .score").textContent(),
        "6,85",
      );
      assert.equal(await page.locator("#score-table tbody tr").count(), 9);
      await page
        .locator("#ranking")
        .screenshot({ path: ".runtime/comparativo-esc-" + width + ".png" });
      assert.deepEqual(errors, []);
      cases.push({
        width,
        height,
        university: "6,40",
        school: "6,85",
        biologicalScoreUnchanged: true,
        projectionRowsExcluded: true,
        publicationPauseVisible: true,
        errors,
      });
    } finally {
      await context.close();
    }
  }
  const report = { browser: browser.version(), cases };
  writeFileSync(
    ".runtime/comparativo-browser.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
