import { chromium } from "playwright-core";
import { resolve } from "node:path";
const browser = await chromium.launch({
  channel: "chrome",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  const context = await browser.newContext({
    viewport: { width: 1080, height: 760 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("console", (m) => console.log(m.type() + ": " + m.text()));
  page.on("pageerror", (e) => {
    (console.error(e.message), errors.push(e.message));
    console.error(e.message);
  });
  page.on("console", (m) => {
    if (m.type() === "error") console.error(m.text());
  });
  await page.goto("http://127.0.0.1:4173/scripts/divulgacao/saga/scene.html");
  await page.waitForFunction(
    () => Reflect.get(window, "ready") === true,
    {},
    { timeout: 60000 },
  );
  await page.locator("canvas").screenshot({
    path: resolve(
      "docs/divulgacao/saga-escavacao/assets/terrario-isometrico.png",
    ),
  });
  await page.evaluate(() => {
    const { scene: s } = Reflect.get(window, "viveiroCapture");
    s.setView("side");
    s.setInterior(true);
    s.camera.position.multiplyScalar(0.82);
    s.controls.update();
    s.render();
  });
  await page.locator("canvas").screenshot({
    path: resolve("docs/divulgacao/saga-escavacao/assets/terrario-tuneis.png"),
  });
  if (errors.length) throw Error(errors.join("\n"));
  console.log(
    "Two captures of the real World renderer saved; no user saves accessed.",
  );
} finally {
  await browser.close();
}
