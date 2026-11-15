import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright-core";
const browser = await chromium.launch({
  channel: "chrome",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
mkdirSync(".runtime", { recursive: true });
const expectedDate = readFileSync("docs/cronograma.md", "utf8").match(
  /Atualizado em (\d{2}\/\d{2}\/\d{4})/,
)?.[1];
assert.ok(expectedDate);
const cases = [];
try {
  for (const [lang, width, height] of [
    ["pt-BR", 1440, 1000],
    ["en", 390, 844],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      locale: lang,
    });
    try {
      const page = await context.newPage(),
        errors = [];
      page.setDefaultTimeout(45000);
      page.on("pageerror", (e) => errors.push(e.message));
      assert.ok(
        (
          await page.goto(
            "http://127.0.0.1:4173/cronograma.html?view=technical&lang=" + lang,
          )
        ).ok(),
      );
      await page.locator("#roadmap-groups .roadmap-task").first().waitFor();
      assert.match(
        await page.locator("#roadmap-groups").textContent(),
        /G1.*Partição/,
      );
      assert.ok(
        (await page.locator("#roadmap-updated").textContent()).includes(
          expectedDate,
        ),
      );
      await page.screenshot({
        path: ".runtime/gautrais-roadmap-" + lang + ".png",
        fullPage: true,
      });
      await page.locator('[data-view="buhl"]').click();
      const b7 = page
        .locator(".roadmap-task")
        .filter({ hasText: "B7 — Calibrar" });
      assert.equal(await b7.count(), 1);
      assert.ok(!(await b7.getAttribute("class")).includes("is-done"));
      await b7.locator("summary").click();
      assert.match(await b7.textContent(), /Gautrais/);
      await page.goto("http://127.0.0.1:4173/?lang=" + lang);
      await page.locator("#loading").waitFor({ state: "hidden" });
      if (await page.locator("#tour-panel").isVisible())
        await page.locator("#tour-close").click();
      assert.equal(
        await page.locator("#biology-profile").inputValue(),
        "messor-narbonne@3",
      );
      assert.deepEqual(errors, []);
      cases.push({
        lang,
        width,
        height,
        roadmap: true,
        b7Pending: true,
        profile: "messor-narbonne@3",
        errors,
      });
    } finally {
      await context.close();
    }
  }
  const report = { browser: browser.version(), cases };
  writeFileSync(
    ".runtime/gautrais-browser.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
