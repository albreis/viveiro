import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { runDigAccess } from "../../src/modules/benchmarks/dig-access.ts";

const base = process.env.VIVEIRO_QA_BASE ?? "http://127.0.0.1:4173/";
const out = resolve(".runtime/dig-access-browser");
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  channel: "chrome",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const cases = [];
try {
  for (const lang of ["pt-BR", "en"]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1050 },
      locale: lang,
    });
    try {
      const page = await context.newPage(),
        errors = [];
      page.setDefaultTimeout(45000);
      page.on("pageerror", (e) => errors.push(e.message));
      assert.ok((await page.goto(base + "?lang=" + lang)).ok());
      await page.locator("#loading").waitFor({ state: "hidden" });
      if (await page.locator("#tour-panel").isVisible())
        await page.locator("#tour-close").click();
      assert.equal(
        await page.locator("#biology-profile").inputValue(),
        "messor-narbonne@3",
      );
      const description = await page.locator("#biology-preview").textContent();
      assert.match(
        description,
        lang === "pt-BR" ? /acesso físico/ : /physical access/,
      );
      await page.locator("#play").click(); // Fresh contexts start running.
      await page.waitForFunction(
        async () =>
          (await (await import("/src/services/session-store.ts")).readState())
            ?.running === false,
      );
      // Leave the running controller before writing a prepared QA save. Its
      // pagehide handler correctly backs up its own world on navigation.
      await page.goto(base + "galeria.html?lang=" + lang);
      const measured = await page.evaluate(async () => {
        const { prepareDigAccess, runDigAccess } =
          await import("/src/modules/benchmarks/dig-access.ts");
        const { writeState } = await import("/src/services/session-store.ts");
        const options = {
          seed: "BROWSER-DIG-ACCESS",
          workers: 50,
          profileVersion: 3,
          ticks: 120,
        };
        const world = prepareDigAccess(options),
          result = runDigAccess(options, world);
        const session = {
          version: 1,
          world: world.snapshot(),
          comparison: null,
          scenario: "a",
          initial: {
            seed: world.seed,
            params: { ...world.params },
            startMode: "established",
            biologicalProfile: world.biologicalProfile,
          },
          interventions: [],
          replaying: false,
          replayIndex: 0,
          running: false,
        };
        const saved = await writeState(session);
        if (!saved.ok) throw Error("QA session did not save");
        return {
          result,
          followId: (
            world.ants.find((a) => a.soilTask?.phase === "dig") ?? world.ants[0]
          ).id,
        };
      });
      assert.deepEqual(
        measured.result,
        runDigAccess({
          seed: "BROWSER-DIG-ACCESS",
          workers: 50,
          profileVersion: 3,
          ticks: 120,
        }),
      );
      await page.goto(base + "?lang=" + lang);
      await page.locator("#loading").waitFor({ state: "hidden" });
      await page.waitForFunction(
        () => document.getElementById("population").textContent.trim() === "50",
      );
      await page.locator("#view-side").click();
      await page.locator("#viewport").scrollIntoViewIfNeeded();
      await page
        .locator(".scene-card")
        .screenshot({ path: resolve(out, "side-" + lang + ".png") });
      await page.locator("#ant-select").selectOption(String(measured.followId));
      await page.locator("#follow-ant").click();
      await page.waitForFunction(
        () => !document.getElementById("exit-ant").hidden,
      );
      await page
        .locator("#viewport")
        .screenshot({ path: resolve(out, "ant-" + lang + ".png") });
      await page.locator("#exit-ant").click();
      await page.locator("#play").click();
      await page.waitForFunction(
        async () =>
          (await (await import("/src/services/session-store.ts")).readState())
            ?.world.tick > 120,
      );
      await page.locator("#play").click();
      assert.deepEqual(errors, []);
      cases.push({
        lang,
        description,
        population: 50,
        cliParity: true,
        firstPerson: true,
        resumed: true,
        errors,
      });
    } finally {
      await context.close();
    }
  }
  await writeFile(
    resolve(out, "report.json"),
    JSON.stringify({ browser: browser.version(), cases }, null, 2) + "\n",
  );
  console.log(JSON.stringify({ browser: browser.version(), cases }));
} finally {
  await browser.close();
}
