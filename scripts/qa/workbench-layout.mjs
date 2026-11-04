import assert from "node:assert/strict";

export async function checkDesktopWorkbench(page) {
  const geometry = await page.evaluate(() => {
    const elements = (selector) => [...document.querySelectorAll(selector)];
    const box = (element) => element.getBoundingClientRect();
    const controls = elements(".secondary-controls > *");
    const analysis = document.querySelector(".analysis-band");
    const panels = elements(
      ".left-panel, .center-panel, .right-panel, #panel-soil",
    );
    return {
      onlyEnvironment:
        document.querySelector(".left-panel").children.length === 1 &&
        Boolean(document.querySelector(".left-panel > .environment")),
      sidebar: panels.map((panel) => ({
        position: getComputedStyle(panel).position,
        overflowY: getComputedStyle(panel).overflowY,
        hiddenHeight: panel.scrollHeight - panel.clientHeight,
      })),
      controls: controls.map((panel) => ({
        x: box(panel).x,
        top: box(panel).top,
        position: getComputedStyle(panel).position,
      })),
      analysisBottom: box(analysis).bottom,
    };
  });
  assert.equal(geometry.onlyEnvironment, true);
  assert.equal(geometry.controls.length, 3);
  assert.equal(new Set(geometry.controls.map((panel) => panel.x)).size, 3);
  assert.ok(
    geometry.controls.every(
      (panel) =>
        panel.top >= geometry.analysisBottom && panel.position === "sticky",
    ),
  );
  assert.ok(
    geometry.sidebar.every(
      (panel) => panel.overflowY === "visible" && panel.hiddenHeight <= 1,
    ),
  );
  assert.ok(
    geometry.sidebar.slice(0, 3).every((panel) => panel.position === "sticky"),
  );

  await page.locator(".colony-dock").evaluate((dock) => {
    scrollTo(0, scrollY + dock.getBoundingClientRect().top + 80);
  });
  await page.waitForFunction(() => {
    const header = document
      .querySelector(".colony-dock")
      .getBoundingClientRect();
    return scrollY > 0 && Math.abs(header.top - 16) <= 1;
  });
  await page.locator("#panel-soil > :last-child").evaluate((card) => {
    card.scrollIntoView({ block: "end" });
  });
  const bottom = await page.locator("#panel-soil > :last-child").boundingBox();
  assert.ok(bottom.y + bottom.height <= page.viewportSize().height + 1);
}
